<?php

namespace lib;

class esp{

    const testUrl ='https://openapi.yijifu.net/gateway.html';
    const  uri = 'https://openapiglobal.yiji.com/gateway.html';

    public function  pay($data,$payment)
    {
        $domain =  $data['domain'];
        if(strpos($domain,'www') !==false)
        {
            $domain  = str_replace('www.',"",$domain);
        }
        $info = array(
            'orderNo' => $data['orderNo'],
            'merchOrderNo' => $data['merchOrderNo'],
            'version' => '1.0',
            'protocol' => "httpPost",
            'service' => "espOrderPay",
            'notifyUrl' =>  getHttpHost(false, true).'/response.php?code=esp',
            'returnUrl' =>  getHttpHost(false, true).'/response.php?code=esp',
            'signType' => 'MD5',
            'partnerId' => $payment['account'],

            //业务参数
            'goodsInfoList' => array(), //商品列表
            'orderDetail' => array(),//订单扩展信息
            'userId' => $payment['account'],	//
            'currency' => $data['currency'],//原始订单币种
            'amount' => $data['amount'],
            'webSite' =>$domain,//所属网站 阿法贝迪
            'deviceFingerprintId' => md5($data['orderNo']), //设备指纹
            'memo' => '',//备注
            // 'orderAmount' => '1',//原始订单金额
            'acquiringType' => 'CRDIT',//收单类型,CRDIT：信用卡；YANDEX： 网银方式
            // 'orderExtends' => '',//系统扩展字段，json存储
            // 'merchOrderNo'=>date('YmdHis').rand(100,999), //新增参数，商户外部订单号
        );
        $goodsInfoList =[];
        foreach ($data['goods_list'] as $key=>$good)
        {
            $goodsInfoList[$key]['goodsNumber']  =  $good['id_product'];  //货号
            $goodsInfoList[$key]['goodsName']  =   $good['product_title']; //货物名称
            $goodsInfoList[$key]['goodsCount']  =  $data['number'];   //货物数量
            $goodsInfoList[$key]['itemSharpProductcode']  = "ST"; //商品分类
            $goodsInfoList[$key]['itemSharpUnitPrice']  =  $good['price']; //商品单价
        }

        //账单、收货等其它信息
        $orderDetail = array (
            'ipAddress' => $data['ip'], //IP地址
            'billtoCountry' => $data['countryCode'],  //账单国家
            'billtoState' => $data['provinceCode'],   //账单州
            'billtoCity' => $data['city'],    //账单城市
            'billtoPostalcode' => $data['postal'],    //账单邮编
            'billtoEmail' => $data['email'],    //账单邮箱

            'billtoFirstname' => $data['first_name'],   //接收账单人员名
            'billtoLastname' => $data['first_name'], //接收账单人员姓
            'billtoPhonenumber' => $data['tel'],    //账单电话
            'billtoStreet' => $data['address'],    //账单街道

            'shiptoCountry' => $data['countryCode'],  //收货国家
            'shiptoState' => $data['provinceCode'],   //收货州
            'shiptoCity' => $data['city'],    //收货城市
            'shiptoPostalcode' => $data['postal'],    //收货邮编
            'shiptoFirstname' => $data['first_name'],   //收货人姓
            'shiptoLastname' => $data['first_name'], //收货人名
            'shiptoEmail' => $data['email'],    //收货邮箱
            'shiptoPhonenumber' =>  $data['tel'],    //收货电话
            'shiptoStreet' => $data['address'],    //收货街道

            'logisticsFee' => '0.00',   //物流费
            'logisticsMode' => 'EMS',   //物流方式
            'cardType' => 'Visa',   //卡类型
            'customerEmail' => $data['email'],  //购买者邮箱
            'customerPhonenumber' => $data['tel'],  //购买者电话
            'merchantEmail' => $data['email'],  //商户邮箱
            'merchantName' => 'ST有限公司', //商户名
            'addressLine1' => $data['address'],    //卡地址1
            'addressLine2' => ''    //卡地址2
        );
        $info['goodsInfoList']	 = json_encode($goodsInfoList, JSON_UNESCAPED_UNICODE);
        $info['orderDetail']	 = json_encode($orderDetail, JSON_UNESCAPED_UNICODE);

        $log = new \lib\log();
        $log->write('yjf',"发送易极付数据=》".json_encode($info,1));

        //加密
        ksort($info);
        $signSrc="";
        foreach($info as $k=>$v)
        {
            if(empty($v)|| $v==="")
               unset($info[$k]);
            else
                $signSrc.= $k.'='.$v.'&';
        }
        if(get_magic_quotes_gpc()){
            $signSrc = stripslashes($signSrc);
        }
        $signSrc =  substr($signSrc, 0, -1);
        $signSrc .= $payment['key'];
        $log->write('yjf',"签名字符串==》".$signSrc);
        $info['sign'] = md5($signSrc) ;

         $html='<form name="dinpayForm" id="dinpayForm" method="POST" action="'.self::testUrl.'" >';
            foreach($info as $k => $v){
                $html .='<input type="hidden" name="'.$k.'" value="'.htmlentities($v,ENT_QUOTES,"UTF-8").'"/>';
            }
            $html.="<script> document.dinpayForm.submit(); </script>";
            $html .='</form>';

          $log->write('yjf',"发送易极付数据from=》".json_encode($html,1));
          echo $html;
    }

