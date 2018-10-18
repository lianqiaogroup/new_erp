<?php
require_once 'lib/ini.php';

$data = $_REQUEST;
if($data['code'] == 'esp')
{
    $pay = new \lib\esp();
    $rs = $pay->respond($data,$register);

}
elseif($data['code'] =='paypal')
{
     $pay = new \lib\paypal();
     $rs = $pay->respond($register,$data);
}
elseif($data['code'] =='bill')
{
    $pay = new \lib\asiaBill();
    $rs = $pay->respond($register);
}
elseif($data['code'] =='ocean')
{
    $pay = new \lib\ocean();
    $data = file_get_contents('php://input');
    $rs  = $pay->response($register,$data);
}
elseif($data['code'] =='moneyBrace')
{
    $pay = new \lib\moneyBrace();
    $rs  = $pay->response($register,$data);
}
$orders = new \lib\order($register);
$orders->pay_result($rs);





