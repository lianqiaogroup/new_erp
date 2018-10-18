<?php
namespace lib;
class ocean{
    private $account = '160419';
    private $terminal ='16041905';
    private $secureCode ='4d644LzlhH4n22zfNRvLrZ6jp026Dbzv04nvJx8ZPH4464P804888r6042Zv6220';
    private $public_key ="98b1e961d552a948314f94c7737f48398f06b34ab6a29a6d10cd6d9757342a42e4c2f1b13dabbe250f8a4bcb1c04ec8bc3ae4fc671559714a168ca46220351fd1db58db6ae920d4897074633f15f0f516b3b830084c6fef14363347c4bb95c5d25ef5f2526f2124930f4de319c0121f7b3a11173c0573de663e9b1781d5b3915";
    private $postUrl = 'https://secure.oceanpayment.com/gateway/directservice/test';


    public function setAccount($info)
    {
        if(environment =='idc')
        {
            if(!$info)
            {
                exit('partner account error!');
            }
            $ret = unserialize($info['data']);//反序列化
            $this->account = $ret['account'];
            $this->terminal =$ret['terminal'];
            $this->secureCode = $ret['secureCode'];
            $this->postUrl= 'https://secure.oceanpayment.com/gateway/directservice/pay';
            $this->public_key = $ret['publicKey'];
        }

    }

    public function index($resister,$lang)
    {
        $_LANG =[];
        if(is_file(app_path.'lib/ocean/lang/'.$lang.'.php'))
        {
            require_once app_path.'lib/ocean/lang/'.$lang.'.php';
        }
        $_LANG['key'] = $this->public_key;

        return $resister->get('view')->render('/lib/ocean/order_submit.twig',$_LANG);

    }

