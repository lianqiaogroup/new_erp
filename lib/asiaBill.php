<?php
namespace lib;

class asiaBill{
    //测试环境
    private static $url = 'https://pay.asiabill.com/Interface'; //https://pay.asiabill.com/TestInterface
    private static $partner= '81821';
    private static $gateWayNo = '81821001';
    private static  $signKey ='lZ200rl6';
    

    //去支付
    public function pay($info){
        $p_amount = $info['amount'];
        $p_invoice = $info['merchOrderNo'];
        $p_currency_code = $info['currency'];
        $p_returnUrl = getHttpHost(false, true)."/response.php?code=bill";
        $p_notify_url = getHttpHost(false, true)."/response.php?code=bill";
        $data = [
              'merNo'=> self::$partner,
              'gatewayNo'=>self::$gateWayNo,
              'orderNo'=> $p_invoice,
              'orderCurrency'=>$p_currency_code,
              'orderAmount'=> $p_amount,
              'returnUrl'=>$p_returnUrl,
              'callbackUrl'=> $p_notify_url,
              'firstName'=>$info['first_name'],
              'lastName'=> $info['last_name']?:$info['first_name'],
              'email'=>$info['email'],
              'phone'=> $info['tel'],
              'paymentMethod'=>'Credit Card',
              'country'=> $info['countryCode'],
              'state'=> $info['province'],
              'city'=> $info['city']?:$info['province'],
              'address'=> $info['address'],
              'zip'=> $info['postal']?:'000000',
              'isMobile'   =>1
        ];

        $signInfo=hash("sha256",$data['merNo'].$data['gatewayNo'].$data['orderNo'].$data['orderCurrency'].$data['orderAmount'].$data['returnUrl'].self::$signKey);
        $data['signInfo'] = $signInfo;
        $log = new \lib\log();
        $log->write('asiabill',"发送data".json_encode($data,true));
        $html = '<form id="Form" name="Form" style="text-align:center;" action='.self::$url.' method="post">';

        foreach ($data as $key =>$value)
        {
            $html.= '<input type="hidden" name="'.$key.'" value="'.$value.'">';
        }

        $html.='</form>';
        $html .='<script>document.Form.submit();</script>';

        $log->write('asiabill',"发送from数据=》".$html);
        echo $html;
    }

    public function respond($load){
        
        $log = new \lib\log();
        $log->write('asiabill','返回数据;'.json_encode($_POST,true));

        $order_sn = $_REQUEST['orderNo'];
        $tradeNo = $_REQUEST['tradeNo'];
        $amount = $_REQUEST['orderAmount'] ;
        $order_status = $_REQUEST['orderStatus'] ;
        $signInfo = $_REQUEST['signInfo'];
        $isPush  =   $_REQUEST['isPush'];

        $request_method = strtolower($_SERVER['REQUEST_METHOD']);
        $response_type = $request_method == "post" ? 1:0;
        //判断是否支付成功
        $order = new \lib\order($load);
        $orderFind = $order->getOrder($order_sn,1);
        $data['merchOrderNo'] = $order_sn;
        $data['orderNo'] = $orderFind['order_no'];
        $data['order_id'] = $orderFind['order_id'] ;
        $data['product_id'] = $orderFind['product_id'];
        $data['response_type'] = $response_type;
        $data['success'] = 0;
        if ($orderFind['order_status'] == 'SUCCESS' && $orderFind['erp_status'] == 'SUCCESS') {
            $data['success'] = 1;
            return ['ret'=>1,'data'=>$data];
        }
        if($isPush)
        {
            $sign =  hash("sha256",$_REQUEST['notifyType'].$_REQUEST['operationResult'].$_REQUEST['merNo'].$_REQUEST['gatewayNo'].$_REQUEST['tradeNo'].$_REQUEST['orderNo'].$_REQUEST['orderCurrency'].$amount.$_REQUEST['orderStatus'].$_REQUEST['orderInfo'].self::$signKey);
        }
        else{
            $sign =   hash("sha256",$_REQUEST['merNo'].$_REQUEST['gatewayNo'].$_REQUEST['tradeNo'].$_REQUEST['orderNo'].$_REQUEST['orderCurrency'].$amount.$_REQUEST['orderStatus'].$_REQUEST['orderInfo'].self::$signKey);
        }

        //data valid
        if(strtoupper($sign) !==$signInfo)
        {
            $log->write('asiabill','加密错误;'.strtoupper($sign).'==='.$signInfo);
            return ['ret'=>0,'msg'=>'Encryption error' ];
        }
        if(money_int($amount) != $order['payment_amount'])
        {
            $log->write('asiabill','支付金额错误;'.money_int($amount).'=='.$order['payment_amount']);
            return ['ret'=>0,'msg'=>'amount error' ];
        }

        if(!$order_status)
        {
            return ['ret'=>0,'msg'=>'payment failure'];
            //if authorize
        }elseif($order_status ==-1) {
            $ret = $this->auth($tradeNo);
            if(!$ret['ret'])
            {
                return $ret;
            }
        }

        return ['ret'=>1,'msg'=>'OK','data'=>$data];
    }

    public function auth($tradeNo)
    {
        $uri = 'https://payment.asiabill.com/AuthorizeInterface';

        $data =[
            'merNo'=>self::$partner,
            'gatewayNo'=>self::$gateWayNo,
            'tradeNo' => $tradeNo,
            'authType'=>1,
        
        ];

        $sign =  hash("sha256",self::$partner.self::$gateWayNo.$tradeNo.$data['authType'].self::$signKey);
        $data['signInfo'] = $sign;
        $ret = post($uri,$data);
        if(!$ret['status'])
        {
            return ['ret'=>0,'msg'=>'authorize failure'];
        }

        $info  =  $ret['return'];
        $xml = simplexml_load_string($info);
        $orderStatus  = (string)$xml->orderStatus;
        
        if(!$orderStatus)
        {
            return ['ret'=>0,'msg'=>'authorize failure'];
        }
        return ['ret'=>1];
    }

}