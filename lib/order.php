<?php
namespace lib;

class order{
    public $register;

    public function __construct($register)
    {
        $this->register = $register;
    }

    public function insert($data= [])
    {
        $ret = $this->register->get('db')->insert('order',$data);
        return $ret;
    }

    public function insertExpand($data=[]){
        $ret = $this->register->get('db')->insert('order_expand',$data);
        return $ret;
    }

    public function insertGoods($data)
    {
        return $this->register->get('db')->insert('order_goods',$data);
    }

    public function getOrder($order_no,$is_erp=0)
    {
        $map =['order_no'=>$order_no];
        if($is_erp)
        {
            $map =['erp_no'=>$order_no];
        }
        return $this->register->get('db')->get('order',"*",$map);
    }

    public function getOrderInfo($order_id,$order_no,$mobile=''){

        $map =['order_no'=>$order_no,'order_id'=>$order_id,'order_status[!]'=>'CANCEL'];
        if($mobile)
        {
            $map['mobile'] = $mobile;
        }
        return $this->register->get('db')->get('order',"*",$map);
    }

    public function getOrderGoodsAttr($order_goods_id)
    {

        $map = ['order_goods_id'=>$order_goods_id] ;
        $info = $this->register->get('db')->select('order_goods_attr',['product_attr_id'],$map);
        $product_attr_id = array_column($info,'product_attr_id');
        $name ='';
        if($product_attr_id)
        {
            $map = ['product_attr_id'=>$product_attr_id];
            $product_attr = $this->register->get('db')->select('product_attr',['name','thumb'],$map);
            foreach ($product_attr as $value)
            {
                $name .= $value['name'] .' ';
                if($value['thumb'])
                {
                    $thumb =  $value['thumb'];
                }
            }
        }
        $ret['name'] = $name;
        $ret['thumb'] = $thumb;
        return $ret;
    }
    public function getOrderGoods($order_id)
    {
        $map =['order_id'=>$order_id];
        $ret = $this->register->get('db')->select('order_goods',"*",$map);
        return $ret;
    }
    public function getProduct($product_id)
    {
        $map = ['AND'=>['product_id'=>$product_id,'is_del'=>0]] ;
        $product =  $this->register->get('db')->get('product','*',$map);

        return $product;
    }

    /**
     * 添加订单
     * @param array $data 订单数据
     * @return int 订单id
     */
    public function addOrder($data) {

        //过滤 指定数据
        $filterKeys = ['first_name', 'last_name', 'tel', 'email', 'address', 'addressStr', 'remark', 'zipcode', 'postal'];
        $data['post_erp_data'] = json_decode($data['post_erp_data'], true);
        $data = filterData($data, $filterKeys);
        $data['post_erp_data'] = json_encode($data['post_erp_data'], JSON_UNESCAPED_UNICODE);

        $number = $data['number'];
        $order_products = $data['goods_list'];
        $order_no = $data['orderNo'];
        $orderData = [
            'order_no' => $order_no,
            'name' => $data['first_name'], //名
            'last_name' => $data['last_name'], //姓
            'email' => $data['email'], //邮箱
            'mobile' => $data['tel'], //联系电话
            'title' => $data['title'],
            'address' => $data['addressStr'], //收货地址
            'order_msg' => "下单未付款",
            'payment_amount' => money_int($data['amount']),
            'pay_type' => $data['payment_name'],
            'erp_no' => $data['merchOrderNo'],
            'add_time' => $data['add_time'],
            'product_id' => $data['product_id'],
            'ip' => $data['ip'],
            'aid' => $data['aid'],
            'post_erp_data' => $data['post_erp_data'],
            'post_erp_msg' => $data['post_erp_msg'],
            'erp_status' => $data['erp_status'] ?: "SUCCESS",
            'num' => $number,
            'combo_id' => $data['combo_id'] ?: 0,
        ];
        $lastOrderId = $this->insert($orderData);

        //插入扩展表 jimmy
        $expand['order_id'] = $lastOrderId;
        $expand['memo'] = $data['remark'];
        $expand['domain'] = $data['domain'];
        $expand['postal'] = $data['postal']; //邮政编码;
        $expand['facebook_uid'] = !empty($_SESSION['user']['facebook']['facebook_uid']) ? $_SESSION['user']['facebook']['facebook_uid'] : 0;
        $expand['uuid'] = $_COOKIE['uuid'];
        $expand['utm_campaign'] = $_COOKIE['utm_campaign'];
        $this->insertExpand($expand);

        if ($order_products) {
            foreach ($order_products as $k => $g) {
                $orderGoods['title'] = $g['product_title'];
                $orderGoods['num'] = $g['qty'];
                $orderGoods['price'] = money_int($g['promotion_price']);
                $orderGoods['total'] = money_int($g['price']);
                $orderGoods['order_id'] = $lastOrderId;
                $orderGoods['erp_id'] = $g['id_product'];
                $orderGoods['product_id'] = $g['product_id'];
                //插入订单商品表
                $goods_id = $this->insertGoods($orderGoods);
                if (count($g['attrs']) > 0) {
                    // mike:修改套餐属性
                    foreach ($g['attrs'] as $a) {
                        $goods_attr['order_goods_id'] = $goods_id;
                        $goods_attr['product_attr_id'] = $this->getGoodsAttr($a, $g['product_id']);
                        //插入属性
                        $this->insertGoodsAttr($goods_attr);
                    }
                }
            }
        }

        //插入订单像素表
        $fb['order_id'] = $lastOrderId;
        $fb['domain'] = $data['domain'];
        $fb['product_id'] = $data['product_id'];
        $fb['add_time'] = $data['add_time'];
        $fb['is_show'] = $data['is_show_pixel'] ? $data['is_show_pixel'] : 0;
        $fbModel = new \lib\order_fb_pixel();
        $fbModel->add($fb);

        //添加订单属性数据
        $orderAttr = \lib\register::createInstance('\lib\OrderAttr');
        $orderAttr->add($lastOrderId);
        $key = 'order_'.$lastOrderId;
        $this->setQueryOrders($key, $data, 3600);

        return $lastOrderId;
    }

