<?php
require_once __DIR__ . "/lib/ini.php";
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['ret_code' => 500, 'ret_msg' => '非法操作']);
    exit(0);
}
if (I("post.product_id")) {
    $product_id = I('post.product_id', 0, 'intval');
    $ret = $product->getProduct($product_id);
} else {
    $ret = $product->getProduct();
}

$from = 'senderID';

$do = isset($_GET['do'])?$_GET['do']:'';
switch ($do){
    case 'order':           //生成订单
        $orderId = isset($_POST['orderId'])?$_POST['orderId']:'';
        if(!$orderId){
            $orderData = createOrder($register,$product,$ret);
            if ($orderData['ret_code'] == 200) {
                $orderId = $orderData['orderId'];
            } else {
                echo json_encode([
                    'ret_code'=>500,
                    'ret_msg'=>$orderData['ret_msg'],
                    'website'=>implode('/',[$ret['domain'],$ret['identity_tag']]),
                    'mobile'=>I('post.mobile')
                ]);
                exit;
            }
        } else {
            echo json_encode([
                'ret_code' => 201,
                'ret_msg' => '订单已经存在!',
                'website' => implode('/',[$ret['domain'],$ret['identity_tag']]),
                'mobile'  =>  I('post.mobile')
            ]);
            exit(0);
        }
        $token = md5('order='.$orderId.'mobile='.I('post.mob').'product_id='.$ret['product_id']);
        if($orderId){
            $order = new \lib\order($register);
            $order_goods =  $order->getOrderGoods($orderId);
            $order_goods_id = array_column($order_goods,'order_goods_id');

            //返回订单产品
            $order_quality = new \lib\order_quality($register);
            $attrs = $order_quality->getOrderGoodsAttr($order_goods_id);
            $ga =[];
            foreach ($order_goods as $g){
                $variant =   $attrs[$g['order_goods_id']];
                $variant_name = "";
                if($variant){
                    $variant_name = array_column($variant,'name');
                    $variant_name = implode(',',$variant_name);
                }
                $row['id'] = $g['product_id'];
                $row['name'] = $g['title'];
                $row['price'] = money_int($g['price'],'float');
                $row['quantity'] = $g['num'];
                $row['variant'] =$variant_name;
                $ga[] = $row;
            }
            setcookie($orderId,$orderId,time()+86400*30);
            $_SESSION['ref']   = 0;
            $_SESSION['time']  = time(); //重新下单发送验证码
            echo json_encode([
                'ret_code'=>200,
                'ret_msg'=>'successed',
                'orderId'=>$orderId,
                'token'=>$token,
                'website'=>implode('/',[$ret['domain'],$ret['identity_tag']]),
                'mobile'=>I('post.mobile'),
                'total'=>$orderData['total'],
                'pay_method'=> $orderData['pay_method'],
                'ga' => $ga,
                'fb_px'=>$ret['fb_px']
            ]);
        }else{
            echo json_encode([
                'ret_code'=>500,
                'ret_msg'=>'failed',
                'token'=>$token,
                'website'=>implode('/',[$ret['domain'],$ret['identity_tag']]),
                'mobile'=>I('post.mobile')
            ]);
        }
        break;
    case 'send':                        //第一次发送验证码
        //判断页面刷新 120秒只能请求一次
        if( $_SESSION['time'] > time() && $ret['theme'] =='style32_3'){
            echo json_encode([
                'ret_code' => 403,
                'time' => $_SESSION['time'] - time(),
            ]);
            exit;
        }
        $orderId = I('post.orderId');
        $mobile = I('post.mobile');
        $token = I('post.token');
        $logger = new \lib\log();
        $t_token = md5('order='.$orderId.'mobile='.$mobile.'product_id='.I('post.product_id'));
        if(strtolower($token) != strtolower($t_token)){
            echo json_encode(['ret_code' => 504, 'ret_msg' => $ret['lang']['sms_verify_msg'][500]]);
            $logger->write('sms',json_encode(['ret_code' => 504, 'ret_msg' => $ret['lang']['sms_verify_msg'][500],'mobile'=>$mobile,'orderId'=>$orderId,'action'=>'send']));
            exit(0);
        }
        #号码过滤或替换【针对沙特等地区】
        $mobile = filter_mobile($mobile,$ret['id_zone']);

        //判断产品所属地区是否有匹配规则，及开通验证码
        if(array_key_exists($ret['id_zone'],$config['sms_regex'])) {
            $matchs = [];
            $index = preg_match($config['sms_regex'][$ret['id_zone']], $mobile, $matchs);
            ##判断手机号是否匹配规则
            if ($index && $matchs) {
              //jimmy修改，号码有0开头去0，无0不用care
                if(preg_match("/^0\d(.*)/",$mobile)){
                    $mobile = substr($mobile,1,strlen($mobile)-1);
                }
            } else {
                echo json_encode(['ret_code' => 502, 'ret_msg' => $ret['lang']['sms_verify_msg'][502]]);
                $logger->write('sms', json_encode(['ret_code' => 502, 'ret_msg' => $ret['lang']['sms_verify_msg'][502], 'mobile' => $mobile, 'order' => $orderId]));
                exit(0);
            }
        }else{
            echo json_encode(['ret_code' => 503, "ret_msg" =>$ret['lang']['sms_verify_msg'][400],'mobile'=>$mobile,'orderId'=>$orderId]);
            $logger->write('sms',json_encode(['ret_code' => 503, "ret_msg" =>'该产品所在地区暂时还没有开通验证码','mobile'=>$mobile,'orderId'=>$orderId,'action'=>'send']));
            exit(0);
        }

        #实例化短信类
        $sms = new \lib\SmsSend($ret['product_id'],$ret['lang'],$ret['id_zone'],$ret['theme']);
        #检测手机号码是否符合规范
        #if (!$sms->checkformat($mobile)) {
        #    echo json_encode(['ret_code' => 502, 'ret_msg' => $ret['lang']['sms_verify_msg'][502]]);
        #    $logger->write('sms',json_encode(['ret_code' => 502, 'ret_msg' => $ret['lang']['sms_verify_msg'][502],'mobile'=>$mobile,'order'=>$orderId]));
        #    exit;
        #}
        #订单
        if ($sms->getSendCount($mobile) > 4) {
            echo json_encode(['ret_code' => 401, "ret_msg" =>$ret['lang']['sms_verify_msg'][401],'mobile'=>$mobile,'orderId'=>$orderId]);
            $logger->write('sms',json_encode(['ret_code' => 401, "ret_msg" =>$ret['lang']['sms_verify_msg'][401],'mobile'=>$mobile,'orderId'=>$orderId,'action'=>'send']));
            exit(0);
        }

        if($orderId){
            $smsmodel = new \lib\SmsData();
            $key = 'order_'.$orderId;
            $info = getQueryOrders($key);
            if ($info){
                $info = json_decode($info,true);
                if (JSON_ERROR_NONE !== json_last_error()){
                    $info = null;
                }
            }
            $info = $info?$info:$smsmodel->fetchOrderInfo(intval($orderId));
            if($info) {
                $result = $sms->Send($from, $mobile);
                if ($result && $result['ret_result'] == true) {
                    $smsmodel->insertSmsContent($orderId, $result['sms_code'], '', json_encode($info, JSON_UNESCAPED_UNICODE), time(),$result['isp']);
                    $http_referer = $_SERVER['HTTP_REFERER'];
                    $_SESSION['time'] = time() +121;
                    echo json_encode([
                        'ret_code' => 200,
                        'ret_msg' => $ret['lang']['sms_verify_msg'][200],
                        'orderId' => $orderId,
                        'fb_px' => $ret['fb_px'],
                        'has_referer' => ($http_referer ? 1 : 0),
                        'identity_tag' => $ret["identity_tag"],
                    ]);
                } else {
                    $smsmodel->insertSmsContent($orderId, $result['sms_code'], '', json_encode($info, JSON_UNESCAPED_UNICODE), time(),$result['isp']);
                    echo json_encode([
                        'ret_code' => 500,
                        'ret_msg' => $ret['lang']['sms_verify_msg'][500],
                        'identity_tag' => $ret["identity_tag"],
                        'orderId' => $orderId
                    ]);
                    $logger->write('sms',json_encode([
                        'ret_code' => 500,
                        'ret_msg' => $ret['lang']['sms_verify_msg'][500],
                        'identity_tag' => $ret["identity_tag"],
                        'orderId' => $orderId,
                        'action'=>'send'
                    ]));
                }
            }else{
                echo json_encode([
                    'ret_code' => 501,
                    'ret_msg'  => $ret['lang']['sms_verify_msg'][500],
                    'identity_tag' => $ret["identity_tag"],
                    'orderId' => $orderId
                ]);
                $logger->write('sms',json_encode([
                    'ret_code' => 501,
                    'ret_msg'  => $ret['lang']['sms_verify_msg'][500],
                    'identity_tag' => $ret["identity_tag"],
                    'orderId' => $orderId,
                    'action'=>'send'
                ]));
            }
        }else{
            echo json_encode([
                'ret_code' => 400,
                'ret_msg'  => $ret['lang']['sms_verify_msg'][500],
                'identity_tag' => $ret["identity_tag"],
                'orderId' => $orderId
            ]);
            $logger->write('sms',json_encode([
                'ret_code' => 400,
                'ret_msg'  => $ret['lang']['sms_verify_msg'][500],
                'identity_tag' => $ret["identity_tag"],
                'orderId' => $orderId,
                'action'=>'send'
            ]));
        }
        break;
    case 'resend':          //重发验证码
        $orderId = I('post.orderId');
        $mobile = I('post.mobile');
        $token = I('post.token');

        $logger = new \lib\log();

        $t_token = md5('order='.$orderId.'mobile='.$mobile.'product_id='.I('post.product_id'));
        if(strtolower($token) != strtolower($t_token)){
            echo json_encode(['ret_code' => 504, 'ret_msg' => $ret['lang']['sms_verify_msg'][500]]);
            $logger->write('sms',json_encode(['ret_code' => 504, 'ret_msg' => $ret['lang']['sms_verify_msg'][500],'orderId'=>$orderId,'mobile'=>$mobile,'action'=>'resend']));
            exit(0);
        }

        #号码过滤或替换
        $mobile = filter_mobile($mobile,$ret['id_zone']);

        #检测手机号码是否符合规范
        //if (!$sms->checkformat($mobile)) {
        //    echo json_encode(['ret_code' => 502, 'ret_msg' => $ret['lang']['sms_verify_msg'][502]]);
        //    exit;
        //}
        ##jimmy重新发送短信也需要检测是否0开头
        if(preg_match("/^0\d(.*)/",$mobile)){
            $mobile = substr($mobile,1,strlen($mobile)-1);
        }
        $sms = new \lib\SmsSend($ret['product_id'],$ret['lang'],$ret['id_zone'],$ret['theme']);
        #订单限制
        if ($sms->getSendCount($mobile) > 4) {
            echo json_encode(['ret_code' => 401, "ret_msg" =>$ret['lang']['sms_verify_msg'][401]]);
            $logger->write('sms',json_encode(['ret_code' => 401, "ret_msg" =>$ret['lang']['sms_verify_msg'][401],'orderId'=>$orderId,'mobile'=>$mobile,'action'=>'resend']));
            exit(0);
        }
        $result = $sms->Send($from, $mobile);
        if ($result && $result['ret_result'] == true) {
            $_SESSION['time'] = time() +121;
            $smsdata = new lib\SmsData();
            $smsdata->updateSmsCode($orderId, $result['sms_code']);
            echo json_encode(['ret_code' => 200, 'ret_msg' => $ret['lang']['sms_verify_msg'][200], 'orderId' => $orderId]);
        } else {
            $logger->write('sms',json_encode(['ret_code' => 400, 'ret_msg' => $ret['lang']['sms_verify_msg'][500],'orderId'=>$orderId,'mobile'=>$mobile,'action'=>'resend']));
            echo json_encode(['ret_code' => 400, 'ret_msg' => $ret['lang']['sms_verify_msg'][500]]);
        }
        break;
    case 'verify':          //号码验证
        $verifycode = isset($_POST['vercode'])?trim($_POST['vercode']):"";
        $token = I('post.token');
        $orderId = I('post.orderId');
        $mobile = I('post.mobile');
        $t_token = md5('order='.$orderId.'mobile='.$mobile.'product_id='.I('post.product_id'));
        if(strtolower($token) != strtolower($t_token)){
            echo json_encode(['ret_code' => 504, 'ret_msg' => $ret['lang']['sms_verify_msg'][500]]);
            exit(0);
        }

        if(!$verifycode){
            echo json_encode(['ret_code'=> 500,'ret_msg'=>$ret['lang']['sms_verify_msg'][501]]);exit(0);
        }
        $cache = lib\register::getInstance("cache");

        $smsdata = new lib\SmsData();
        #$verifytimes = $smsdata->fetchSmsTimes($orderId);
        #$smsdata->UpdateSmsTimes($orderId,1);
        #$smsdata->updateErrCode($orderId,$verifycode);

        #更新用户输入验证码信息和验证次数信息
        $smsdata->update_sms($orderId,$verifycode,1);
        $sms = new \lib\SmsSend($ret['product_id'],$ret['lang'],$ret['id_zone'],$ret['theme']);
        if($sms->checkVerifyCode($orderId,$verifycode)) {
            if (!$cache) {
                //如果redis NULL 写入数据库
                $order_unpost = new \lib\order_unpost($register);
                $unpost['order_id'] = $orderId;
                $order_unpost->add($unpost);

            }

            $smsdata->UpdateStatus($orderId,1);
            echo json_encode(['ret_code'=> 200,'ret_msg'=>$ret['lang']['sms_verify_msg'][201]]);
        }else{
            echo json_encode(['ret_code'=> 400, 'ret_msg'=>$ret['lang']["sms_verify_msg"][400]]);
        }
        break;
    case  "is_open_sms":
        $ret = $product->isSendSms($ret['product_id']);
        echo json_encode($ret);
        break;
    case 'is_same_buy':
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
        break;
}


