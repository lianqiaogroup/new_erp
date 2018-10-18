<?php

require_once 'lib/ini.php';

if ($_POST['act'] && $_POST['act'] == 'getAttrPrice') {
    $product_id =0;
    if($_POST['product_id'])
    {
        $product_id = I("post.product_id",0,'intval');
    }
    $product->getIdentityTag($product_id);
    $ret = $product->getProduct($product_id);
    $data = $_POST;
    $data['price'] = $ret['price'];
    $data['combo'] = $ret['combo'];
    $class = new \lib\product_attr_price($register, $data);
    $retPrice = $class->getPrice();

    //格式化价格总数
    $new_currency_format = $product->getCurrencyFormat($ret['id_zone'], $retPrice['total'], $retPrice['total']);
    if (!empty($new_currency_format)) {
        $retPrice['new_price_format'] = $new_currency_format;
    } else {
        $retPrice['new_price_format'] = [];
    }

    echo json_encode($retPrice);
    exit;
}

$ret = $product->getProduct($product_id);

//判断是是否选择属相，显示对应属性图片
if (I("get.proto")) {
    $attr = I("get.proto");
    if (strpos($attr, '|') !== false) {
        $exAttr = explode('|', $attr);
        foreach ($exAttr as $row) {
            $id = explode('-', $row);
            $ids[] = end($id);
        }
    } else {
        $id = explode('-', $attr);
        $ids[] = end($id);
    }
    $class = new \lib\product_attr_price($register, $ret);
    $thumb = $class->getAttrThumb($ids);
    if(!$thumb) $thumb = $ret['thumb'];
    $ret['thumb'] = get_image_path($thumb);
}
//显示页面
$theme = $ret['theme'];
$ret['THEME'] = '/theme/' . $ret['theme'];
$ret['product_number'] = isset($_GET['count']) ? $_GET['count'] : 0;
setcookie('orderSubmitTimer', time(), time()+3600*24, '/');

// 自定义模版配置的数据
$module = new \lib\themeDiy($register);
$modules = $module->getModule($ret['product_id']);
// 兼容旧版style79
$ret['modules'] = $modules;
// 新模版配置数据
$modules = $modules['modules'];
for($i=0;$i<count($modules);$i++){
  $module_name = $modules[$i]['module_name'];
  $module_param = $modules[$i];
  $ret['modulesParam'][$module_name] = $module_param;
}
$ret['pageSign'] = 'checkout';
$view->display('checkout.twig', $ret);
$view->embedStatScript(3, $ret);