    public function authAccept($data,$payment)
    {
        $isAccept = 'true';
        $auth_data = array(
            'version' => '1.0',
            'protocol' => "httpPost",
            'service' => 'espOrderJudgment',
            'notifyUrl' => getHttpHost(false, true) . '/response.php',
            'returnUrl' => getHttpHost(false, true) . '/response.php',
            'signType' => 'MD5',
            'partnerId' => $payment['account'],
            //'userId' => $payment['partnerId'],
            'orderNo' => $data['orderNo'] . rand(0, 99),
            'merchOrderNo' => $data['merchOrderNo'],
            'resolveReason' => '接收交易',
            'isAccept' => $isAccept,
        );
        ksort($auth_data);
        $signSrc = "";
        foreach ($auth_data as $k => $v) {
            if (empty($v) || $v === "")
                unset($auth_data[$k]);
            else
                $signSrc .= $k . '=' . $v . '&';
        }
        $signSrc = trim($signSrc, '&') . $payment['key'];
        $auth_data['sign'] = md5($signSrc);

        $log = new \lib\log();
        $log->write('yjf',"发送易极付授权数据=》".json_encode($auth_data,1));
        $ret = post(self::testUrl,$auth_data) ;
        $log->write('yjf',"发送易极付授权反回数据=》".json_encode($auth_data,1));
        return $ret;
    }

