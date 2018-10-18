<?php
namespace lib;

class paypal{
    //测试环境
    private static $url = 'https://www.paypal.com/cgi-bin/webscr';
    private static $partner= 'crystal@stosz.com';

    public function __construct()
    {
        //如果是正式环境 则把环境切换成正式账户和地址
         if(environment =='idc')
         {
             self::$url = "https://www.paypal.com/cgi-bin/webscr";
             self::$partner = 'crystal@stosz.com';
         }
    }

    //去支付
    public function pay($info){
        $p_baseUrl = str_replace('\\','/',dirname($_SERVER['SCRIPT_NAME']));
        $p_baseUrl = empty($p_baseUrl)||$p_baseUrl=='/' ? '/' : '/'.trim($p_baseUrl,'/').'/';
        $p_item_name = $info['title'];
        $p_amount = $info['amount'];
        $p_invoice = $info['merchOrderNo'];
        $p_currency_code = $info['currency'];
        $p_returnUrl = "http://".getHttpHost().$p_baseUrl."response.php?code=paypal";
        $p_notify_url = "http://".getHttpHost().$p_baseUrl."response.php?code=paypal";
        $p_cancel_return = "http://".getHttpHost().$p_baseUrl."response.php?code=paypal";

        $html = '<form id="dinpayForm" name="dinpayForm" style="text-align:center;" action='.self::$url.' method="post">
				<input type="hidden" name="cmd" value="_xclick">
				<input type="hidden" name="business" value='.self::$partner.'>
				<input type="hidden" name="item_name" value='.$p_item_name.'>
				<input type="hidden" name="amount" value='.$p_amount.'>
				<input type="hidden" name="currency_code" value='.$p_currency_code.'>
				<input type="hidden" name="return" value='.$p_returnUrl.'>
				<input type="hidden" name="invoice" value='.$p_invoice.'>
				<input type="hidden" name="charset" value="utf-8">
				<input type="hidden" name="no_shipping" value="1">
				<input type="hidden" name="no_note" value="">
				<input type="hidden" name="notify_url" value='.$p_notify_url.'>
				<input type="hidden" name="rm" value="2">
				<input type="hidden" name="cancel_return" value='.$p_cancel_return.'>
			</form>
			<script>
				document.dinpayForm.submit();
			</script>';
        $log = new \lib\log();
        $log->write('paypal',"发送from数据=》".$html);
        echo $html;
    }

    public function respond($load,$info){
        $log = new \lib\log();
        $log->write('paypal','返回数据;'.json_encode($data,true));
        $payment_status = $info['payment_status'];
        $payment_amount = $info['mc_gross'];
        $payment_currency = $info['mc_currency'];
        $txn_id = $info['txn_id'];
        $receiver_email = $info['receiver_email'];
        $payer_email = $info['payer_email'];
        $order_sn = $info['invoice'];

        $request_method = strtolower($_SERVER['REQUEST_METHOD']);
        $response_type = $request_method == "post" ? 1:0;
        //判断是否支付成功
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
        $req = 'cmd=_notify-validate';
        foreach ($info as $key => $value)
        {
            $value = urlencode(stripslashes($value));
            $req .= "&$key=$value";
        }
        // post back to PayPal system to validate
        $header = "POST /cgi-bin/webscr HTTP/1.0\r\n";
        $header .= "Content-Type: application/x-www-form-urlencoded\r\n";
        $header .= "Content-Length: " . strlen($req) ."\r\n\r\n";
        $fp = fsockopen ('www.paypal.com', 80, $errno, $errstr, 30);
        if (!$fp)
        {
            fclose($fp);
            return ['ret'=>0,'msg'=>'payment failure'];
        }
        fputs($fp, $header . $req);
        while (!feof($fp))
        {
            $res = fgets($fp, 1024);
            if (strcmp($res, 'VERIFIED') == 0)
            {
                // check the payment_status is Completed
                if ($payment_status != 'Completed' && $payment_status != 'Pending')
                {
                    fclose($fp);
                    return ['ret'=>0,'msg'=>'payment failure'];
                }
                if ($receiver_email != self::$partner)
                {
                    fclose($fp);
                    return ['ret'=>0,'msg'=>'payment failure'];
                }

                // check that payment_amount/payment_currency are correct
                if ($order['payment_amount'] != money_int($payment_amount))
                {
                    fclose($fp);
                    return ['ret'=>0,'msg'=>'payment failure'];
                }
                // process payment
                fclose($fp);
                return ['ret'=>1,'msg'=>'支付成功','data'=>$data];
            }
            elseif (strcmp($res, 'INVALID') == 0)
            {
                // log for manual investigation
                fclose($fp);
                return ['ret'=>0,'msg'=>'payment failure'];
            }
        }
    }

}