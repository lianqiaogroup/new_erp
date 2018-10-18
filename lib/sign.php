<?php

namespace lib;

class sign{

	function check_sign($data){
		$sign = $data['sign'];
		unset($data['sign']);
		$local_sign = $this->gen_sign($data);
		if($sign != $local_sign){
            if(environment == 'office'){
            	#echo json_encode(['ret'=>0,'msg'=>'签名错误']);exit();
            }else{
                echo json_encode(['ret'=>0,'msg'=>'签名错误']);exit();
            }
			
		}
	}

	/**
     *
     * 生成签名算法函数
     * @param array $params
     */
    private function gen_sign($params){
        $token = 'Jo7K&uis89JNks98h*9(jcs@L%s23';//一般从服务器配置文件获取
        return md5(md5( $params['timestamp'].$params['nonce'] ).$token);
    }

    /**
     * 生成随机字符串
     * @param $length
     * @return string
     */
    private function getRandomStr( $length = 8 ) {
		$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		$str ='';
		for ( $i = 0; $i < $length; $i++ )
		{
			$str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
		}
		return $str;
	}

	/**
     *
     * 签名参数组合函数
     * @param array $params
     */
    private function assemble($params)
    {
        if(!is_array($params))  return null;
        ksort($params, SORT_STRING);
        $sign = '';
        foreach($params AS $key=>$val){
            if(is_null($val))   continue;
            if(is_bool($val))   $val = ($val) ? 1 : 0;
            $sign .= $key . (is_array($val) ? $this->assemble($val) : $val);
        }
        return $sign;
    }
}

