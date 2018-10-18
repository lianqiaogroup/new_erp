<?php
namespace lib;

class bluePay{
    //测试环境
    private static $url = 'http://th.webpay.bluepay.tech/bluepay/index.php?';//支付网关地址
    private static $fixed_code= '6';//固定编码 6表示银行支付
    private static $bgProductId = '1145';
	private static $secretkey = 'ej3RvUL8LqQ8ibOE';	
    //去支付
    public function pay($info){
		$log = new \lib\log();
		if(empty($info['amount']) || !is_numeric($info['amount']) || $info['amount'] < 0){
			echo "支付金额为空或者不是大于0的数字。";
			exit;
		}
		
		if(empty($info['merchOrderNo'])){
			echo "订单编码不能为空。";
			exit;
		}
		
		$keywords = self::$fixed_code.self::$bgProductId.$info['merchOrderNo'];  //6位固定编码+4位产品ID（Blue后台设置的产品ID）+ 交易id(数字下划线，不超过32位)
		$price = $info['amount'] * 100;

        $url = self::$url."keyword={$keywords}&price={$price}";		
        $html = "<script>window.location.href = '{$url}';</script>";
        $log->write('bluepay',"发送from数据=》".$html);
        echo $html;
    } 
	
	/**接收返回参数*/
    public function response($load,$result_data,$noticeRecord = null)
    {		
		
	
		
        $log = new \lib\log();
        $log->write('bluePay','返回==》'.json_encode($result_data,1)) ;
        //查询是否支付成功
		if(empty($result_data['t_id'])){
			 return ['ret'=>0,'msg'=>'交易订单号为空.'];
		}
		
		if(empty($result_data['price'])){
			 return ['ret'=>0,'msg'=>'订单金额为空.'];
		}
		
		if(empty($result_data['status'])){
			 return ['ret'=>0,'msg'=>'status  Empty.'];
		}
		
		if(empty($result_data['interfacetype']) || $result_data['interfacetype'] != 'bank'){
				if($result_data['operator']!='Test'){		
					return ['ret'=>0,'msg'=>'暂时只接收银行卡渠道.'];
				}
			}	

		if(empty($result_data['productid']) || $result_data['productid'] != self::$bgProductId){
			 return ['ret'=>0,'msg'=>'跟BLUEPAY设定的产品ID不一致.'];
		}		
		
		

		if(empty($result_data['encrypt']) ||  strpos($_SERVER['QUERY_STRING'],'&encrypt') === false ){
			 return ['ret'=>0,'msg'=>'encrypt  Empty.'];
		}	

		$encrypt_pos = strpos($_SERVER['QUERY_STRING'],'&encrypt');		
		$url_parl_url = substr($_SERVER['QUERY_STRING'],0,$encrypt_pos);
		//echo md5($url_parl_url.self::$secretkey);exit;		
		if(md5($url_parl_url.self::$secretkey)!= $result_data['encrypt']){
			return ['ret'=>0,'msg'=>'密钥验证不通过.'];
		}	

		$received_url = 'http://'.$_SERVER['HTTP_HOST'].':'.$_SERVER['SERVER_PORT'].$_SERVER['REQUEST_URI'];
		$serial_number = $result_data['bt_id'];
		$paid_status = $result_data['status'];
		if($noticeRecord){
			$notice_data = array(
				'serial_number'=>$serial_number,
				'erp_no'=>$result_data['t_id'],
				'data'=>json_encode($result_data),
				'received_url'=>$received_url,
				'syn_status'=>0,
				'payment_method'=>'BluePay',
				'paid_status'=>$result_data['status'],
				'created_time'=>date('Y-m-d H:i:s'),
				'updated_time'=>date('Y-m-d H:i:s')
			);			
			$noticeRecord->insert($notice_data);
		}
		
		//serial_number
		
		$order_number = $result_data['t_id'];
        $order = new \lib\order($load);
        $orderFind = $order->getOrder($order_number,1);
		if(empty($orderFind)){
			return ['ret'=>0,'msg'=>'Order Not Exists.'];
		}


		//print_r($orderFind);exit; 
		
        if ($orderFind['order_status'] == 'SUCCESS' && $orderFind['erp_status'] == 'SUCCESS') {
            $data['success'] = 1;
            return ['ret'=>1,'data'=>$data];
        }
		
		if($result_data['price'] != $orderFind['payment_amount']){
			return ['ret'=>0,'msg'=>'与订单价格不符.'];
		}
		
		if($result_data['currency'] != 'THB'){
			return ['ret'=>0,'msg'=>'错误的币种，应该返回THB.'];
		}
		
		if($result_data['status'] != 200){
			return ['ret'=>0,'msg'=>'付款失败.'];
		}


	
		
        /**
			//tody  密钥验证
		*/
		$data = [];
        $data['merchOrderNo'] = $orderFind['erp_no'];
        $data['orderNo'] = $orderFind['order_no'];
        $data['order_id'] = $orderFind['order_id'] ;
        $data['product_id'] = $orderFind['product_id'];
        $data['response_type'] = "bluepay";
      	
		$ret = ['ret'=>1,'data'=>$data];       
        $order->pay_result_without_redirect($ret);

    }	
	

}