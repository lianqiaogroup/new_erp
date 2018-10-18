<?php
require_once 'lib/ini.php';
/*
//写日志
$log = new \lib\log();
$log->write('order', "用户提交数据==》" . print_r($_POST, 1));
if (I("post.product_id")) {
    $product_id = I('post.product_id', 0, 'intval');
    $ret = $product->getProduct($product_id);
} else {
    $ret = $product->getProduct();
}

$theme = $ret['theme'];
//判断数据
//验证token
//控制下单频率   1小时超过10单认为是恶意下单
$token = I("post.token");
$orders = new lib\order($register);
$ip = getIp();
$IpCount = $orders->getIpOrderCount($ip, $ret['product_id']);
//$IpCount =0;
$number = I("post.num", 1, 'intval');
$referer = $_SERVER['HTTP_REFERER'];
if ($IpCount > 20) {
    if ($ret['lang']['submit_order_too_fast']) {
        die($ret['lang']['submit_order_too_fast']);
    } else {
        die("Frequent orders, please try again after one hour");
    }

}
if (strtoupper($_SERVER['REQUEST_METHOD']) != 'POST' || !$_POST['name'] || !$_POST['address']
    || !$_POST['mob'] || $number > 100 || $number == 0 || empty($referer) || $_SESSION['token'] != $token
) {
    $view->display('error.twig', $ret);
    exit;
}
unset($_SESSION['token']);
//把大象塞进冰箱
$email = trim(I("post.email"));
if (empty($email)) {
    $email = time() . '-test@qq.com';
}
$time = date('Y-m-d H:i:s', time());
$remark = trim(I("post.guest"));
$name = trim(I("post.name"));
$lastName = trim(I("post.last_name"));
$tel = trim(I("post.mob"));
$province_id = trim(I("post.province"));
$city = trim(I("post.city", ""));
$address = trim(I("post.address"));
$postal = trim(I("post.postal"));
$combo_id = trim(I("post.combo_id"));
$payment_type = trim(I("post.payment_type"));
$postAttr = I("post.attr");
$vercode = I("post.vercode");
//省市信息
$regions = new \lib\region($register);
$region = $regions->getProvince($province_id);
$province = $district = '';
//==7代表就是中国
if ($region['id_country'] == 7) {
    $country = '中国';
    $countryCode = 'CN';
    $province = $region['lang'];
    $provinceCode = $region['code'];
} elseif ($region['id_country'] == 240) //越南
{
    $country = $region['lang'];
    $countryCode = $region['code'];
    $province = $city;
    $city = $_POST['district'];

    $YnRegion = $regions->getOneYnRegion($province);
    $postal = $YnRegion['post_code'];
} elseif ($region['id_country'] == 131)//马来西亚
{
    $country = $region['lang'];
    $countryCode = $region['code'];
    $province = I('post.city');
} elseif ($region['id_country'] == 199 || $region['id_country'] == 236) { //泰国or印度尼西亚
    $country = $region['lang'];
    $countryCode = $region['code'];
    $province = $city;
    $city = $_POST['district'];
} else {
    $country = $region['lang'];
    $countryCode = $region['code'];
}

//fix  迪拜的坑 .大于18的地区 -7取地区
if ($ret['id_zone'] > 18) {
    $ret['id_zone'] -= 7;
}
//计算价钱
$param['num'] = $number;
$param['price'] = $ret['price'];
$param['combo'] = $ret['combo'];
$param['combo_id'] = $combo_id;
$product_attr_price = new \lib\product_attr_price($register, $param);
$price = $product_attr_price->getPrice();
$attrs = [];
$attrs_title = [];
//如果有套餐，则循环出产品
if ($combo_id) {
    $attr = [];
    if ($postAttr) {
        $attr_value = array_unique(array_values($postAttr));
        $comboAttr = $product_attr_price->getAttrInfo($attr_value);
        foreach ($postAttr as $key => $at) {
            list($combo_goods_ids, $attr_group_ids) = explode('-', $key);
            if ($combo_goods_ids == 'undefined' || $combo_goods_ids == 'undefined' || !$comboAttr[$at]['number']) {
                //  die("不存在選擇的商品屬性");
            }
            $attr[$combo_goods_ids]['number'][] = $comboAttr[$at]['number'];
            $attr[$combo_goods_ids]['title'][] = $comboAttr[$at]['name'];
        }
    }

    $combo = $product->getComboOfId($combo_id);
    $combo_goods = $product->getComboGoods($combo_id);
    if (!$combo_goods) {
        die('套餐商品不存在');
    }
    foreach ($combo_goods as $key => $goods) {
        $order_products[$key]['id_product'] = $goods['erp_id'];
        $order_products[$key]['product_id'] = $goods['product_id'];
        $order_products[$key]['product_title'] = $goods['title'];
        $order_products[$key]['sale_title'] = empty($goods['sale_title']) ? $goods['title'] : $goods['sale_title'];
        $order_products[$key]['price'] = '0.00';
        $order_products[$key]['price_title'] = $ret['currency_code'] . '0.00';
        $order_products[$key]['qty'] = $goods['num'] * $number;
        $order_products[$key]['attrs'] = $attr[$goods['combo_goods_id']]['number'];
        $order_products[$key]['attrs_title'] = $attr[$goods['combo_goods_id']]['title'];
        //jimmy 默认第一个产品为全部套餐价格
        if ($key == 0) {
            $order_products[$key]['price'] = $price['total'];
            $order_products[$key]['price_title'] = $ret['currency_code'] . $price['total'];
        }
    }


    //jimmy 开始判断套餐是否有相同产品以及相同属性
    if ($order_products) {
        $check = [];
        $products = [];
        foreach ($order_products as $key => $p) {
            $id_product = $p['id_product'];
            //判断是否相同产品
            if ($check[$id_product]) {
                $is_has = false;
                //判断是否有相同属性
                foreach ($check[$id_product]['attrs'] as $k => $row) {
                    if ($row && !array_diff($p['attrs'], $row)) {
                        $products[$k]['qty'] += $p['qty'];
                        $is_has = true;
                        break;
                    }
                }
                //如果有相同属性则直接跳出，
                if ($is_has) {
                    continue;
                }
            }
            //否则赋值
            $check[$id_product]['attrs'][$key] = $p['attrs'];
            $check[$id_product]['attrs_title'][$key] = $p['attrs_title'];
            $products[$key] = $p;
        }
    }
    if ($products) {
        //赋值
        $order_products = $products;
    }
} else {
    if ($postAttr) {
        $attr_value = array_unique(array_values($postAttr));
        $comboAttr = $product_attr_price->getAttrInfo($attr_value);
        $attrs = array_column($comboAttr, 'number');
        if (!$attrs) {
            //   die("不存在選擇的商品屬性");
        }
        $attrs_title = array_column($comboAttr, 'name');
    }
    $order_products[] = [
        'id_product' => $ret['erp_number'],
        'product_id' => $ret['product_id'],
        'product_title' => $ret['erp_title'],
        'sale_title' => $ret['sales_title'] ?: $ret['erp_title'],
        'price' => $price['total'],
        'price_title' => $ret['currency_code'] . $price['total'],
        'qty' => $number,
        'attrs' => $attrs,
        'attrs_title' => $attrs_title
    ];
}
//组装erp数据
$payment_name = $ret['lang']['credit_card'];
if (!$payment_type) {
    $payment_name = $ret['lang']['cash_on_delivery'];
}
$user_agent = trim($_SERVER['HTTP_USER_AGENT']);
$processing = $payment_type ? "Pending" : "processing";
$http_referer = $_COOKIE['referer'];//来源
//获取下单页面停留时间
$start_stay_time = $_COOKIE['orderSubmitTimer'];
$second = 0;
if ($start_stay_time) {
    $second = time() - $start_stay_time;
    $indexTimer = time() - $_COOKIE['indexTimer'];
}
//获取客户下单设备信息
if ($_COOKIE['deviceInfo']) {
    $deviceInfo = $_COOKIE['deviceInfo'];
    $deviceInfo = unserialize($deviceInfo);
    $deviceInfo['orderSubmitTimer'] = $second;
    $deviceInfo['indexTimer'] = $indexTimer;
    $deviceInfo['disableJs'] = 0;
} else {
    $deviceInfo['disableJs'] = 1;
    $deviceInfo['orderSubmitTimer'] = $second;
    $deviceInfo['indexTimer'] = $indexTimer;
}
//判断是手机还是pc
$device = 'mobile';
if (!_is_mobile()) {
    $device = 'pc';
}
$deviceInfo['device'] = $device;
$deviceInfos = serialize($deviceInfo);
$merchOrderNo = $orders->getOrderNo($ret['id_department']);
$order_data = array(
    'key' => md5($ret['domain'] . $time),
    'web_url' => $ret['domain'],
    'first_name' => $name,
    'last_name' => isset($lastName) ? $lastName : null,
    'tel' => $tel,
    'email' => $email,
    'address' => $address,
    'remark' => $remark,
    'zipcode' => $postal ?: null,//邮编
    'country' => $country,
    'province' => $province,
    'city' => $city,
    'area' => $district,
    'products' => $order_products,
    //erp
    'id_zone' => $ret['id_zone'],
    'id_department' => $ret['id_department'],
    'id_users' => $ret['ad_member_id'],
    'identify' => $ret['ad_member_id'],
    'grand_total' => $price['total'],
    'currency_code' => $ret['currency'],

    'date_purchase' => $time,
    'payment_method' => $payment_type,//TF线上支付 代码， 货到付款 为了兼容之前ERP，留空
    'payment_status' => $processing,//Pending:未支付， processing：已经支付   canceled：取消
    'payment_details' => '',
    'created_at' => $time, //int
    'ip' => $ip,
    'user_agent' => $user_agent,
    'http_referer' => $http_referer, //jimmy 下单来源
    'number' => $number,
    'expends' => array(),
    'web_info' => $deviceInfos,
    'order_id'=>$merchOrderNo, //订单号
    'vercode'=>$vercode
);
$info['merchOrderNo'] = $merchOrderNo;
$order_no = getOrderNo();
$info['orderNo'] = $order_no;
$info['ip'] = $ip;
$info['aid'] = $ret['aid'];
$info['product_id'] = $ret['product_id'];
$info['title'] = $ret['title'];
$info['email'] = $email;
$info['tel'] = $tel;
$info['currency'] = $ret['currency'];
$info['domain'] = $ret['domain'];
$info['price'] = $ret['price'];
$info['amount'] = $price['total'];
$info['number'] = $number;
$info['sku'] = $ret['erp_number'];
$info['country'] = $country;
$info['province'] = $province;
$info['countryCode'] = $countryCode;
$info['provinceCode'] = $provinceCode;
$info['city'] = $city;
$info['district'] = $district;
$info['address'] = $address;
$info['postal'] = $postal;
$info['first_name'] = $name;
$info['goods_list'] = $order_products;
$info['last_name'] = $lastName;
$info['payment_name'] = $payment_name;
$info['post_erp_data'] = json_encode($order_data, JSON_UNESCAPED_UNICODE);
$info['add_time'] = date('Y-m-d H:i:s', time());
$info['combo_id'] = $combo_id;
$addressStr = $country . ' ' . $province . ' ' . $city . ' ' . $district . ' ' . $address;
if ($region['id_country'] == 7) {
    $addressStr = $province . ' ' . $city . ' ' . $district . ' ' . $address;
}
$info['addressStr'] = $addressStr;

if (environment == 'office') {
    $redis_key = 'un_order_office';
} else {
    $redis_key = 'un_order';
}
//插入本地表
$order_id = $orders->addOrder($info);
//把数据直接放进redis
*/


