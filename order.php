<?php

require_once 'lib/ini.php';

//写日志
$ip = getIp();
$log = new \lib\log();
$log->write('order', "用户({$ip})提交数据==》" . json_encode($_POST, 1));
if (I("post.product_id")) {
    $product_id = I('post.product_id', 0, 'intval');
    $ret = $product->getProduct($product_id);
} else {
    $ret = $product->getProduct();
}

//邮件预警redis key 和数据
$redisCache = \lib\register::getInstance("cache");
$email_key              = 'order_warning_email';
$wmData['msg']          = '';
$wmData['domain']       = implode('/',[$ret['domain'],$ret['identity_tag']]);
$wmData['error_data']   = $_POST;


$theme = $ret['theme'];

//判断数据
//验证token
//控制下单频率   1小时超过10单认为是恶意下单
$token = I("post.token");
$orders = new lib\order($register);

//有时会取到两个地址。，第一个是客户ip，第二个是代理ip
if (strpos($ip, ',') !== false) {
    list($ip, $ip_remote) = explode(',', $ip);
}
$IpCount = $orders->getIpOrderCount($ip, $ret['product_id']);
//$IpCount =0;
//jimmy 如果num为空则默认为1
$number = intval(I("post.num"))?:1;

$referer = $_SERVER['HTTP_REFERER'];
if ($IpCount >=20 && !in_array($ip,$config['company_ips'])) {
    if ($ret['lang']['submit_order_too_fast']) {
        die($ret['lang']['submit_order_too_fast']);
    } else {
        die("Frequent orders, please try again after one hour");
    }
}

//判断请求数据是否正确
$orderSubmit = new \lib\orderSubmit($ret['lang']);
$postData = I("post.");
$postData['referer'] =$referer;
$check = $orderSubmit->postCheck($postData, $ret);
if (!$check) {
    //输出错误
     $orderSubmit->getError();
     exit;
}

unset($_SESSION['token']);
unset($_COOKIE['formToken']);
//把大象塞进冰箱
$email          = trim(I("post.email"));
if (empty($email)) {
    $email      = time() . '-test@qq.com';
}
$time           = date('Y-m-d H:i:s', time());

$remark         = trim(I("post.guest"));
$remark         = strip_tags($remark);
$remark         = htmlspecialchars_decode($remark);
$remark         = preg_replace_callback(
                        '/./u',
                        function (array $match) {
                            return strlen($match[0]) >= 4 ? '':$match[0];
                        }, $remark);

$name           = trim(I("post.name"));
$lastName       = trim(I("post.last_name"));
$tel            = trim(I("post.mob"));
$province_id    = trim(I("post.province"));
$city           = trim(I("post.city", ""));

$address        = trim(I("post.address"));
$address        = strip_tags($address);
$address        = htmlspecialchars_decode($address);
$address        = preg_replace_callback(
                        '/./u',
                        function (array $match) {
                            return strlen($match[0]) >= 4 ? '':$match[0];
                        }, $address);

$address2        = trim(I("post.address2"));
if($address2)
{
    $address2        = strip_tags($address2);
    $address2        = htmlspecialchars_decode($address2);
    $address2        = preg_replace_callback(
        '/./u',
        function (array $match) {
            return strlen($match[0]) >= 4 ? '':$match[0];
        }, $address2);
    $address .= ','.$address2;
}


