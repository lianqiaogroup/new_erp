<?php
namespace lib;

class order_quality{
    public $register;

    public function __construct($register)
    {
        $this->register = $register;
    }

    public function __get($key){
        return $this->register->get($key);
    }

    /**
     * 根据电话号码查询订单
     * 返回订单列表，并分页
     * @param string $filter
     * @return mixed
     */
    public function orderListWithMobile($filter = '')
    {
//        unset($filter['order.product_id']);//根据需求，修改条件，限定同域名同手机即可
        $map = ['ORDER' => ['order.add_time' => "DESC", 'order.order_id' => "DESC"]];
        if ($filter) {
            $filter = ['AND' => $filter];
            $map = array_merge($map, $filter);
        }
        if(!empty($_SERVER['HTTP_HOST'])){
            $map['AND'] = array_merge($map['AND'],['product.domain'=>$_SERVER['HTTP_HOST']]);
        }

        //设置分页
        $pageSize = 5;
        $page = isset($_GET['pnum']) ? (int)$_GET['pnum']:1;
        $page = ($page<=0)?1:$page;
        $start =   ($page -1)* $pageSize;
        $limit =['LIMIT'=>[$start,$pageSize]];
        $maps = array_merge($map,$limit);

        $joinCondition = ['[>]order_expand'=>['order_id'=>'order_id'],'[>]product'=>['product_id'=>'product_id']];
        $fields = [
            'order.order_id', 'order.order_no', 'order.erp_no', 'order.product_id', 'order.num', 'order.title',
            'order.name', 'order.last_name', 'order.mobile', 'order.erp_status', 'order.address',
            'order.payment_amount', 'order.pay_type', 'order.add_time', 'order_expand.postal',
            'order_expand.memo', 'product.domain', 'product.id_zone'
        ];

        $data['goodsList'] = $this->register->get('db')->select('order', $joinCondition,$fields,$maps);
        //查询订单，计算订单总数
        $count = $this->register->get('db')->count("order",['[>]product'=>['product_id'=>'product_id']],['order.order_id'],$map);

        if ($data['goodsList']) {
            $ret=[];
            $product_id = array_unique(array_column($data['goodsList'], 'product_id'));
            $product = $this->getProduct($product_id);
            $erp_no_list = array_column($data['goodsList'], 'erp_no');
            $erp_info_list = $this->getOrderErpInfoList($erp_no_list);

            //格式化价格
            $productMod     = new product($this->register, '', '');

            foreach ($data['goodsList'] as $key=>$value) {
                $value['payment_amount'] = money_int($value['payment_amount'], 'float');
                $value['thumb'] = \lib\product::getResourceUrl($product[$value['product_id']]['thumb'], $value['product_id'], 1);
                $value['postal'] = I('data.postal/s', '', '', $value);
                $value['memo'] = (string)$value['memo'];
                $value['currency_code'] = $product[$value['product_id']]['currency_code'];
                $value['currency_prefix'] = $product[$value['product_id']]['currency_prefix'];
                $value['detail_url'] = '/order_quality.php?order_id='.$value['order_id'];

                $payment_amount = round($value['payment_amount'], 0);
                $id_zone        = $value['id_zone'];
                $new_currency_format = $productMod->getCurrencyFormat($id_zone, $payment_amount, $payment_amount);
                //已经转化好的格式
                $value['new_price_format'] = $new_currency_format;

                if(!empty($erp_info_list[$value['erp_no']]) ){
                    $value['erp_info'] = $erp_info_list[$value['erp_no']];
                }else{
                    $value['erp_info'] = ['id_order_status'=>'1','shipping_name'=>'','date_delivery'=>'','remark'=>''];
                }
                $ret[] = $value;
            }
            $data['goodsList'] = $ret;
            $data['p'] = $page;
            $data['total_p'] = ceil ( $count / $pageSize );
            $data['count']  = $count;
            $data['pageHtml'] = $this->register->get('db')->Pagebarht(['p'=>$page],$pageSize,$page,$count);
            
        }
        return $data;
    }

    function getCurrency($product_id){
        $res = $this->register->get('db')->get('product',['product.currency_code','product.currency_prefix'],['product_id'=>$product_id]);
        return $res?$res:['currency_code'=>0,'currency_prefix'=>''];
    }