$order_id = I('get.orderId');

if(empty($order_id)){
    $view->show_404();
    exit;
}
$smsdata = new lib\SmsData();
$info = $smsdata->fetchOrderInfo($order_id);
#if($info){
#    $info = json_decode($info['post_erp_data'],true);
#}
$orders = new lib\order($register);
$payment_type = isset($payment_type)?$payment_type:0;
//判断是否在线支付
if ($payment_type == 1) {
    //获取易极付帐号信息
    $payments = new \lib\payment($register);
    $payment = $payments->get('yjf');
    //跳转到易极付支付
    $esp = new \lib\esp();
    $esp->pay($info, $payment);
    exit;
} //papal支付
elseif ($payment_type == 2) {
    $esp = new \lib\paypal();
    $esp->pay($info);
    exit;
} elseif ($payment_type == 3) {
    //asiabill
    $pay = new \lib\asiaBill();
    $pay->pay($info);
    exit;
}
elseif($payment_type==4)
{
    //ocean
    $payInfo = $register->get("db")->get('domain_payment','*',['domain[~]'=>'%'.$server_name,'code'=>'ocean']);
    $pay = new \lib\ocean();
    $pay->setAccount($payInfo);
    $info['card_data'] = $_POST['card_data'];
    $res = $pay->pay($register,$info);
    $orders->pay_result($res);
}
else {
    !empty($info['number']) && $orders->updateProductSales($info['product_id'], $info['number']);
    $verify = isset($_GET['verify'])?$_GET['verify'] : '';
    if($verify){
        header('Location:api_orders.php?no=' . $info['order_no'] . '&key=' . $order_id .'&verify='.$verify);
    }else{
        header('Location:api_orders.php?no=' . $info['order_no'] . '&key=' . $order_id);
    }
}
