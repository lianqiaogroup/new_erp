<?php
require_once __DIR__ . '/lib/ini.php';

$region =  new \lib\region($register);

if( isset($_POST['region_id']) && ctype_digit($_POST['region_id']) )
{
    $id = $_POST['region_id'];
    $region  =$region->getSonRegion($id);
    echo json_encode( $region);

}
elseif( isset($_POST['yn_region_id']) && ctype_digit($_POST['yn_region_id']) )
{
    $id = $_POST['yn_region_id'];
    $region  =$region->getYnSonRegion($id);
    echo json_encode( $region);
}elseif( isset($_POST['parent_id']) && $_POST['parent_id'] && $_POST['act'] == 'getcode'){
    $id = $_POST['parent_id'];
    $region = $region->getMLXYCode($id);
    echo json_encode( $region);
}
elseif($_POST['filed'] && $_POST['id_zone']){
    $id_zone = $_POST['id_zone'];
    $filed = $_POST['filed'];
    $type = $_POST['type']? 1:0;
    $region  =$region->getMLXYArea($filed,$_POST['id_zone'],$type);
    echo json_encode( $region);
}
elseif($_POST['postName']){
    $postName = $_POST['postName'];
    $region  =$region->getZoneOfCode($postName);
    echo json_encode( $region);
}
elseif($_POST['name'] && $_POST['id_zone']){
    $name = $_POST['name'];
    $id_zone = $_POST['id_zone'];
    echo json_encode($region->getZonename($id_zone,$name));
}else{
    echo json_encode( []);

}