    public function pay($register,$data)
    {

        $last_name = empty($data['last_name']) ?$data['first_name']:$data['last_name'];
        //装参数
        $loc_order_id = $data['merchOrderNo'];
        $order_id = $data['merchOrderNo'];
        $oder_price = $data['amount'];
        $first_name = $data['first_name'];
        $email = $data['email'];
        $addr = $data['address'];
        $stl = $data['title'];
        $number = $data['number'];
        $tel = $data['tel'];
        $city = $data['city'];
        $provice = $data['province'];
        if(!$city)
        {
            $city =  $provice;
        }
//Oceanpayment账户
        $account			= $this->account;
//账户号下的终端号
        $terminal			= $this->terminal;
//securecode 获取本地存储的securecode，不需要用form表单提交
        $secureCode			= $this->secureCode;
//订单号的交易币种，采用国际标准ISO 4217，请参考附录H.1
        $order_currency		= $data['currency'];
//订单号的交易金额；最大支持小数点后2位数，如：1.00、5.01；如果交易金额为0，不需要发送至钱海支付系统
        $order_amount		= number_format($oder_price, 2, '.', '');
//$order_amount = 1.00;

//返回支付信息的网站URL地址；用于浏览器跳转
        $backUrl			= getHttpHost(false, true).'/response.php?code=ocean';
//服务器回调URL地址，用于交易结果推送及异常交易推送
        $noticeUrl			= getHttpHost(false, true).'/response.php?code=ocean';
//支付方式
        $methods			= 'Credit Card';
//网站订单号
        $order_number		= $order_id;
//信用卡信息加密串，由前端提供的js生成
        $card_data = $data['card_data'];
//信用卡的发卡行
        $card_issuer = '';
//消费者的名，如果没有该值可默认传：消费者id或N/A
        $billing_firstName	= $this->OceanHtmlSpecialChars($first_name);
//消费者的姓，如果没有该值可默认传：消费者id或N/A
        $billing_lastName	= $this->OceanHtmlSpecialChars($last_name);
//消费者的邮箱，如果没有该值可默认传：消费者id@域名或简称.com
        $billing_email		= $this->OceanHtmlSpecialChars($email);
//消费者的电话，如果没有该值可默认传：N/A
        $billing_phone		= $tel;
//消费者的账单国家，采用国际标准ISO 3166代码，如：美国 — US；如果没有该值可默认传： N/A
        $billing_country	= $data['countryCode'];
//消费者的州
//$billing_state = $provice;
//消费者的城市，如果没有该值可默认传：N/A
        $billing_city		= $city;
//消费者的详细地址，如果没有该值可默认传：N/A
        $billing_address	= $addr;
//消费者的邮编，如果没有该值可默认传：N/A
        $billing_zip		= $data['postal']?:'000000';
//消费者的 ip 地址,由网站进行获取，如果获取到多个 ip，则取第一个。,如果没获取到 ip，可传 0.0.0.0,支持 IPv4 及 IPv6
        $billing_ip			= $_SERVER["REMOTE_ADDR"];
//订单备注信息，返回时则原样返回
        $order_notes		= '';
//交易安全签名，用于验证交易的安全性
        $signValue 			= hash("sha256",$account.$terminal.$order_number.$order_currency.$order_amount.$billing_firstName.$billing_lastName.$billing_email.$secureCode);
//收货人地址信息
//收货人名
        $ship_firstName		= $billing_firstName;
//收货人姓
        $ship_lastName		= $billing_lastName;
//收货人手机
        $ship_phone			= $billing_phone;
//收货人国家，采用国际标准ISO 3166代码，如：美国 — US
        $ship_country		= $data['countryCode'];

//产品名称，多个产品用 ; 隔开，如果没有该值可默认传：N/A
        $productName		= $stl;
//产品SKU，多个产品用 ; 隔开，如果没有该值可默认传：N/A
        $productSku			= 'N/A';
//产品数量，多个产品用 ; 隔开，如果没有该值可默认传：N/A
        $productNum			= $number;

//Oceanpayment API接口版本
        $cart_api			= 'V1.8.1';


        /*==================*
         *        参数      *
        *==================*/
        $data = array(
            'account'=>$account,
            'terminal'=>$terminal,
            'signValue'=>$signValue,
            'order_number'=>$order_number,
            'order_currency'=>$order_currency,
            'order_amount'=>$order_amount,
            'noticeUrl'=>$noticeUrl,
            'methods'=>$methods,
            'card_data'=>$card_data,
            'backUrl'=>$backUrl,
            'noticeUrl'=>$noticeUrl,
            'billing_firstName'=>$billing_firstName,
            'billing_lastName'=>$billing_lastName,
            'billing_email'=>$billing_email,
            'billing_phone'=>$billing_phone,
            'billing_country'=>$billing_country,
            'billing_state'=>$billing_state,
            'billing_city'=>$billing_city,
            'billing_address'=>$billing_address,
            'billing_zip'=>$billing_zip,
            'billing_ip'=>$billing_ip,
            'order_notes'=>$order_notes,
            'signValue'=>$signValue,
            'ship_firstName'=>$ship_firstName,
            'ship_lastName'=>$ship_lastName,
            'ship_phone'=>$ship_phone,
            'ship_country'=>$ship_country,
            'ship_state'=>$ship_state,
            'ship_city'=>$ship_city,
            'ship_addr'=>$ship_addr,
            'ship_zip'=>$ship_zip,
            'productName'=>$productName,
            'productSku'=>$productSku,
            'productNum'=>$productNum,
            'cart_info'=>$cart_info,
            'cart_api'=>$cart_api,
        );

        $result_data = $this->socketPost($this->postUrl,$data);
        $log = new \lib\log();
        $log->write('ocean','发送==》'.json_encode($data,true)) ;
        $ret = $this->response($register,$result_data) ;
        $orders = new \lib\order($register);
        $orders->pay_result($ret);
    }


