<?php
//装参数
$loc_order_id = $_POST['loc_order_id'];
$order_id = $_POST['order_id'];
$oder_price = $_POST['order_price'];
$first_name = $_POST['first_name'];
$last_name = $_POST['last_name'];
$email = $_POST['email'];
$addr = $_POST['address'];
$stl = $_POST['goods_name'];
$number = $_POST['goods_number'];
$tel = $_POST['telephone'];
$city = $_POST['city'];
$provice = $_POST['province'];

$p_orderNo = 'ST'.date('YmdHis').'O'.$loc_order_id;
if (strlen($loc_order_id) > 9) {
	$p_orderNo = 'STO'.$loc_order_id;
}
//$merchOrderNo
$p_invoice = 'ST'.date('YmdHis').'O'.$order_id;
if (strlen($order_id) > 9) {
	$p_invoice = 'STO'.$order_id;
}
$p_invoice = $p_invoice.'&'.$p_orderNo;

//Oceanpayment账户
$account			= $payment['account'];
//账户号下的终端号
$terminal			= $payment['terminal'];
//securecode 获取本地存储的securecode，不需要用form表单提交
$secureCode			= $payment['secureCode'];
//订单号的交易币种，采用国际标准ISO 4217，请参考附录H.1
$order_currency		= $config['order_currency'];
//订单号的交易金额；最大支持小数点后2位数，如：1.00、5.01；如果交易金额为0，不需要发送至钱海支付系统
$order_amount		= number_format($oder_price, 2, '.', '');

$mDirUrl = str_replace('\\','/',dirname($_SERVER['SCRIPT_NAME']));
//返回支付信息的网站URL地址；用于浏览器跳转
$backUrl			= 'http://'.$_SERVER['HTTP_HOST'].$mDirUrl.'/order_back.php';
//服务器回调URL地址，用于交易结果推送及异常交易推送
$noticeUrl			= 'http://'.$_SERVER['HTTP_HOST'].$mDirUrl.'/order_notify.php';
//支付方式
$methods			= 'Credit Card';
//网站订单号
$order_number		= $p_invoice;
//信用卡信息加密串，由前端提供的js生成
$card_data = $_POST['card_data'];
//信用卡的发卡行
$card_issuer = '';
//消费者的名，如果没有该值可默认传：消费者id或N/A
$billing_firstName	= OceanHtmlSpecialChars($first_name);
//消费者的姓，如果没有该值可默认传：消费者id或N/A
$billing_lastName	= OceanHtmlSpecialChars($last_name);
//消费者的邮箱，如果没有该值可默认传：消费者id@域名或简称.com
$billing_email		= OceanHtmlSpecialChars($email);
//消费者的电话，如果没有该值可默认传：N/A
$billing_phone		= $tel;
//消费者的账单国家，采用国际标准ISO 3166代码，如：美国 — US；如果没有该值可默认传： N/A
$billing_country	= $config['country'];
//消费者的州
//$billing_state		= 'AO';
//消费者的城市，如果没有该值可默认传：N/A
$billing_city		= $city;
//消费者的详细地址，如果没有该值可默认传：N/A
$billing_address	= $addr;
//消费者的邮编，如果没有该值可默认传：N/A
$billing_zip		= 'N/A';
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
$ship_country		= $config['country'];

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

//var_dump(json_encode($data));
//die();
$url_pay = 'https://secure.oceanpayment.com/gateway/directservice/test';
$result_data = $this->socketPost($url_pay,$data);
//var_dump(json_encode($result_data));
//die();
//解析XML
$xml = simplexml_load_string($result_data);

