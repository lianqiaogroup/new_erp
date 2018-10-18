<?php
require_once __DIR__ . "/lib/ini.php";
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['ret_code' => 500, 'ret_msg' => '非法操作']);
    exit(0);
}

$do = isset($_GET['do']) ? $_GET['do'] : "";
$mobile =I('get.mobile');
if (I("post.product_id")) {
    $product_id = I('post.product_id', 0, 'intval');
    $ret = $product->getProduct($product_id);
} else {
    $ret = $product->getProduct();
}

$sms = new \lib\SmsSend($ret['product_id'],$ret['lang'],$ret['id_zone'],$ret['theme']);
if ('send' == $do) {
    //开始验证post数据
    $orderSubmit = new \lib\orderSubmit($ret['lang']);
    $postData = I("post.");
    $postData['referer'] = $_SERVER['HTTP_REFERER'];
    $check = $orderSubmit->postCheck($postData);
    if (!$check) {
        $output =  $orderSubmit->getError();
        echo json_encode($output);
        exit;
    }

    if (!$sms->checkformat($ret['product_id'], $mobile)) {
        echo json_encode(['ret_code' => 502, 'ret_msg' => $ret['lang']['sms_verify_msg'][502]]);
        exit;
    }
    if ($sms->getSendCount($mobile) > 4) {
        echo json_encode(['ret_code' => 401, "ret_msg" =>$ret['lang']['sms_verify_msg'][401]]);
        exit(0);
    }
    $orders = new lib\order($register);
    //开始验证下单数量
    $ip = getIp();
    //有时会取到两个地址。，第一个是客户ip，第二个是代理ip
    if(strpos($ip,',')!==false)
    {
        list($ip,$ip_remote) = explode(',',$ip);
    }
    $IpCount = $orders->getIpOrderCount($ip, $ret['product_id']);
    if($IpCount >20)
    {
        echo json_encode(['ret_code' => 501, 'ret_msg' => $ret['lang']['sms_verify_msg'][501]]);
        exit;
    }

    $order_id = I('post.orderId');
    if ($order_id) {      //如果订单已经存在则直接发送验证码
        $result = $sms->Send($from, $mobile);
        if ($result && $result['ret_result'] == true) {
            $smsdata = new lib\SmsData();
            $smsdata->updateSmsCode($order_id, $result['sms_code']);
            echo json_encode(['ret_code' => 200, 'ret_msg' => $ret['lang']['sms_verify_msg'][200], 'ret_data' => ['order_id' => $order_id]]);
        } else {
            echo json_encode(['ret_code' => 400, 'ret_msg' => $ret['lang']['sms_verify_msg'][500]]);
        }
    }else{
        $theme = $ret['theme'];
        $number = I("post.num", 1, 'intval');
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

        switch ($region['id_country']){
            case 7:         //==7代表就是中国
                $country = '中国';
                $countryCode = 'CN';
                $province = $region['lang'];
                $provinceCode = $region['code'];
                break;
            case 240:
                $country = $region['lang'];
                $countryCode = $region['code'];
                $province = $city;
                $city = $_POST['district'];
                $YnRegion = $regions->getOneYnRegion($province);
                $postal = $YnRegion['post_code'];
                break;
            case 131:
                $country = $region['lang'];
                $countryCode = $region['code'];
                $province = I('post.city');
                break;
            case 199:
            case 236:
                $country = $region['lang'];
                $countryCode = $region['code'];
                $province = $city;
                $city = $_POST['district'];
                break;
            default:
                $country = $region['lang'];
                $countryCode = $region['code'];
                break;
        }

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
                $comboAttr = $product_attr_price->getAttrInfo($attr_value,$ret['product_id']);
                foreach ($postAttr as $key => $at) {
                    list($combo_goods_ids, $attr_group_ids) = explode('-', $key);
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
                $comboAttr = $product_attr_price->getAttrInfo($attr_value,$ret['product_id']);
                $attrs = array_column($comboAttr, 'number');

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
        $order_no = getOrderNo();
        $order_data = array(
            'key' => md5($ret['domain'] . $time . $merchOrderNo),
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
            'website' => implode('/',[$ret['domain'],$ret['theme']])
        );

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
        $addressStr = implode(" ",[$country,$province,$city,$district,$address]);
        if ($region['id_country'] == 7) {
            $addressStr = implode(" ",[$province,$city,$district,$address]);
        }
        $info['addressStr'] = $addressStr;


        //插入本地表
        $order_id = $orders->addOrder($info);
        //var_dump($order_id)
        //同步到美国服务器数据
        $cache = lib\register::getInstance("cache");
        if($cache) {
            $key_sync_order = 'un_Sync_Redis';
            if(environment == "idc"){
                $key_sync_order = 'Sync_Redis';
            }
            $cache->rPush($key_sync_order,json_encode($info));          //同步到
        }

        if($order_id){
            $result = $sms->Send($from,$mobile);
            $smsdata = new lib\SmsData();
            if($result && $result['ret_result'] == true){
                $smsdata->insertSmsContent($order_id,$result['sms_code'],'',json_encode($info,JSON_UNESCAPED_UNICODE),time());
                $http_referer = $_SERVER['HTTP_REFERER'];
                echo json_encode([
                    'ret_code'=>200,
                    'ret_msg'=> $ret['lang']['sms_verify_msg'][200],
                    'orderId'=>$order_id,
                    'fb_px'=>$ret['fb_px'],
                    'has_referer'=>($http_referer ? 1:0),
                    'identity_tag'=>$ret["identity_tag"]
                ]);
            }else{
                $smsdata->insertSmsContent($order_id,$result['sms_code'],'',json_encode($info,JSON_UNESCAPED_UNICODE),time());
                echo json_encode([
                    'ret_code'=>400,
                    'ret_msg'=>$ret['lang']['sms_verify_msg'][500],
                    'identity_tag'=>$ret["identity_tag"],
                    'orderId'=>$order_id
                ]);
            }
        }
    }
} else if ("verify" == $do) {
    $verifycode = isset($_GET['vercode'])?trim($_GET['vercode']):"";
    if(!isset($verifycode) || empty($verifycode)){
        echo json_encode(['ret_code'=> 500,'ret_msg'=>$ret['lang']['sms_verify_msg'][501]]);exit(0);
    }
    $cache = lib\register::getInstance("cache");

    $order_id = $_GET['orderId'];

    $smsdata = new lib\SmsData();
    $verifytimes = $smsdata->fetchSmsTimes($order_id);
    $smsdata->UpdateSmsTimes($order_id,1);

    $smsdata->updateErrCode($order_id,$verifycode);

    if($sms->checkVerifyCode($order_id,$verifycode)) {
        if (!$cache) {
            //如果redis NULL 写入数据库
            $order_unpost = new \lib\order_unpost($register);
            $unpost['order_id'] = $order_id;
            $order_unpost->add($unpost);

        } else {
            $info = $smsdata->fetchSmsOrder($order_id);
            //未提交的订单同步写入到REDIS
            $redis_key = $config['redis_order_erp_queue'];
            $erpdata = json_decode($info['erp_data'], true);
            //var_dump($erpdata);
            if ($erpdata['post_erp_data']) {
                $post_erp_data = json_decode($erpdata['post_erp_data'], true);
                $webinfo = unserialize($post_erp_data['web_info']);
                $webinfo['vercode'] = $info['sms_code'];
                $webinfo['incode'] = $verifycode;
                $webinfo['verify_status'] = 1;

                $post_erp_data['web_info'] = serialize($webinfo);
                $erpdata['post_erp_data'] = json_encode($post_erp_data, JSON_UNESCAPED_UNICODE);
            }

            //验证状态，0-失败，1-成功
            $cache->rPush($redis_key, $erpdata['post_erp_data']);           //同步到ERP数据
        }
        unset($_SESSION['token']);
        $smsdata->UpdateStatus($order_id,1);
        echo json_encode(['ret_code'=> 200,'ret_msg'=>$ret['lang']['sms_verify_msg'][201]]);
    }else{
        echo json_encode(['ret_code'=> 400, 'ret_msg'=>$ret['lang']["sms_verify_msg"][400]]);
    }
    exit(0);
} else if ('is_open_sms' == $do) {
    $ret = $product->isSendSms($ret['product_id']);
    echo json_encode($ret);
} else if ('is_same_buy' == $do) {
    if(empty($_POST['product_id']) || empty($_POST['mobile']) || !isset($_POST['combo'])){
        echo json_encode(['ret'=>0,'msg'=>'params lost']);exit();
    }
    $data = [];
    $data['product_id'] = $_POST['product_id'];
    $data['mobile'] = $_POST['mobile'];
    $data['combo'] = $_POST['combo'];
    ## sku上线之后，再根据规格判断
    if(!empty($_POST['product_attr'])){
        $data['product_attr'] = $_POST['product_attr'];
    }

    $ret = $product->isSameBuy($data);
    echo json_encode($ret);
}
