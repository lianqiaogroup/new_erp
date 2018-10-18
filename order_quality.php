<?php
// +----------------------------------------------------------------------
// |[ 订单查询入口 ]
// +----------------------------------------------------------------------
// +----------------------------------------------------------------------
// | Team:   Cuckoo
// +----------------------------------------------------------------------
// | Date:   2018/2/8 10:53
// +----------------------------------------------------------------------


require_once 'lib/ini.php';


/**
 * 按电话查询订单列表
 * mobile:手机变量参数
 */
if (isset($_GET['mobile'])) {

    if(!empty($_GET['identity_tag']))$identity_tag = $_GET['identity_tag'];
    // 匹配手机号码是否
    $mbNumber = $_GET['mobile'];
    if (preg_match("/^[0-9]{8,13}$/", $mbNumber)) {
        $key = 'mobile_query_'.$server_name.(!empty($identity_tag)?$identity_tag:'').$mbNumber;
        $ret = getQueryOrders($key);
        if ($ret){
            $ret = json_decode($ret,true);
            if (JSON_ERROR_NONE !== json_last_error()){
                $ret = null;
            }
        }
        if (empty($ret)){
            $product_id = $product->getProductIdWithType($identity_tag);
            $order = new \lib\order_quality($register);
            $filter['order.mobile'] = $mbNumber;
            $filter['order.product_id'] = $product_id;
            $ret = $order->orderListWithMobile($filter);
            setQueryOrders($key, $ret, 86400*15);// 数据缓存30天
        }

        echo json_encode(['code' => 200, 'msg' => '查询数据成功', 'data' => $ret]);
    } else {
        echo json_encode(['code' => 400, 'msg' => '电话号码格式不正确', 'goodsList' => []]);
    }
}


/**
 * 查询订单详情
 */
else if (isset($_GET['order_id'])) {//订单详情页面 异步获取订单产品数据
    // 匹配手机号码是否
    $order_id = $_GET['order_id'];//订单id
    $order_no = $_GET['order_no'];//订单编号
    
    if (empty($order_no) || empty($order_id)) {
        \lib\Util::ajaxReturn(['code' => 400, 'msg' => '订单查询参数格式有误', 'goodsList' => []]);
    }
    
    if (!preg_match("/^[1-9]\\d*$/", $order_id)) {
        \lib\Util::ajaxReturn(['code' => 400, 'msg' => '订单查询参数格式有误', 'goodsList' => []]);
    }
    
    //获取订单产品数据
    $order = new \lib\order_quality($register);
    $data = $order->getOrder($order_id, $order_no);
    
    \lib\Util::ajaxReturn(['code' => 200, 'msg' => '查询数据成功', 'data' => $data]);
    
}
else {//订单详情页面

    //if has home page
    /**
     * @var \Medoo\Medoo $db
     */
    $db = lib\register::getInstance('db');
    $site['has_home'] = false;
    $domain = $server_name?:$db->get('product','domain', ['identity_tag'=>$identity_tag]);
    if(is_string($domain) && strlen($domain) > 0){
        $siteInfo = $db->get('site', ['title','domain'],
            [ 'AND' => [ 'domain[~]' =>  $domain. "%", 'is_del' => 0 ] ]);
        if ($siteInfo) {
            $site['has_home'] = true;
            $site['home_title'] = $siteInfo['title'];
            //获取文章列表
            $site['home_article'] = $db->select('article', [
                'article_id', 'title', 'content', 'add_time', 'sort', 'aid'
            ], ['domain'=>$siteInfo['domain'], 'is_del'=>0, 'ORDER' => ['sort'=>'DESC']]);
        }
    }
    // end if

    if (!empty($_GET['order']) && !empty($_GET['order_no'])) {
        $key = 'order_query_'.$_GET['order_no'];

        $ret = getQueryOrders($key);
        if ($ret){
            $ret = json_decode($ret,true);
            if (JSON_ERROR_NONE !== json_last_error()){
                $ret = null;
            }
        }
     
        if (empty($ret)){
            //订单详情初始页面
            $order = new \lib\order_quality($register);
            $data = $order->getOrderStatus($_GET['order'], $_GET['order_no']);
            $ret = $product->getLangAndThemeByOid($_GET['order'],$server_name);

            if (!empty($data) && $data != 'SUCCESS') {
                $ret['lang']['order_detail'] = '下单失败';
                $ret['lang']['order_submit_submit'] = $ret['lang']['order_submit_fail'];
                $ret['lang']['buy_know'] = null;
                $ret['lang']['warming'] = null;
            }
            //查询yahooID
            $ret['google_etc'] = $product->getProductGoogleExt($ret['product_id']);
            setQueryOrders($key, $ret, 86400);// 数据缓存一天
        }
    }else{

        //订单手机号查询页面
        $ret = $product->getLangAndThemeByTag($server_name,$_SESSION['identity_tag']);

        //查询yahooID
        $ret['google_etc'] = $product->getProductGoogleExt($ret['product_id']);
    }

    $ret['THEME'] = '/theme/'.$ret['theme'];
    $ret['lang']['buy_know'] = sprintf($ret['lang']['buy_know'], $ret['service_email'], $ret['service_email']);
    $ret['lang']['warming'] = sprintf($ret['lang']['warming'], $ret['service_email'], $ret['service_email']);
    $ret['domain'] = $server_name;
    $ret = array_merge($ret, $site);
    $view->display('inquiry.twig',$ret);

}

/**
 * 获得订单查询缓存数据
 * @param $key
 * @return bool|string
 */
function getQueryOrders($key)
{
    /**
     * @var $cache lib\cache\driver\Redis
     */
    $cache = \lib\register::getInstance("cache");
    if ($cache && $cache->has($key)){
        return $cache->get($key);
    }
    return false;
}

/**
 * 设置订单查询缓存数据
 * @param $key
 * @param $data
 * @param int $expire
 * @return bool|\lib\cache\driver\type
 */
function setQueryOrders($key, $data, $expire=0){
    /**
     * @var $cache lib\cache\driver\Redis
     */
    $cache = \lib\register::getInstance("cache");
    return $cache?$cache->set($key, is_array($data)?json_encode($data):$data, $expire):false;
}