    /**
     * 查询单个产品信息
     * @param $product_id   产品ID
     * @return array
     */
    public function getProduct($product_id)
    {
        $map['product_id'] = $product_id;
        $data = $this->register->get('db')->select("product", ['currency_code','currency_prefix', 'thumb', 'product_id'], $map);
        $data = array_column($data, NULL, 'product_id');
        return $data;
    }

    /**
     * 根据订单ID 查询订单详情
     * @param $order_id
     * @param $order_no
     * @return mixed
     */
    public function getOrder($order_id, $order_no)
    {
        $map = ['ORDER' => ['order.add_time' => "DESC", 'order.order_id' => "DESC"]];

        if ($order_id) {
            $filter = ['AND' => ['order.order_id' => $order_id, 'order.order_no'=>$order_no]];
            $map = array_merge($map, $filter);
        }

        //查询字段
        $joinCondition = ['[>]order_expand' => ['order_id' => 'order_id'],
            '[>]product' => ['product_id' => 'product_id'],
            '[>]combo' => ['combo_id' => 'combo_id']
        ];

        $fields = ['order.order_id', 'order.order_no', 'order.erp_no', 'order.product_id', 'order.num', 'order.title',
            'order.name', 'order.last_name', 'order.mobile', 'order.erp_status', 'order.address',
            'order.payment_amount', 'order.pay_type', 'order.add_time', 'order.email', 'order_expand.postal',
            'order_expand.memo', 'order.combo_id', 'combo.title(combo_title)', 'product.currency_code',
            'product.currency_prefix', 'product.thumb', 'product.id_zone', 'product.product_id'
        ];

        // 定义查询属性
        $data['goodsList'] = $this->register->get('db')->select('order', $joinCondition,$fields,$map);
        if ($data['goodsList']) {
            $erp_no_list = array_column($data['goodsList'], 'erp_no');
            $erp_info_list =[] ;// $this->getOrderErpInfoList($erp_no_list);

            //格式化价格
            $productMod     = new product($this->register, '', '');
            foreach ($data['goodsList'] as $value) {

                $value['combo_title'] = (string)$value['combo_title'];
                $value['payment_amount'] = money_int($value['payment_amount'], 'float');

                //请求货币格式化
                $id_zone        = $value['id_zone'];
                $payment_amount = round($value['payment_amount'], 0);
                $new_currency_format = $productMod->getCurrencyFormat($id_zone, $payment_amount, $payment_amount);
                //已经转化好的格式
                $value['new_price_format'] = $new_currency_format;
                $num_len = empty($new_currency_format['num_len']) ?  0:$new_currency_format['num_len'];
                $symbol  = empty($new_currency_format['symbol'])  ? '':$new_currency_format['symbol'];

                $value['currency_code'] = (string)$value['currency_code'];
                $value['currency_code'] = (string)$value['currency_code'];
                $value['postal'] = (string)$value['postal'];
                $value['memo'] = (string)$value['memo'];
                $value['orderGoods'] = $this->getOrderProducts($value['order_id'],$value['combo_id'], $num_len, $symbol);
                $_total = $value['orderGoods']['_total'];
                if(($value['payment_amount'] == $_total) || ($value['payment_amount'] == ceil(money_int($_total, 'float')) )){
                    $value['show_detail'] = '1';
                }else{
                    $value['show_detail'] = '0';
                }
                $value['orderGoods'] = $value['orderGoods'][$value['order_id']];
                if(!empty($erp_info_list[$value['erp_no']]) ){
                    $value['erp_info'] = $erp_info_list[$value['erp_no']];
                }else{
                    $value['erp_info'] = ['id_order_status'=>'1','shipping_name'=>'','date_delivery'=>'','remark'=>''];
                }
                unset($value['post_erp_data']);
                unset($value['aid']);
                unset($value['post_erp_msg']);
                $value['thumb'] = \lib\product::getResourceUrl($value['thumb'], $value['product_id'], 1);
                $ret[] = $value;
            }
            $data['goodsList'] = $ret;
        }
        unset($data['pageHtml']);
        return $data;
    }

