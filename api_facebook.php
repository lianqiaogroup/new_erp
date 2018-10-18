<?php

require_once 'lib/ini.php';

if($_SERVER['REQUEST_METHOD'] != 'POST'){
    echo json_encode(['ret_code'=>500,'message'=>'非法操作!']);
    exit(0);
}

$erp_no = I('post.orderId');
$website = I('post.website');
$mobile = I('post.mobile');

$url = 'http://www.ouoho.com/log/fb';

$params = [
    'erp_no'=>$erp_no,
    'website'=>$website,
    'mobile'=>$mobile,
    'addtime'=>date('Y-m-d H:i:s',time())
];


$ret = post($url,$params);
if($ret['status'] == 1){
    $json = json_decode($ret['return'],JSON_UNESCAPED_UNICODE);
    if($json['code'] == 200){
        echo json_encode(['ret_code'=>200,'ret_msg'=>'success']);
    }else{
        echo json_encode(['ret_code'=>500,'ret_msg'=>'failed']);
    }
}else{
    echo json_encode(['ret_code'=>501,'ret_msg'=>'failed']);
}
exit(0);

