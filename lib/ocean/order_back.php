
<?php
	require_once '../allconfig.php';
	require_once '../deallconfig.php';
	//获取推送输入流XML
	$xml_str = file_get_contents("php://input");
	//判断返回的输入流是否为xml
	if(xml_parser($xml_str)){
		$xml = simplexml_load_string($xml_str);
			
		//把推送参数赋值到$_REQUEST
		$_REQUEST['response_type']	  = (string)$xml->response_type;
		$_REQUEST['account']		  = (string)$xml->account;
		$_REQUEST['terminal'] 	      = (string)$xml->terminal;
		$_REQUEST['payment_id'] 	  = (string)$xml->payment_id;
		$_REQUEST['order_number']     = (string)$xml->order_number;
		$_REQUEST['order_currency']   = (string)$xml->order_currency;
		$_REQUEST['order_amount']     = (string)$xml->order_amount;
		$_REQUEST['payment_status']   = (string)$xml->payment_status;
		$_REQUEST['payment_details']  = (string)$xml->payment_details;
		$_REQUEST['signValue'] 	      = (string)$xml->signValue;
		$_REQUEST['order_notes']	  = (string)$xml->order_notes;
		$_REQUEST['card_number']	  = (string)$xml->card_number;
		$_REQUEST['payment_authType'] = (string)$xml->payment_authType;
		$_REQUEST['payment_risk'] 	  = (string)$xml->payment_risk;
		$_REQUEST['methods'] 	  	  = (string)$xml->methods;
		$_REQUEST['payment_country']  = (string)$xml->payment_country;
		$_REQUEST['payment_solutions']= (string)$xml->payment_solutions;
		
		//获取本地的code值
		$secureCode       = '62zzBpjt466D4fx08h6B868vPr246r4824268d2b82zHr6znfXb02p6z04p40R8j';
		
	}
		
	
		$local_signValue  = hash("sha256",$_REQUEST['account'].$_REQUEST['terminal'].$_REQUEST['order_number'].$_REQUEST['order_currency'].$_REQUEST['order_amount'].$_REQUEST['order_notes'].$_REQUEST['card_number'].
					$_REQUEST['payment_id'].$_REQUEST['payment_authType'].$_REQUEST['payment_status'].$_REQUEST['payment_details'].$_REQUEST['payment_risk'].$secureCode);
	
		
		$description = 'Payment success';
		$status = 'success';
		//加密串校验
		if (strtolower($local_signValue) == strtolower($_REQUEST['signValue'])) {
			echo 'receive-ok';
			if ($_REQUEST['payment_status'] == 1) {		
			//支付成功
				$description = 'Payment success';
				$status = 'success';
			}elseif($_REQUEST['payment_status'] == 0){				 
			//支付失败
				$description = 'Payment failure';
				$status = 'fail';
			}elseif($_REQUEST['payment_status'] == -1){
			//预授权失败
				$description = 'Preauthorization failed';
				$status = 'authorizing';
			}
			 
		}else{			 
			//校验失败
			$description = 'Check failure';
			$status = 'processing';
		}
		file_put_contents('./order_back.txt', $description.'############', FILE_APPEND);	
//################################################################################
		$orderArr = explode('&', $_REQUEST['order_number'] );
		
		$orderNo = (string)$orderArr[1];
		$merchOrderNo = (string)$orderArr[0];
		$order_id = str_replace('STO','',$merchOrderNo);
		$payment_id = $_REQUEST['payment_id'];

		//Update to db
		$conn = mysqli_connect(DB_HOST, DB_USER, DB_PWD, DB_NAME);
		mysqli_query($conn, "set names utf8");
		
		$sql = "UPDATE sp_yh SET payment_status='$status', payment_details='$description' WHERE `id`='$payment_id'";
		$result = mysqli_query($conn, $sql);
		
		//ERP
		$data = array(
		    'notify' => 'notify',
		    'id' => $order_id,
		    'order_id' => $order_id,
		    'orderNo' => $orderNo,
		    'merchOrderNo' => $merchOrderNo,
		    'web_url' => getHttpHost(),
		    'payment_status' => $status,
		    'payment_details' => sprintf('%s {%s, %s}', $description, $orderNo, $merchOrderNo)
		);
		
		//file_put_contents('./log/curl_to_erp.txt', json_encode($data), FILE_APPEND);
		$data['key'] = md5($data['order_id'].$data['web_url']);
		$send_url = 'http://www.hepxi.com/order/api/payment';
		$flag = true;
		$try_count = 0;
		
		while ($flag && $try_count<80) {
		    $ch = curl_init();
		    curl_setopt($ch, CURLOPT_POST, true);
		    curl_setopt($ch, CURLOPT_HEADER, false);
		    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		    curl_setopt($ch, CURLOPT_URL, $send_url);
		    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
		    $response = curl_exec($ch);
		  //file_put_contents('./log/no_response.txt', $response);
		//  file_put_contents('no_data.txt', http_build_query($data));
		//  file_put_contents('yjf_notify_erp.txt', sprintf("return_erp:O:%s\t%s\t%s\t%s\n", $order_id, date('Y-m-d H:i:s'), var_export(array($_POST,$data), true), $response), FILE_APPEND);
		     $response = json_decode($response);
			  file_put_contents('./log/no_response.txt', $response->{'status'});
			  if($response->{'status'}){
			  	$flag = false;
			  }
			  sleep(1);
		    if (!curl_errno($ch)) {
		        $curl_info = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		        $order_info = json_decode($response, true);
		        if ($order_info['status']) {
		            $flag = false;
		        }
		    }
		    ++$try_count;
		}
	/**
	*  判断是否为xml
	*
	*/
	function xml_parser($str){
		$xml_parser = xml_parser_create();
		if(!xml_parse($xml_parser,$str,true)){
			xml_parser_free($xml_parser);
			return false;
		}else {
			return true;
		}
	}
?>