    /**
     * 获取订单状态
     * @param int $order_id
     * @param string $order_no
     * @return null|array 订单状态
     */
    public function getOrderStatus($order_id, $order_no)
    {
        if (empty($order_no) || empty($order_id)) {
            return null;
        } else {
            $filter = ['order_id' => $order_id, 'order_no'=>$order_no];
            $data = $this->register->get('db')->get('order', 'erp_status', $filter);
            if (empty($data)) {
                return null;
            } else {
                return $data;
            }
        }
    }

    /**
     * 查询套餐标题
     * @param $combo_id
     * @return null
     */
    public function getComboTitle($combo_id)
    {
        if ($combo_id) {
            $map['combo_id'] = $combo_id;
            $data = $this->register->get('db')->select('combo', '*', $map);
            if ($data) {
                return $data[0]['title'];
            } else {
                return "";
            }
        } else {
            return "";
        }
    }


    /**
     * 2017-10-12 10:30 chenhk
     * 查询订单货品详情，用于详情页面 货品细分，包含促销价格
     * @param $order_id
     * @param $combo_id
     * @param int $num_len
     * @param string $symbol
     * @return array
     */
    public function getOrderProducts($order_id, $combo_id, $num_len=0, $symbol = '')
    {
        $map['order_goods.order_id'] = $order_id;

        $joinCondition = ['[>]product'=>['product_id'=>'product_id'],'[>]order'=>['order_id'=>'order_id']];
        $fields = [
            'order_goods.order_goods_id', 'order_goods.title', 'order_goods.price(gprice)',
            'product.market_price(price)', 'order_goods.order_id', 'order_goods.num',
            'order_goods.total', 'order_goods.product_id', 'product.sales_title', 'product.thumb', 'order.num(onum)','order.product_id(order_product_id)',
        ];
        $data = $this->register->get('db')->select('order_goods',$joinCondition,$fields,$map);
        $info = [];
        if (is_array($data) && (count($data)>0) ) {

            //实例化product实体
            if ($num_len != 0 && !empty($symbol)) {
                $productMod = new product($this->register, '', '');
            }

            $order_goods_id = array_column($data, 'order_goods_id');
            $goods_attr = $this->getOrderGoodsAttr($order_goods_id);
            $_index = [];
            foreach ($data as $goods) {
                $key = $goods['order_id'];
                $goods['price'] = money_int($goods['price'], 'float');
                $goods['total'] = money_int($goods['total'], 'float');
                $goods['attr']  = $goods_attr[$goods['order_goods_id']];

                #jade 因为订单没有区分保存 套餐内部相同产品id的情况，目前通过自定义下标区分列出所有的
                if(!isset($_index[$goods['product_id'].'_'.$goods['num']])){
                    $_index[$goods['product_id'].'_'.$goods['num']] = 1;
                }else{
                    $_index[$goods['product_id'].'_'.$goods['num']] = $_index[$goods['product_id'].'_'.$goods['num']] + 1;
                }
                // var_dump($goods['onum']);
                $goods['onum'] = empty($goods['onum'])?1:$goods['onum'];
                $p = $this->getPromotionPrice($combo_id,$goods['product_id'],$goods['num']/$goods['onum'],$_index[$goods['product_id'].'_'.$goods['num']]);

                $goods['promotion_price']   = money_int($goods['gprice'], 'float');
                $goods['sales_title']       = empty($p['sale_title'])?$goods['sales_title']:$p['sale_title'];

                //将价格显示成转化的价格
                if ($num_len != 0 && !empty($symbol)) {
                    $goods['price_format'] = $productMod->formatPrice($num_len, $symbol, round($goods['price'], 0));
                    $goods['total_format'] = $productMod->formatPrice($num_len, $symbol, round($goods['total'], 0));
                    $goods['promotion_price_format'] = $productMod->formatPrice($num_len, $symbol, round($goods['promotion_price'], 0));
                } else {
                    $goods['price_format']              = $goods['price'];
                    $goods['total_format']              = $goods['total'];
                    $goods['promotion_price_format']    = $goods['promotion_price'];
                }
                $goods['thumb'] = \lib\product::getResourceUrl($goods['thumb'], $goods['order_product_id'], 1);

                $info[$key][] = $goods;
                $info['_total'] += $goods['total'];
            }
        }
        return $info;
    }