    public function response($load,$result_data)
    {
        $log = new \lib\log();
        $log->write('ocean','返回==》'.json_encode($result_data,1)) ;
        $xml = simplexml_load_string($result_data);
       //响应代码参数
        $response_type = (string)$xml->response_type;
        $account = (string)$xml->account;
        $terminal = (string)$xml->terminal;
        $payment_id = (string)$xml->payment_id;
        $order_number = (string)$xml->order_number;
        $order_currency = (string)$xml->order_currency;
        $order_amount = (string)$xml->order_amount;
        $payment_status = (string)$xml->payment_status;
        $payment_details = (string)$xml->payment_details;
        $back_signValue = (string)$xml->signValue;
        $order_notes = (string)$xml->order_notes;
        $card_number = (string)$xml->card_number;
        $payment_authType = (string)$xml->payment_authType;
        $payment_risk = (string)$xml->payment_risk;
        //查询是否支付成功
        $order = new \lib\order($load);
        $orderFind = $order->getOrder($order_number,1);
        $data['merchOrderNo'] = $order_number;
        $data['orderNo'] = $orderFind['order_no'];
        $data['order_id'] = $orderFind['order_id'] ;
        $data['product_id'] = $orderFind['product_id'];
        $data['response_type'] = $response_type;
        $data['success'] = 0;
        if ($orderFind['order_status'] == 'SUCCESS' && $orderFind['erp_status'] == 'SUCCESS') {
            $data['success'] = 1;
            return ['ret'=>1,'data'=>$data];
        }

        $local_signValue = hash("sha256", $account . $terminal . $order_number . $order_currency . $order_amount . $order_notes . $card_number .
            $payment_id . $payment_authType . $payment_status . $payment_details . $payment_risk . $this->secureCode);
        if (strtolower($local_signValue) != strtolower($back_signValue)) {
            $log->write('ocean','返回加密错误==》'.$result_data) ;
            return ['ret'=>0,'msg'=>'payment failure'];
        }
        if ($payment_status != 1) {
            $log->write('ocean',$payment_details) ;
            return ['ret'=>0,'msg'=>$payment_details,'data'=>$data];
        }

        return ['ret'=>1,'data'=>$data];


    }

    /**
     * 钱海支付Html特殊字符转义
     */
    function OceanHtmlSpecialChars($parameter){
        //去除前后空格
        $parameter = trim($parameter);
        //转义"双引号,<小于号,>大于号,'单引号
        $parameter = str_replace(array("<",">","'","\""),array("&lt;","&gt;","&#039;","&quot;"),$parameter);

        return $parameter;

    }


    /**
     * Socket函数
     * @param unknown $url
     * @param unknown $data
     * @return void|string
     */
    function socketPost($url, $data)
    {
        $url = parse_url($url);

        if (!$url) return "couldn't parse url";
        if (!isset($url['port'])) {
            $url['port'] = "";
        }
        if (!isset($url['query'])) {
            $url['query'] = "";
        }
        $encoded = "";
        while (list($k,$v) = each($data)) {
            $encoded .= ($encoded ? "&" : "");
            $encoded .= rawurlencode($k)."=".rawurlencode($v);
        }

        $fp = fsockopen('ssl://'.$url['host'], 443, $errno, $errstr);
        if (!$fp) return "Failed to open socket to $url[host] $port ERROR: $errno - $errstr";

        fputs($fp, sprintf("POST %s%s%s HTTP/1.0\n", $url['path'], $url['query'] ? "?" : "", $url['query']));
        fputs($fp, "Host: $url[host]\n");
        fputs($fp, "Content-type: application/x-www-form-urlencoded\n");
        fputs($fp, "Content-length: " . strlen($encoded) . "\n");
        fputs($fp, "Connection: close\n\n");

        fputs($fp, "$encoded\n");

        $line = fgets($fp,1024);
        if (!preg_match("/HTTP\/1\.\d (\d{3}) ([\w\d\s+]+)/", $line)) return;

        $results = ""; $inheader = 1;
        while(!feof($fp)) {
            $line = fgets($fp,1024);
            if ($inheader && ($line == "\n" || $line == "\r\n")) {
                $inheader = 0;
            }
            elseif (!$inheader) {
                $results .= $line;
            }
        }
        fclose($fp);
        return $results;
    }

}