<?php
require_once 'lib/ini.php';
//写日志
$log = new \lib\log();
$noticeRecord = new \lib\paymentNotice($register);

$bluePay = new \lib\bluePay($register);
$response_data = I('get.');
//print_r($response_data);exit;
$response = $bluePay->response($register,$response_data,$noticeRecord);
print_r($response);