    function getPromotionPrice($combo_id,$product_id,$num,$index){
        if(!$combo_id){
            $map = ['product_id'=>$product_id,'LIMIT'=>[$index-1,1]];
            $p = $this->register->get('db')->select("product", ['sales_title(sale_title)','price(promotion_price)'], $map);
            $p[0]['p_price'] = $p[0]['promotion_price'];
            $p[0]['promotion_price'] = money_int($p[0]['promotion_price'], 'float');
            return $p[0];
        }
        $map = ['combo_id'=>$combo_id,'product_id'=>$product_id,'num'=>$num,'LIMIT'=>[$index-1,1]];
        $p = $this->register->get('db')->select("combo_goods", ['sale_title','promotion_price'], $map);
        $p[0]['p_price'] = $p[0]['promotion_price'];
        $p[0]['promotion_price'] = money_int($p[0]['promotion_price'], 'float');
        return $p[0];
    }

    /**
     * 查询订单信息
     * @param $order_id
     * @param $combo_id
     * @return array
     */
    public function getOrderGoods($order_id, $combo_id)
    {
        $map['order_id'] = $order_id;
        $data = $this->register->get('db')->select("order_goods", '*', $map);
        $info = [];
        if ($data) {
            $order_goods_id = array_column($data, 'order_goods_id');
            $goods_attr = $this->getOrderGoodsAttr($order_goods_id);
            foreach ($data as $goods) {
                $key = $goods['order_id'];
                $goods['price'] = money_int($goods['price'], 'float');
                $goods['total'] = money_int($goods['total'], 'float');
                $goods['attr'] = $goods_attr[$goods['order_goods_id']];
                $info[$key][] = $goods;
            }
        }
        return $info;
    }

    public function getOrderGoodsAttr($order_goods_id)
    {
        $map['order_goods_id'] = $order_goods_id;
        
        $data = $this->register->get('db')->select("order_goods_attr", '*', $map);
        if ($data) {
            $product_attr_id = array_column($data, 'product_attr_id');
            $product_attr = $this->getProductAttr($product_attr_id);
            //获取订单产品id
            $joinCondition = ['[>]order'=>['order_id'=>'order_id']];
            $productId = \lib\register::getInstance('db')->get("order_goods", $joinCondition,'order.product_id', $map);
            foreach ($data as $attr) {
                $product_attr[$attr['product_attr_id']]['thumb'] = \lib\product::getResourceUrl($product_attr[$attr['product_attr_id']]['thumb'], $productId, 1);
                $ret[$attr['order_goods_id']][] = $product_attr[$attr['product_attr_id']];
                //$ret[$attr['order_goods_id']][] = $product_attr[$attr['product_attr_id']];
            }
        }
        return $ret;
    }

    public function getProductAttr($product_attr_id)
    {
        $map['product_attr_id'] = $product_attr_id;
        $data = $this->register->get('db')->select("product_attr", ['name','number','product_id','thumb','product_attr_id'], $map);
        $data = array_column($data, NULL, 'product_attr_id');
        return $data;
    }

    function getOrderErpInfo($order_id){
        $t = time();
        #$url = 'http://erp.stosz.com:9090/order/api/get_order_status';
        $config = DI();
        $url = $config['erp_uri'].'/order/api/get_order_status';
        #$order_id = '211709060340481013';//test
        $params = ['time'=>$t,'key'=>md5($t.'stosz'),'orderdata'=>json_encode([$order_id])];
        $res = $this->sendPost($url,$params);
        if($res['status']){
            $res = json_decode($res['message'],1);
            if(empty($res[0]) ){
                return ['id_order_status'=>'1','shipping_name'=>'','date_delivery'=>'','remark'=>''];
            }else{
                #TODO 更新数据库
                return $res[0];
            }
        }else{
            return ['id_order_status'=>'1','shipping_name'=>'','date_delivery'=>'','remark'=>''];
        }
    }
    