$postal         = trim(I("post.postal"));
$combo_id       = trim(I("post.combo_id"));
$payment_type   = trim(I("post.payment_type"));
$postAttr       = I("post.attr");
$vercode        = I("post.vercode");
$mob_backup     = I("post.mob_backup");
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
    $district = I("post.district");
} elseif ($region['id_country'] == 240) //越南
{
    $country = $region['lang'];
    $countryCode = $region['code'];
    $province = $city;
    $city = $_POST['district'];

    $YnRegion = $regions->getOneYnRegion($province);
    $postal = $YnRegion['post_code'];
} elseif ($region['id_country'] == 102)//柬埔寨
{
    $country = $region['lang'];
    $countryCode = $region['code'];
    $province = I('post.city');
} elseif ($region['id_country'] == 199  || $region['id_country'] == 14 ||  $region['id_country'] == 106 || $region['id_country'] == 235 || $region['id_country'] == 31 ||$region['id_country'] == 148 ) { //泰国//阿曼/巴基斯坦
    $country = $region['lang'];
    $countryCode = $region['code'];
    $province = $city;
    $city = $_POST['district'];
}
elseif($region['id_country'] == 236 || $region['id_country'] == 180 || $region['id_country'] == 70 || $region['id_country'] == 12  ||$region['id_country'] == 207 || $region['id_country'] == 113 || $region['id_country'] == 131){//印度您西亚 //st//菲律宾//阿联酋联合国//马来西亚//土耳其//肯尼亚
    $country = $region['lang'];
    $countryCode = $region['code'];
    $province = I("post.state");
    $district = I("post.district");
    if(!$province || !$city || !$district)
    {
        $ret['lang']['msg'] = $ret['lang']['error_103'];
        \lib\register::getInstance('view')->showPublicErrorTemp($ret);
    }

} elseif($region['id_country'] == 1 && $region['code'] == "MMR"){
    $country = $region['lang'];
    $countryCode = $region['code'];
    $province = $city;
    $city = $_POST['district'];

}elseif($region['id_country'] ==61){//俄罗斯
    $country = $region['lang'];
    $countryCode = $region['code'];
    $province = I("post.country");
    $city = I("post.state");
    $district = $_POST['city'];

}else {
    $country = $region['lang'];
    $countryCode = $region['code'];
}


//jimmy 这里直接取zone表的erp_id
$zone = $region['erp_id_zone'];

//计算价钱
$param['num']       = $number;
$param['price']     = $ret['price'];
$param['combo']     = $ret['combo'];
$param['combo_id']  = $combo_id;

$product_attr_price = new \lib\product_attr_price($register, $param);
$price              = $product_attr_price->getPrice();
$attrs              = [];
$attrs_title        = [];
$payment_total = $price['total']; //套餐总价

$haserp = true;
$haserplist = array (
  0 => '165528',
  1 => '173909',
  2 => '175146',
  3 => '174270',
  4 => '174272',
  5 => '175354',
  6 => '175622',
  7 => '175538',
  8 => '175729',
  9 => '175708',
  10 => '175730',
  11 => '175835',
  12 => '175813',
  13 => '148097',
  14 => '175706',
  15 => '167540',
  16 => '164237',
  17 => '176273',
  18 => '176217',
  19 => '176254',
  20 => '176348',
  21 => '176265',
  22 => '175356',
  23 => '176407',
  24 => '175628',
  25 => '176544',
  26 => '176652',
  27 => '176664',
  28 => '176545',
  29 => '174565',
  30 => '176712',
  31 => '176711',
  32 => '176630',
  33 => '176636',
  34 => '176731',
  35 => '176758',
  36 => '177017',
  37 => '177018',
  38 => '177008',
  39 => '177164',
  40 => '177121',
  41 => '177200',
  42 => '177233',
  43 => '176755',
  44 => '177379',
  45 => '177378',
  46 => '177482',
  47 => '177596',
  48 => '177620',
  49 => '177619',
  50 => '177618',
  51 => '177617',
  52 => '177699',
  53 => '177687',
  54 => '177691',
  55 => '177812',
  56 => '177813',
  57 => '177817',
  58 => '177939',
  59 => '177816',
  60 => '178024',
  61 => '178282',
  62 => '178197',
  63 => '177796',
  64 => '178221',
  65 => '178196',
  66 => '178187',
  67 => '178384',
  68 => '178468',
  69 => '178465',
  70 => '178427',
  71 => '178348',
  72 => '178637',
  73 => '178524',
  74 => '178701',
  75 => '178723',
  76 => '179064',
  77 => '178092',
  78 => '179041',
  79 => '177784',
  80 => '178009',
  81 => '178091',
  82 => '179444',
  83 => '179535',
  84 => '179493',
  85 => '179536',
  86 => '179615',
  87 => '180003',
  88 => '180088',
  89 => '180133',
  90 => '180095',
  91 => '178690',
  92 => '180215',
  93 => '180199',
  94 => '180209',
  95 => '180441',
  96 => '180439',
  97 => '999999',
);