    /**
     * 设置订单查询缓存数据
     * @param $key
     * @param $data
     * @param int $expire
     * @return bool|\lib\cache\driver\type
     */
    public function setQueryOrders($key, $data, $expire=0){
        /**
         * @var $cache lib\cache\driver\Redis
         */
        $cache = \lib\register::getInstance("cache");
        return $cache?$cache->set($key, is_array($data)?json_encode($data):$data, $expire):false;
    }
    /**
     * @param $number
     * @param $product_id
     * @return 属性id
     * mike：返回属性id
     */
    public function getGoodsAttr($number,$product_id)
    {
        $map =['number'=>$number,'product_id'=>$product_id];
        return $this->register->get('db')->get('product_attr',"product_attr_id",$map);
    }

    public function getOrderCombo(){

    }

    /**
     * @param $ip
     * @param $product_id
     * @return mixed
     * 查询一小时内下单数
     */

    public function getIpOrderCount($ip,$product_id)
    {
        $strToTime = date("Y-m-d H:i:s",strtotime('-1 hour'));
        $map= ['AND'=>['add_time[>]'=>$strToTime,'ip'=>$ip,'product_id'=>$product_id]];
        $ret =  $this->register->get('db')->count('order',$map);
        return $ret;
    }

    public function insertGoodsAttr($data)
    {
        $this->register->get('db')->insert('order_goods_attr',$data);
    }

    public function updateOrderErpStatus($order_id,$status)
    {
        $data['erp_status'] =    $status ;
        $map['order_id'] = $order_id;
        $this->register->get('db')->update('order',$data,$map);
    }

    public  function  updateProductSales($product_id,$num){
        $map['product_id'] = $product_id;
        $data['sales[+]'] = $num;
        $this->register->get('db')->update('product',$data,$map);
    }

    public function updateErpStatus($order_no,$status,$msg)
    {
        $data['erp_status'] =    $status ;
        $data['post_erp_msg'] =   $msg;
        $map['order_no'] = $order_no;
        $this->register->get('db')->update('order',$data,$map);
    }

    /**
     * @param $order_no
     * @param $status
     * @param $msg
     * 更改订单状态
     */
    public function updateOrder($order_no,$status,$msg,$is_erp =0) {
        $data = ['order_status' =>$status,'order_msg'=>$msg];
        $map['order_no'] = $order_no;
        if($is_erp)
        {
            $map['erp_no'] = $order_no;
        }
        $this->register->get('db')->update('order',$data,$map);
    }

