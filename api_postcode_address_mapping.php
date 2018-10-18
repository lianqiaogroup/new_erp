<?php
require_once __DIR__ . "/lib/ini.php";

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['ret' => 0, 'ret_msg' => '非法操作']);
    exit(0);
}
$zoneName  = '马来西亚';
$res = $register->get("db")->get('zone',['id_zone','title'],['title'=>$zoneName]);

$idZone = I("post.id_zone")?I("post.id_zone"):$res['id_zone'];
if (I("post.postName") && $idZone) {
    $postCode = I('post.postName', 0, 'intval');
} else {
    echo json_encode(['ret' => 0, 'ret_msg' => '缺少参数']);
    exit(0);
}

$ynRegions = new \lib\region($register);
$results = $ynRegions->getYnRegionBypostCode($postCode, $idZone);
if ($results) {
	echo json_encode(['ret' => 1, 'data' => $results]);
} else {
	echo json_encode(['ret' => 0, 'ret_msg' => '数据为空']);
}
exit;