//如果有套餐，则循环出产品
if ($combo_id) {
    //找到该套餐和套餐产品以及属性
    $combo = $product->getComboOfId($combo_id, $ret['product_id']);
    if (!$combo) {
        $log->write('order', "提交错误:提交了该产品没有的套餐");
        $ret['lang']['msg'] = $ret['lang']['error_110'];
        \lib\register::getInstance('view')->showPublicErrorTemp($ret);
        exit;
    }
    $combo_goods = $product->getComboGoods($combo_id);
    if (!$combo_goods) {
        $log->write('order', "提交错误:没有找到该套餐产品");
        $ret['lang']['msg'] = $ret['lang']['error_111'];
        \lib\register::getInstance('view')->showPublicErrorTemp($ret);
        exit;
    }

    //分析输入产品属性 并判断产品属性是否正确
    $attr = [];
    if ($postAttr && (count(array_values($postAttr)) == count(array_keys($postAttr)))) {
        $attr_value = array_unique(array_values($postAttr));
        $comboAttr  = $product_attr_price->getAttrInfo($attr_value);
        foreach ($postAttr as $key => $at) {
            //先判断数据库中请求出来的数据是否正确
            $title  = $comboAttr[$at]['name'];
            $combo_number = $comboAttr[$at]['number'];
            if (empty($title)) {
                $wmData['msg'] = '数据库查询产品属性为空';
                $redisCache->rPush($email_key, json_encode($wmData, JSON_UNESCAPED_UNICODE));
                $log->write('order', "提交错误:数据库查询产品属性为空");
                $ret['lang']['msg'] = $ret['lang']['error_113'];
                \lib\register::getInstance('view')->showPublicErrorTemp($ret);
                exit;
            }
            list($combo_goods_ids, $attr_group_ids) = explode('-', $key);
            $attr[$combo_goods_ids]['number'][] = $combo_number;
            $attr[$combo_goods_ids]['title'][]  = $title;
        }
    } else {
        $combo_goods_attr = $product->getProductsAttrNumbers(array_unique(array_column($combo_goods, 'product_id')));
        if ($combo_goods_attr) {
            $wmData['msg'] = '该产品有属性，但是没传属性';
            $redisCache->rPush($email_key, json_encode($wmData, JSON_UNESCAPED_UNICODE));
            $log->write('order', "提交错误:该产品有属性，但是没传属性");
            $ret['lang']['msg'] = $ret['lang']['error_112'];
            \lib\register::getInstance('view')->showPublicErrorTemp($ret);
            exit;
        }
    }
    $CHECK = [];
    $empty_promotion_price =1; //标致用来做是否为老的套餐 促销价为NULL
    $i=0;
    foreach ($combo_goods as $key => $goods) {
        //jimmy修改 合并相同属性产品，price去总值，促销价就是单价
        $combo_attr = $attr[$goods['combo_goods_id']]['number'];
        $combo_attr_title = $attr[$goods['combo_goods_id']]['title'];
        $qty = $goods['num'] * $number;
        $id_product = $goods['product_id'];
        $promotion_price = empty($goods['promotion_price'])?0: money_int($goods['promotion_price'],'float');//促销价格
        $comboPrice = $promotion_price * $qty; //总价
        if($comboPrice > 0)
        {
            $empty_promotion_price = 0;
        }

        if ($CHECK[$id_product]) {
            foreach ($CHECK[$id_product] as $a) {
                if ($combo_attr) {
                    if ($a['attrs'] && !array_diff($a['attrs'], $combo_attr)) {
                        $order_products[$a['keys']]['qty'] +=  $qty;
                        $order_products[$a['keys']]['price'] += $comboPrice;
                        $order_products[$a['keys']]['price_title'] =  $ret['currency_code'] .$order_products[$a['keys']]['price'];
                        $order_products[$a['keys']]['promotion_price'] = round($order_products[$a['keys']]['price']/$order_products[$a['keys']]['qty'],2);
                        continue 2;
                    }
                } else {
                    $order_products[$a['keys']]['qty'] +=  $qty;
                    $order_products[$a['keys']]['price'] += $comboPrice;
                    $order_products[$a['keys']]['price_title'] =  $ret['currency_code'] .$order_products[$a['keys']]['price'];
                    $order_products[$a['keys']]['promotion_price'] = round($order_products[$a['keys']]['price']/$order_products[$a['keys']]['qty'],2);
                    continue 2;
                }
            }
        }

        $order_products[$i]['id_product'] = $goods['erp_id'];
        $order_products[$i]['product_id'] = $goods['product_id'];
        $order_products[$i]['product_title'] = $goods['title'];

        if(in_array($goods['erp_id'], $haserplist))$haserp=false;

        //标题优先级  面单名称>>外文名称(截取30个字符)>>产品名称
        //$o_sales_title = substr($goods['p_sales_title'], 0, 45);
        $o_sales_title = $goods['sale_title'];
        $o_sales_title = empty($o_sales_title) ? $goods['p_sales_title']:$o_sales_title;
        $oTitle = empty($goods['waybill_title']) ? $o_sales_title : $goods['waybill_title'];
        $oTitle = empty($oTitle) ? $goods['title'] : $oTitle;
        $order_products[$i]['sale_title'] = $oTitle;

        $order_products[$i]['promotion_price'] = $promotion_price;
        $order_products[$i]['price'] = $comboPrice;
        $order_products[$i]['price_title'] = $ret['currency_code'] . $comboPrice;
        $order_products[$i]['qty'] = $qty;
        $order_products[$i]['attrs'] = $combo_attr ?:[];
        $order_products[$i]['attrs_title'] = $combo_attr_title?:[];
        $order_products[$i]['spu'] = '';
        $order_products[$i]['sku'] = '';
        $order_products[$i]['id_activity'] = '';
        $order_products[$i]['product_title_foregin']='';

        $CHECKS['attrs'] = $combo_attr;
        $CHECKS['keys'] = $i;
        $CHECKS['price'] = $comboPrice;
        $CHECK[$id_product][] = $CHECKS;
        $i++;
    }

    //jimmy 为了兼容老的没有促销价的套餐，如果price都为0 则默认第一个产品为套餐全部价格
    if($empty_promotion_price){
        $order_products[0]['price'] = $payment_total;
        $order_products[0]['price_title'] = $ret['currency_code'].$payment_total;
        $order_products[0]['promotion_price'] =  round($payment_total/$order_products[0]['qty'],2);
    }
} else {
    if ($postAttr) {
        $attr_value = array_unique(array_values($postAttr));
        $comboAttr = $product_attr_price->getAttrInfo($attr_value,$ret['product_id']);
        $attrs = array_column($comboAttr, 'number');

        if (!$attrs) {
            $wmData['msg'] = '提交了该产品没有的属性';
            $redisCache->rPush($email_key, json_encode($wmData, JSON_UNESCAPED_UNICODE));//redis未使用
            $log->write('order', "提交错误:提交了该产品没有的属性");
            $ret['lang']['msg'] = $ret['lang']['error_109'];
            \lib\register::getInstance('view')->showPublicErrorTemp($ret);
            exit;
        }

        #判断前端提交的属性，数据库是否都存在，如果否，则返回错误！[v4.7]
        $attrExist = true;
        foreach ($attr_value as $val) {
            if (array_key_exists($val,$comboAttr) == false) {
                $attrExist = false;
                break;
            }
        }
        if (!$attrExist) {
            $log->write('order', "提交错误:该产品提交的属性有部分不存在");
            $ret['lang']['msg'] = $ret['lang']['error_115'];
            \lib\register::getInstance('view')->showPublicErrorTemp($ret);
            exit();
        }

        $attrs_title = array_column($comboAttr, 'name');
    }
    else{
        $combo_goods_attr = $product->getProductsAttrNumbers($ret['product_id']);
        if ($combo_goods_attr) {
            $wmData['msg'] = '该产品有属性，但是没传属性';
            $redisCache->rPush($email_key, json_encode($wmData, JSON_UNESCAPED_UNICODE));
            $log->write('order', "提交错误:该产品有属性，但是没传属性");
            $ret['lang']['msg'] = $ret['lang']['error_112'];
            \lib\register::getInstance('view')->showPublicErrorTemp($ret);
            exit;
        }
    }
    //标题优先级  面单名称>>外文名称(截取30个字符)>>产品名称
    //$t_sales_title = substr($ret['sales_title'], 0, 45);
    $t_sales_title =   $ret['sales_title'];
    $tTitle = empty($ret['waybill_title']) ? $t_sales_title : $ret['waybill_title'];
    $tTitle = empty($tTitle) ? $ret['erp_title'] : $tTitle;

    $order_products[] = [
        'id_product' => $ret['erp_number'],
        'product_id' => $ret['product_id'],
        'product_title' => $ret['erp_title'],
        'sale_title' => $tTitle,
        'price' => $payment_total,
        'promotion_price' => round($payment_total/$number,2),//jimmy 如果不是套餐单价则为 总价/数量
        #'promotion_price' => empty($price['promotion_price'])?$price['price']:$price['promotion_price'],
        'price_title' => $ret['currency_code'] . $price['total'],
        'qty' => $number,
        'attrs' => $attrs,
        'attrs_title' => $attrs_title,
        'spu' => '',
        'sku' => '',
        'id_activity' =>'',
        'product_title_foregin'=>''
    ];

    if(in_array($ret['erp_number'], $haserplist))$haserp=false;
}
//组装erp数据
$payment_name = $ret['lang']['credit_card'];
if (!$payment_type) {
    $payment_name = $ret['lang']['cash_on_delivery'];
}else{
	if($payment_type == 6){
			//$payment_name = $ret['lang']['cash_on_delivery']; //20170918 yangweiquan blue pay			
			$payment_name = 'bluePay';
	}	
		
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

if ($region['id_country'] ==61){    // 俄罗斯特殊处理
    $passnr = $_POST["passnr"];             //护照号
    $taxcode = $_POST["self_tax_code"];     //个人税号

    if(!$passnr){
        $ret['lang']['msg'] = $ret['lang']['passport_no'];
        \lib\register::getInstance('view')->showPublicErrorTemp($ret);
        exit(0);
    }
    if(!$taxcode){
        $ret['lang']['msg'] = $ret['lang']['individual_tax_number'];
        \lib\register::getInstance('view')->showPublicErrorTemp($ret);
        exit(0);
    }
    $deviceInfo['passnr'] = $passnr;
    $deviceInfo['taxcode'] = $taxcode;
}

if($region['id_country'] ==235){//印度需要护照号和身份证
    $passport = $_POST["passport"];             //护照号
    $id_card= $_POST["id_card"];     //身份證

    $deviceInfo['passport'] = $passport;
    $deviceInfo['id_card'] = $id_card;

}

if($region['id_country'] ==180){//沙特阿拉伯身份证
    $id_card = $_POST["id_card"];     //身份證
    $deviceInfo['id_card'] = $id_card;
}

//判断是手机还是pc
$device = 'mobile';
if (!_is_mobile()) {
    $device = 'pc';
}

$code_zone = $region['code'];

$deviceInfo['device'] = $device;
$deviceInfo['mob_backup'] = $mob_backup;
$deviceInfo['website'] = implode('/',[$ret['domain'],$ret['identity_tag']]);
$deviceInfos = serialize($deviceInfo);
$merchOrderNo = $orders->getOrderNo($ret['id_department'],$ip);
$order_no = getOrderNo();
$order_data = array(
    'key' => md5($ret['domain'] . $time .$merchOrderNo),
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
    'products' => $order_products, //erp
    'id_zone' => $zone,
    'code_zone'=> $code_zone,
    'id_department' => $ret['id_department'],
    'id_users' => $ret['ad_member_id'],
    'identify' => $ret['ad_member_id'],
    'grand_total' => $payment_total,
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
    'pay_channel' => "",
    'pay_transaction' => "",
    'id_card' => "",
    'web_info' => $deviceInfos,
    'order_id' => $merchOrderNo, //订单号
    'vercode' => $vercode,
    'website' => implode('/',[$ret['domain'],$ret['identity_tag']]),
    'combo_id'=> $combo_id,
    'combo_name'=> isset($combo)?$combo["title"]:"",
    'merchant_enum' => 1,
    'oa_id_department'=>$ret['oa_id_department']
);
//jade add  新erp产品 erp 优先使用 username 字段
//if(!empty($ret['new_erp'])){
    #$order_data['username'] = $product->getUsernameByCn($ret['ad_member']);
$order_data['username'] = $product->getUsernameByCn($ret['ad_member'],$ret['ad_member_id']);

//}
$info = [];
$info['merchOrderNo'] = $merchOrderNo;
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
$info['amount'] = $payment_total;
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
$info['remark'] = $remark;

$addressStr = $country . ' ' . $province . ' ' . $city . ' ' . $district . ' ' . $address;
if ($region['id_country'] == 7) {
    $addressStr = $province . ' ' . $city . ' ' . $district . ' ' . $address;
}
$info['addressStr'] = $addressStr;


if($haserp)
{
    $log->write('order', "传送给ERP数据." . print_r($order_data, 1));
    if (environment == 'office') {
        $timestamp = time();
        $rets['status'] =1;
        $rets['return'] = '{"status":true,"message":"","order_id":' . $timestamp . '}';
    } else {
        $url = "http://erp.lianqiao.tech/index.php?g=Order&m=Api&a=create_order";
        $rets = post($url, $order_data);
        $log->write('order', "erp返回结果=》." . print_r($rets, 1));
    }

    if (!$rets['status']) {
        //记录出错原因
        $info['post_erp_msg'] = "请求错误" . print_r($rets, true);
        $info['erp_status'] = "FAIL_CREATE";
        $orders->addOrder($info);
    }
    else
    {

        $info['post_erp_msg'] = print_r($rets, true);
        $info['erp_status'] = "SUCCESS";
        $orders->addOrder($info);
    }
}
else
{
    $orders->addOrder($info);
}



// 删除用户手机号查询订单数据
delQueryOrders('mobile_query_'.$ret['domain'].$ret['identity_tag'].$info['tel']);

//过滤特殊字符
$filterKeys = ['first_name', 'last_name', 'tel', 'email', 'address', 'addressStr', 'remark', 'zipcode', 'postal'];
$info['post_erp_data'] = json_decode($info['post_erp_data'], true);
$info = filterData($info, $filterKeys);
$info['post_erp_data'] = json_encode($info['post_erp_data'], JSON_UNESCAPED_UNICODE);

$cache = \lib\register::getInstance("cache");
if($cache){
    #印度尼西亚订单确认短信
    if($ret['id_zone'] == 22){
        $matchs = [];
        $s = preg_match($config['sms_regex'][29],$info['tel'],$matchs);
        if($matchs){
            $mobile = $config['sms_order_msg'][$ret['id_zone']]['prefix'].substr($info['tel'],1,strlen($info['tel'])-1);
            $cache = \lib\register::getInstance('cache');
            if($cache && $info['tel']){
                $smsMsg = str_replace('{{name}}',$info['title'],$config['sms_order_msg'][$ret['id_zone']]['message']);
                $smsMsg = str_replace('{{total}}',$info['amount'],$smsMsg);
                $smsMsg = str_replace('{{orderno}}',$info['merchOrderNo'],$smsMsg);
                $cache->rPush($config['sms_order_key'],json_encode([
                    'mobile' => $mobile,
                    'sender'=> $config['sms_order_msg'][$ret['id_zone']]['sender'],
                    'content'=>$smsMsg
                ]));
            }else{
                $log->write('smsorder', json_encode([
                    'ret_code'=>505,
                    'ret_msg'=>'redis缓存错误',
                    'orderId'=>$info['merchOrderNo'],
                    'mobile'=>$mobile
                ]));
            }
        }else{
            $log->write('smsorder', json_encode([
                'ret_code'=>506,
                'ret_msg'=>'redis缓存错误',
                'orderId'=>$info['merchOrderNo'],
                'mobile'=>$info['tel']
            ]));
        }
    }
}

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
elseif ($payment_type == 6) {
    //bluepay
    $pay = new \lib\bluePay();
    $pay->pay($info);
    exit;
}
 elseif ($payment_type == 4) {
    //ocean
    $payInfo = $register->get("db")->get('domain_payment', '*', ['domain[~]' => '%' . $server_name, 'code' => 'ocean']);
    $pay = new \lib\ocean();
    $pay->setAccount($payInfo);
    $info['card_data'] = $_POST['card_data'];
    $res = $pay->pay($register, $info);
    $orders->pay_result($res);
} else {
    $orders->updateProductSales($ret['product_id'], $number);
    header('Location:orders.php?no=' . $order_no . '&key=' . $order_id);
}

/**
 * 删除订单查询缓存数据
 * @param $key
 * @return bool|\lib\cache\driver\type
 */
function delQueryOrders($key){
    /**
     * @var $cache lib\cache\driver\Redis
     */
    $cache = \lib\register::getInstance("cache");
    return $cache?$cache->del($key):false;
}