    public function respond($data){
        //写日志
        $log = new \lib\log();
        $log->write('yjf',"接收易极付数据=》" . json_encode($_REQUEST, 1));

//语言包
        $lang = $lang->getLang();
        $htmlData['lang'] =  $lang;

        $order = new \lib\order($register);
//找支付配置
        $payments = new \lib\payment($register);
        $payment = $payments->get('yjf');

        $status = strtolower(I("status"));
        $orderNo = I("orderNo");
        $merchOrderNo = I("merchOrderNo") ;
        $getSign = I("sign");
        $success =   I('success');
//判断此订单是否成功
        $orderFind = $order->getOrder($orderNo);
        $product = $order->getProduct($orderFind['product_id']);
        if($orderFind['order_status'] =='SUCCESS')
        {
            //如果是异步回调
            if($_SERVER['REQUEST_METHOD'] =="POST")
            {
                echo "SUCCESS";
            }
            //否则跳转到支付成功页面
            else{

                $htmlData['total'] = round(money_int($orderFind['payment_amount'],'float'));
                $htmlData['pay_method'] =  $orderFind['pay_type']=='易极付'? $htmlData['lang']['yijifu']:$htmlData['lang']['cash_on_delivery'];
                $htmlData['name'] =  $orderFind['name'] ;
                $htmlData['last_name'] =  $orderFind['last_name'] ;
                $htmlData['mobile'] =  $orderFind['mobile'] ;
                $htmlData['address'] =   $orderFind['address'];
                $htmlData['shipping']  ='0.00';
                $htmlData['add_time'] =  $orderFind['add_time'] ;
                $htmlData['title'] =  $orderFind['title'] ;
                $htmlData['num'] =  $orderFind['num'] ;
                $htmlData['order_id'] =  $merchOrderNo;
                $attr_name = $order->getOrderGoodsAttr($orderFind['order_id'],$product['erp_number'])  ;
                $htmlData['attr_name'] = $attr_name;
                $htmlData['currency'] =  $product['currency'];
                $htmlData['currency_code'] =  $product['currency_code'];
                $htmlData['fb_px'] =  $product['fb_px'];
                showSuccessTemplates($view,$htmlData);
            }
            exit;
        }

        if ($success == 'true') {
            $data['orderNo'] =  $orderNo;
            $data['merchOrderNo']  = $merchOrderNo;
            //判断加密
            if($_REQUEST['a2546_pages'] || $_REQUEST['a2546_times'])
            {
                unset($_REQUEST['a2546_pages']) ;
                unset($_REQUEST['a2546_times']) ;
            }

            ksort($_REQUEST);
            $signSrc="";
            foreach($_REQUEST as $k=>$v)
            {
                if(empty($v)||$v===""||$k=='sign')
                    unset($_REQUEST[$k]);
                else
                    $signSrc.= $k.'='.$v.'&';
            }
            $signSrc =  substr($signSrc, 0, -1);
            if(get_magic_quotes_gpc()){
                $signSrc = stripslashes($signSrc);
            }
            $signSrc .=$payment['key'];
            $sign = md5($signSrc) ;
            if($sign != $getSign)
            {
                $log->write('order',"加密错误==》计算：".$sign."get：".$getSign."加密窜：".$signSrc) ;
                $msg = $lang['sign_wrong'];
                $order->updateOrder($orderNo,'FAIL',$msg);
                $order->erpTransport($data,$status,$msg);
                $htmlData['lang']['title'] = $lang['sign_wrong'];
                $view->display('error_pay.twig',$htmlData);
                exit;
            }

            if($status == 'fail')
            {
                $msg = $_REQUEST['description'];
                $order->updateOrder($orderNo,'FAIL',$msg);
                $order->erpTransport($data,$status,$msg);
                $htmlData['lang']['title'] = $lang['order_submit_fail'];
                $view->display('error_pay.twig',$htmlData);
                exit;
            }
            if ($status == 'authorizing') {
                //预授权订单通过
                $esp = new \lib\esp();
                $rets =$esp->authAccept($data,$payment);
                if(!$rets['ret'])
                {
                    $status = 'FAIL';
                    $msg = 'Authorization failure!';
                    $order->updateOrder($orderNo,$status,$msg);
                    $order->erpTransport($data,$status,$msg);

                    $htmlData['lang']['title'] = $msg;
                    $view->display('error_pay.twig',$htmlData);
                    exit;
                }
            }
            $return = json_decode($ret['return']);
            //更新本地数据库
            $order->updateOrder($orderNo,'SUCCESS',"支付成功");
            //erp通信
            $order->erpTransport($data,'success','支付成功');
            //如果是异步回调
            if($_SERVER['REQUEST_METHOD'] =="POST")
            {
                echo "SUCCESS";
            }
            //否则跳转到支付成功页面
            else{
                $htmlData['total'] =  round(money_int($orderFind['payment_amount'],'float'));
                $htmlData['pay_method'] =  $orderFind['pay_type']=='易极付'? $htmlData['lang']['yijifu']:$htmlData['lang']['cash_on_delivery'];
                $htmlData['name'] =  $orderFind['name'] ;
                $htmlData['last_name'] =  $orderFind['last_name'] ;
                $htmlData['mobile'] =  $orderFind['mobile'] ;
                $htmlData['address'] =   $orderFind['address'];
                $htmlData['shipping']  ='0.00';
                $htmlData['add_time'] =  $orderFind['add_time'] ;
                $htmlData['title'] =  $orderFind['title'] ;
                $htmlData['num'] =  $orderFind['num'] ;
                $htmlData['order_id'] =  $merchOrderNo;
                $htmlData['thumb'] =  $product['thumb'];
                $htmlData['market_price'] = $product['market_price'];
                $htmlData['service_contact_id'] = $product['service_contact_id'];
                $attr_name = $order->getOrderGoodsAttr($orderFind['order_id'],$product['erp_number'])  ;
                $htmlData['attr_name'] = $attr_name;
                $ret['THEME'] = '/theme/'.$ret['theme'];
                $htmlData['currency'] =  $product['currency'];
                $htmlData['currency_code'] =  $product['currency_code'];
                $htmlData['fb_px'] =  $product['fb_px'];
                showSuccessTemplates($view,$htmlData);
            }
        }
        else{
            $msg = $_REQUEST['resultMessage'];
            $data['orderNo']   = $orderNo;
            //更新本地数据库
            $order->updateOrder($orderNo,'FAIL',$msg);
            $htmlData['lang']['title'] = $msg;
            $view->display('error_pay.twig',$htmlData);
        }
    }
}