    /**
     * @param $data
     * @param $status
     * @param $msg
     * erp通信
     */
    public function erpTransport($data,$status,$msg)
    {
        $log = new \lib\log();
        //更新erp订单
        $erpData = array(
            'notify' => 'notify',
            'id' => $data['merchOrderNo'],
            'order_id' => $data['merchOrderNo'],
            'orderNo' =>  $data['orderNo'],
            'merchOrderNo' => $data['merchOrderNo'],
            'web_url' => getHttpHost(),
            'payment_status' => strtolower($status),
            'payment_details' => sprintf('%s {%s, %s}', $msg, $data['orderNo'], $data['merchOrderNo'])
        );
        $erpData['key'] = md5($erpData['order_id'].$erpData['web_url']);
        $send_url = 'http://erpapi.stosz.com:9090/order/api/payment';
        $log->write('Erp','支付结果数组组装=》'.json_encode($erpData,1));
        $ret = vpost($send_url,$erpData) ;
        $log->write('Erp','支付结果回调erp=》'.json_encode($ret,1));
        if(!$ret['status'])
        {
            $this->updateErpStatus($data['orderNo'],'FAIL','连接失败,超时或主机不稳定');
            exit;
        }
        //如果是成功支付，但是因为erp返回错误，认为通信失败。
        if($status=="SUCCESS")
        {
            $this->updateOrder($data['merchOrderNo'],'SUCCESS','支付成功',1) ;
            $return = json_decode($ret['return'],true);
            if(!$return['status'])
            {
                $this->updateErpStatus($data['orderNo'],'FAIL',$return['message']);
            }
            else{
                $this->updateErpStatus($data['orderNo'],'SUCCESS',"通信成功");

                //判断是否是异步还是同步回调
                $response_type = $data['response_type'];
                if ($response_type==1)
                {
                    echo 'receive-ok';
                    exit;
                }
            }
        }
    }

    /**
     * 支付结果
     */
    public function pay_result($rs){
        $data = $rs['data'];
        if(!$rs['ret'])
        {
            $this->updateOrder($data['orderNo'],'FAIL','支付失败');
            $ret['content'] =  $rs['msg'];
            $this->register->get('view')->display('/public/theme/error_pay.twig',$ret);
            exit;
        }
        if(!$data['success'] && environment != 'office')
        {
            $this->erpTransport($data,'SUCCESS',"支付成功");
        }

        header('Location:orders.php?no='.$data['orderNo'].'&key='.$data['order_id']);
    }
	
    /**
     * 支付结果(无跳转) 杨伟权
     */
    public function pay_result_without_redirect($rs){
        $data = $rs['data'];
        if(!$rs['ret'])
        {
            $this->updateOrder($data['orderNo'],'FAIL','支付失败');           
            exit;
        }
		
        if(!$data['success'] && environment != 'office')
        {
            $this->erpTransport($data,'SUCCESS',"支付成功");
        }
       
    }

    public function getOrderNo($id_department,$ip){
        $department = [
            1=>1,
            2=>2,
            3=>3,
            4=>4,
            5=>5,
            6=>6,
            7=>7,
            14=>8,
            17=>9,
            19=>10,
            21=>11,
            23=>12,
            26=>13,
            28=>15,
            30=>14,
            32=>98,
            34=>99,
            36=>16,
            38=>17,
            40=>18,
            42=>19,
            44=>20,
            46=>21,
            48=>51,
            50=>97,
            52=>96,
            54=>28,
            56=>27,
            58=>25,
            60=>26,
            62=>23,
            64=>22,
            66=>24,
            68=>61,
            74=>30,
            76=>31,
            78=>32,
            80=>33,
            82=>34,
            84=>35,
            86=>36,
            88=>37,
            90=>38,
            92=>39,
            94=>40,
            96=>41,
            100=>50,


        ];
        //4为随机数，直接取ip吧，然后随机在ip里面组合随机取4个值
        $ip2long = ip2long($ip);
        $str ='';
        $len = strlen($ip2long)-1;
        if($ip2long && $len > 3)
        {
            for($i=0;$i<4;$i++)
            {
                $j = rand(0,$len);
                $str .= substr($ip2long,$j,1);
            }
        }else{
            $str = rand(1000,9999);
        }
        return '1'.date('ymdHis',time()).substr(microtime(), 2, 2).$str;
        //return $department[$id_department].date("ymdhis",time()).rand(1000,9999);
    }
}