//响应代码参数
$response_type		= (string)$xml->response_type;
$account		= (string)$xml->account;
$terminal		= (string)$xml->terminal;
$payment_id 		= (string)$xml->payment_id;
$order_number		= (string)$xml->order_number;
$order_currency		= (string)$xml->order_currency;
$order_amount		= (string)$xml->order_amount;
$payment_status		= (string)$xml->payment_status;
$payment_details	= (string)$xml->payment_details;
$back_signValue 	= (string)$xml->signValue;
$order_notes		= (string)$xml->order_notes;
$card_number		= (string)$xml->card_number;
$payment_authType	= (string)$xml->payment_authType;
$payment_risk 		= (string)$xml->payment_risk;
$methods		= (string)$xml->methods;
$payment_country	= (string)$xml->payment_country;
$payment_solutions	= (string)$xml->payment_solutions;


$local_signValue  = hash("sha256",$account.$terminal.$order_number.$order_currency.$order_amount.$order_notes.$card_number.
		$payment_id.$payment_authType.$payment_status.$payment_details.$payment_risk.$secureCode);


if (strtolower($local_signValue) == strtolower($back_signValue)) {

//	var_dump($payment_status);
//	die();
	if ($payment_status == 1) {
		echo '<img style="height: 120px;width: 120px;margin-top: 100px;display: block;margin-left: auto;
    margin-right: auto;" src="./image/pay_success.png"/>';
		echo '<div style="font-size: 27px; text-align: center; margin-top: 40px;">Payment success!</p>Your order number is '.$p_orderNo.'</div><a style="margin-left: auto;margin-right: auto;display: table;margin-top: 29px;font-size: 23px;" href="../">Click here to back to mainpage!</a>';
		//支付成功
		//展示付款成功页面给消费者看
	}elseif($payment_status == -1){
		//支付待处理
		if ($payment_authType == 1) {
			echo '<img style="height: 120px;width: 120px;margin-top: 100px;display: block;margin-left: auto;
    margin-right: auto;" src="./image/pay_fail.png"/>';
			echo '<div style="font-size: 27px; text-align: center; margin-top: 40px;">Payment failure! Other anomalies!</p>Your order number is '.$p_orderNo.'</div><a style="margin-left: auto;margin-right: auto;display: table;margin-top: 29px;font-size: 23px;" href="javascript:history.back();">Click here to try again!</a>';
			//信用卡预授权，启用预授权才会有
			//展示付款成功页面给消费者看
			//订单需要人工审核
		}else{
			echo '<img style="height: 120px;width: 120px;margin-top: 100px;display: block;margin-left: auto;
    margin-right: auto;" src="./image/pay_fail.png"/>';
			echo '<div style="font-size: 27px; text-align: center; margin-top: 40px;">Payment failure!</p>Your order number is '.$p_orderNo.'</div><a style="margin-left: auto;margin-right: auto;display: table;margin-top: 29px;font-size: 23px;" href="javascript:history.back();">Click here to try again!</a>';
			//其他异常情况
			//支付失败
		}
	}elseif($payment_status == 0){
		echo '<img style="height: 120px;width: 120px;margin-top: 100px;display: block;margin-left: auto;
    margin-right: auto;" src="./image/pay_fail.png"/>';
		echo '<div style="font-size: 27px; text-align: center; margin-top: 40px;">Payment failure! Other anomalies!</p>Your order number is '.$p_orderNo.'</div><a style="margin-left: auto;margin-right: auto;display: table;margin-top: 29px;font-size: 23px;" href="javascript:history.back();">Click here to try again!</a>';
		//支付失败
		//展示付款失败页面给消费者看
	}

}else{
	echo '<img style="height: 120px;width: 120px;margin-top: 100px;display: block;margin-left: auto;
    margin-right: auto;" src="./image/pay_fail.png"/>';
	echo '<div style="font-size: 27px; text-align: center; margin-top: 40px;">Payment failure! Check failure!</p>Your order number is '.$p_orderNo.'</div><a style="margin-left: auto;margin-right: auto;display: table;margin-top: 29px;font-size: 23px;" href="javascript:history.back();">Click here to try again!</a>';
	//校验失败
	//展示付款失败页面给消费者看
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