/**
 * @param $register
 * @param $product
 * @param $ret
 * @return array
 */
function createOrder($register, $product, $ret){
    
    $ip = getIp();
    $log = \lib\register::createInstance('\lib\log');
    $log->write('order', "用户({$ip})提交数据==》" . json_encode($_POST, 1));
    
    //开始验证post数据
    $orderSubmit = new \lib\orderSubmit($ret['lang']);
    $postData = I("post.");
    $postData['referer'] = $_SERVER['HTTP_REFERER'];
    $check = $orderSubmit->postCheck($postData, $ret);
    if (!$check) {
        $output = $orderSubmit->getError();
        $output = json_decode($output, true);
        $responseData = ['ret_code' => 510, 'ret_msg' => $output['ret_msg']];
        $log->write(json_encode($responseData));

        return $responseData;
    }
    
    $orders = new lib\order($register);
    //开始验证下单数量

    //有时会取到两个地址。，第一个是客户ip，第二个是代理ip
    if(strpos($ip,',')!==false)
    {
        list($ip,$ip_remote) = explode(',',$ip);
    }
    $IpCount = $orders->getIpOrderCount($ip, $ret['product_id']);
    $config = DI();
    //$config = lib\register::getInstance("config");
    if($IpCount >=20 && !in_array($ip,$config['company_ips']))
    {
        return ['ret_code' => 501, 'ret_msg' => $ret['lang']['sms_verify_msg'][501]];
    }
    
    $theme = $ret['theme'];
    $number = I("post.num", 1, 'intval');
    //把大象塞进冰箱
    $email = trim(I("post.email"));
    if (empty($email)) {
        $email = time() . '-test@qq.com';
    }
    $time           = date('Y-m-d H:i:s', time());
    $remark         = I("post.guest");

    $name           = trim(I("post.name"));
    $lastName       = trim(I("post.last_name"));
    $tel            = trim(I("post.mob"));
    $province_id    = trim(I("post.province"));
    $city           = trim(I("post.city", ""));
    
    $address        = I("post.address");
    $address2       = I("post.address2");
    if($address2){
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

    switch ($region['id_country']){
        case 7:         //==7代表就是中国
            $country = '中国';
            $countryCode = 'CN';
            $province = $region['lang'];
            $provinceCode = $region['code'];
            $district = I("post.district");
            break;
        case 240:
            $country = $region['lang'];
            $countryCode = $region['code'];
            $province = $city;
            $city = $_POST['district'];
            $YnRegion = $regions->getOneYnRegion($province);
            $postal = $YnRegion['post_code'];
            break;
        case 102:
            $country = $region['lang'];
            $countryCode = $region['code'];
            $province = I('post.city');
            $city = $_POST['district'];
            break;
        case 199:
        case 14:
        case 106:
        case 235:
        case 31:
       // fixme:case 61:
            $country = $region['lang'];
            $countryCode = $region['code'];
            $province = $city;
            $city = $_POST['district'];
            break;
        case 236:
        case 180:
        case 70:
        case 12:
        case 131:
        case 207:
        case 113:
            $country = $region['lang'];
            $countryCode = $region['code'];
            $province = I("post.state");
            $district = I("post.district");
            break;
        case 61:
            $country = $region['lang'];
            $countryCode = $region['code'];
            $province = I("post.country");
            $city = I("post.state");
            $district = $_POST['city'];;
            break;
        default:
            $country = $region['lang'];
            $countryCode = $region['code'];
            break;
    }


    $ret['id_zone']  = $region['erp_id_zone'];

    //计算价钱
    $param['num'] = $number;
    $param['price'] = $ret['price'];
    $param['combo'] = $ret['combo'];
    $param['combo_id'] = $combo_id;
    $product_attr_price = new \lib\product_attr_price($register, $param);
    $price = $product_attr_price->getPrice();
    $attrs = [];
    $attrs_title = [];
    $payment_total = $price['total']; //套餐总价
    //如果有套餐，则循环出产品
    if ($combo_id) {
        //找到该套餐和套餐产品以及属性
        $combo = $product->getComboOfId($combo_id, $ret['product_id']);
        if (!$combo) {
            $log->write('order', "提交错误:提交了该产品没有的套餐");
            return ['ret_code'=> 504,'ret_msg'=>$ret['lang']['sms_verify_msg'][504]];
        }
        $combo_goods = $product->getComboGoods($combo_id);
        if (!$combo_goods) {
            $log->write('order', "提交错误:没有找到该套餐产品");
            return ['ret_code'=> 505,'ret_msg'=>$ret['lang']['sms_verify_msg'][505]];
        }

        $attr = [];
        if ($postAttr) {
            $attr_value = array_unique(array_values($postAttr));
            $comboAttr = $product_attr_price->getAttrInfo($attr_value);
            foreach ($postAttr as $key => $at) {
                list($combo_goods_ids, $attr_group_ids) = explode('-', $key);
                $attr[$combo_goods_ids]['number'][] = $comboAttr[$at]['number'];
                $attr[$combo_goods_ids]['title'][] = $comboAttr[$at]['name'];
            }
        } else {
            $combo_goods_attr = $product->getProductsAttrNumbers(array_unique(array_column($combo_goods, 'product_id')));
            if ($combo_goods_attr) {
                $log->write('order', "提交错误:该产品有属性，但是没传属性");
                return ['ret_code'=> 506,'ret_msg'=>$ret['lang']['sms_verify_msg'][506]];
            }
        }
        $CHECK = [];
        $order_products = [];
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

            //标题优先级  面单名称>>外文名称(截取30个字符)>>产品名称
            //$o_sales_title = substr($goods['p_sales_title'], 0, 45);
            $o_sales_title = $goods['sale_title'];
            $o_sales_title = empty($o_sales_title) ? $goods['p_sales_title']:$o_sales_title ;
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
                $log->write('order', "提交错误:提交了该产品没有的属性");
                return ['ret_code'=> 504,'ret_msg'=>$ret['lang']['sms_verify_msg'][504]];
            }

            #判断前端提交的属性，数据库是否都存在，如果否，则返回错误！[v4.7]
            $attrExist = true ;
            foreach ($attr_value as $val) {
                if (array_key_exists($val,$comboAttr) == false) {
                    $attrExist = false;
                    break;
                }
            }
            if (!$attrExist) {
                $log->write('order', "提交错误: 用户提交的部分属性不存在");
                return ['ret_code'=> 507,'ret_msg'=>$ret['lang']['sms_verify_msg'][507]];
            }
            $attrs_title = array_column($comboAttr, 'name');
        }
        else{
            $combo_goods_attr = $product->getProductsAttrNumbers($ret['product_id']);
            if ($combo_goods_attr) {
                $log->write('order', "提交错误:该产品有属性，但是没传属性");
                return ['ret_code'=> 506,'ret_msg'=>$ret['lang']['sms_verify_msg'][506]];
            }
        }
        //标题优先级  面单名称>>外文名称(截取30个字符)>>产品名称
        //$t_sales_title = substr($ret['sales_title'], 0, 45);
        $t_sales_title = $ret['sales_title'];
        $tTitle = empty($ret['waybill_title']) ? $t_sales_title : $ret['waybill_title'];
        $tTitle = empty($tTitle) ? $ret['erp_title'] : $tTitle;

        $order_products[] = [
            'id_product' => $ret['erp_number'],
            'product_id' => $ret['product_id'],
            'product_title' => $ret['erp_title'],
            'sale_title' => $tTitle,
            'price' => $price['total'],
            'promotion_price' => $price['price'],#
            'price_title' => $ret['currency_code'] . $price['total'],
            'qty' => $number,
            'attrs' => $attrs,
            'attrs_title' => $attrs_title,
            'spu' => '',
            'sku' => '',
            'id_activity' =>'',
            'product_title_foregin'=>''
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

    if ($region['id_country'] ==61){    // 俄罗斯特殊处理
        $passnr = $_POST["passnr"];             //护照号
        $taxcode = $_POST["self_tax_code"];     //个人税号

        if(!$passnr){
            return ["ret_code"=>500,"ret_msg"=>$ret['lang']["passport_no"]];
        }
        if(!$taxcode){
            return ["ret_code"=>500,"ret_msg"=>$ret['lang']['individual_tax_number']];
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
        'code_zone'=> $code_zone,
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
        'website' => implode('/',[$ret['domain'],$ret['identity_tag']]),
        'combo_id'=> isset($combo_id)?$combo_id:0,
        'combo_name'=> isset($combo)?$combo["title"]:"",
        'merchant_enum' => 1,
        'oa_id_department'=>$ret['oa_id_department']
    );

    $order_data['username'] = $product->getUsernameByCn($ret['ad_member'],$ret['ad_member_id']);


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
    $info['remark'] = $remark;
    $addressStr = implode(" ",[$country,$province,$city,$district,$address]);
    if ($region['id_country'] == 7) {
        $addressStr = implode(" ",[$province,$city,$district,$address]);
    }
    $info['addressStr'] = $addressStr;
    $info['is_show_pixel'] = 1;

    //插入本地表
    $order_id = $orders->addOrder($info);

    // 删除用户手机号查询订单数据
    delQueryOrders('mobile_query_'.$ret['domain'].$ret['identity_tag'].$info['tel']);
    
    if($order_id){
        #印度尼西亚订单确认短信
        if($ret['id_zone'] == 22){
            $matchs = [];
            $s = preg_match($config['sms_regex'][29],$info['tel'],$matchs);

            if($matchs){
                $mobile = $config['sms_order_msg'][$ret['id_zone']]['prefix'].substr($info['tel'],1,strlen($info['tel'])-1);
                $cache = \lib\register::getInstance('cache');
                if($cache && $info['tel']){
                    $smsMsg = str_replace('{{name}}',$info['title'],$config['sms_order_msg'][$ret['id_zone']]['message']);
                    $smsMsg = str_replace('{{total}}',money_number_format($info['amount'],0,'NUMBER_THOUSANDS'),$smsMsg);
                    $smsMsg = str_replace('{{orderno}}',$info['merchOrderNo'],$smsMsg);
                    $cache->rPush($config['sms_order_key'],json_encode([
                        'mobile' => $mobile,
                        'sender'=> $config['sms_order_msg'][22]['sender'],
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
        unset($_SESSION['token']);
        unset($_COOKIE['formToken']);
        return ['ret_code'=>200,'ret_msg'=>'success','orderId'=>$order_id,'total'=>$info['amount'],'pay_method'=>$info['payment_name']];
    }else{
        return ['ret_code'=>500,'ret_msg'=>'failed'];
    }
}


/**
 * 前缀和区号过滤
 * @param $mobile
 * @param $id_zone
 */
function filter_mobile($mobile,$id_zone){
    switch ($id_zone){
        case '51':      #沙特过滤:
            $alt = ['٠'=> 0, '١'=> 1, '٢'=> 2, '٣'=> 3, '٤'=> 4, '٥'=> 5, '٦'=> 6, '٧'=> 7, '٨'=> 8, '٩'=> 9, '١٠'=> 10];
            foreach ($alt as $k => $v){
                $mobile = str_replace($k,$v,$mobile);
            }
            $mobile = str_replace('00966','',$mobile);
            $mobile = str_replace('+966','',$mobile);
            $mobile = str_replace('966','',$mobile);
            if(strpos($mobile,'966') === 0){
                $mobile = substr($mobile,3,strlen($mobile)-3);
            }
            break;
        case "30":      #柬埔寨过滤
            $mobile = str_replace('00855','',$mobile);
            $mobile = str_replace('+855','',$mobile);
            if(strpos($mobile,'855') === 0){
                $mobile = substr($mobile,3,strlen($mobile)-3);
            }
            break;
        case "64":      #巴基斯担
            $mobile = str_replace('0092',0,$mobile);
            $mobile = str_replace('+92',0,$mobile);
            $mobile = str_replace('92',0,$mobile);
            if(strpos($mobile,'92') === 0){
                $mobile = substr($mobile,2,strlen($mobile)-2);
            }
            break;

    }
    return $mobile;
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

/**
 * 获得订单查询缓存数据
 * @param $key
 * @return bool|string
 */
function getQueryOrders($key)
{
    /**
     * @var $cache lib\cache\driver\Redis
     */
    $cache = \lib\register::getInstance("cache");
    if ($cache && $cache->has($key)){
        return $cache->get($key);
    }
    return false;
}