    function getOrderErpInfoList($oid_list){
        if(!is_array($oid_list) || count($oid_list) <1){
            return [];
        }
        $t = time();
        $config = DI();
        $url = $config['erp_uri'].'/order/api/get_order_status';
        $cache = null;//不使用缓存
        // $cache = register::getInstance('cache');
        // $key = md5(json_encode($oid_list));
        // $cache->del($key);
        $key = '';
        if( $cache && $cache->has($key)){
            $value = $cache->get($key);
            if(!$value) return [];
            $value = unserialize($value);
            return $value;
        }else{
            $params = ['time'=>$t,'key'=>md5($t.'stosz'),'orderdata'=>json_encode($oid_list)];
            $log = new \lib\log();
            $log->write('getOrderStatus',"发送data".json_encode($params,true));
            $res = $this->sendPost($url,$params);
            $log->write('getOrderStatus',"接收data".json_encode($res,true));
            if($res['status']){
                $res = json_decode($res['message'],1);
                if(is_array($res['data']) && !empty($res['data'][0]) ){
                    $res = array_column($res['data'],null,'id_increment');
                    if($cache){$cache->set($key,serialize($res),600);}
                    ## 访问量大的时候 再启用队列入库
                    $stime = date('Y-m-d 00:00:00',time());
                    $sql = "SELECT o.order_id,o.erp_no,oe.order_id as _order_id,oe.erp_code,oe.order_code FROM `order` o LEFT JOIN order_expand oe  on oe.order_id=o.order_id  WHERE o.erp_no IN (".implode($oid_list, ',').") and o.add_time>='".$stime."'";

                    //服务IP：ip-172-31-16-8,
                    //错误信息：[02-Jul-2018 23:24:22 Asia/Shanghai] PHP Fatal error:
                    //  Call to a member function fetchAll() on boolean
                    // in /home/cuckoo/www/webserver/lib/order_quality.php on line 432
                    $pdoStatement = $this->register->get('db')->query($sql);
                    if($pdoStatement){
                        $list = $pdoStatement->fetchAll();
                    }else{
                        $list = [];
                    }

                    foreach ($list as $key => $value) {
                        if(empty($res[$value['erp_no']]['id_order_status'])){
                            $erp_code = '1';
                        }else{
                            $erp_code = $res[$value['erp_no']]['id_order_status'];
                        }
                        if(empty($value['_order_id'])){
                            $this->register->get('db')->insert("order_expand",['order_id'=>$value['order_id'],'erp_code'=>$erp_code,'order_code'=>$this->getOrderCode($erp_code)]);//状态入库--新增
                        }else{
                            if($value['erp_code'] != $erp_code){
                                $this->register->get('db')->update("order_expand",['erp_code'=>$erp_code,'order_code'=>$this->getOrderCode($erp_code)],['order_id'=>$value['order_id']]);//状态入库--更新
                            }
                        }
                    }
                    return $res;
                }
                if($cache){$cache->set($key,'',600);}
                return [];
            }else{
                if($cache){$cache->set($key,'',600);}
                return [];
            }    
        }
    }

    public function getOrderCode($erp_code = '')
    {
        switch ($erp_code) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '17':
            case '22':
            case '25':
            case '26':
                return '1';//待发货
                break;
            case '8':
            case '18':
            case '27':
                return '2';//已发货
                break;
            case '9':
                return '3';//已收货
                break;
            case '11':
            case '12':
            case '13':
            case '14':
            case '19':
                return '11';//已取消
                break;
            case '15':
                return '21';//待退货
                break;
            case '16':
                return '22';//退货中
                break;
            case '10':
            case '21':
            case '23':
            case '24':
                return '23';//已退货
                break;
            default:
                return '1';//待发货
                break;
        }
    }

    

    function sendPost($url,$data,$headers=[]){
        #'Content-Type:application/x-www-form-urlencoded'
        $curl = curl_init();
        curl_setopt($curl,CURLOPT_URL,$url);
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl,CURLOPT_POST,1);
        curl_setopt($curl,CURLOPT_POSTFIELDS,$data);
        $result = curl_exec($curl);
        $retdata['status'] = 1;

        if($error = curl_error($curl)){
            $retdata['status'] = 0;
            $retdata['message'] = $error;
        }else{
            $retdata['message'] = $result;
        }
        curl_close($curl);
        return $retdata;
    }

    /**
     * GET方法
     * @param $url
     * @return mixed
     */
    function sendGet($url){
        $curl = curl_init();
        curl_setopt($curl,CURLOPT_URL,$url);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, False);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
        $result = curl_exec($curl);
        $retdata['status'] = 1;

        if($error = curl_error($curl)){
            $retdata['status'] = 0;
            $retdata['message'] = $error;
        }else{
            $retdata['message'] = $result;
        }
        curl_close($curl);
        return $retdata;
    }

}