<?php
/**
 * Created by PhpStorm.
 * User: jimmy
 * Date: 2017/7/24
 * Time: 下午3:30
 * 取消订单
 */
require_once 'lib/ini.php';

$key = I("post.key");
$orderNo = I("post.no");
$mobile =I('post.mobile');

$order = new \lib\order($register);
$langs = $lang->getLang();
$orderInfo = $order->getOrderInfo($key,$orderNo,$mobile) ;
if(empty($orderInfo))
{
    echo  json_encode(['ret'=>0,'msg'=>$langs['cancel_fail']]);
    exit;
}
//cancel
$ret  = $order->orderCancel($orderInfo['erp_no'],$langs);
echo  json_encode($ret);