<?php

/**
 * curl工具类
 * @package lib\Http
 * @author cenyongjian <cenyongjian@stosz.com>
 * @version 1.0
 * @copyright (c) 2018-06-21, cuckoo
 */

namespace lib\Http;

class Curl {

    /**
     * 获取COOKIE的存储临时文件
     * @return type 
     */
    public static function getTemporaryCookieFileName() {
        return (str_replace("\\", '/', tempnam('', 'tmp')));
    }

    /**
     * 通过 curl 发送请求并且获取相应 结果
     * @param array $curlOptions
     * @param mixed $curl_info
     * @return string 
     */

    /**
     * 通过 curl 发送请求并且获取相应 结果
     * @param array $curlOptions curl参数
     * @param boolean $isGetCurlInfo 是否获取接口响应头信息 true:获取  false:不获取 默认：true
     * @return array 
     */
    public static function getResponseText($curlOptions, $isGetCurlInfo = true) {

//        $curlOptions = array(
//            CURLOPT_USERAGENT => $user_agent, //用户浏览器信息 $_SERVER['HTTP_USER_AGENT']
//            CURLOPT_URL => $url, //访问URL
//            CURLOPT_REFERER => $refer, //哪个页面链接过来的 
//            CURLOPT_HTTPHEADER => $headers,
//            CURLOPT_RETURNTRANSFER => true, //获取结果作为字符串返回
//            CURLOPT_FOLLOWLOCATION => true, // 使用自动跳转
//            CURLOPT_HEADER => false, //获取返回头信息
//            CURLOPT_COOKIEFILE => self::getTemporaryCookieFileName(), //请求时发送的cookie所在的文件
//            CURLOPT_COOKIEJAR => self::getTemporaryCookieFileName(), //获取结果后cookie存储的文件
//            CURLOPT_POST => true, //发送时带有POST参数
//            CURLOPT_POSTFIELDS => $data, //请求的POST参数字符串
//            CURLOPT_CONNECTTIMEOUT_MS => 1000, // 等待响应的时间,单位毫秒
//            CURLOPT_TIMEOUT_MS => 1000, //设置cURL允许执行的最长秒数  
//            CURLOPT_COOKIE => 'PHPSESSID=123456860918021331410', //用户 cookie 对应 $_SERVER['HTTP_COOKIE']
//            CURLOPT_SSL_VERIFYPEER => 0, // 对认证证书来源的检查
//            CURLOPT_SSL_VERIFYHOST => 0, // 从证书中检查SSL加密算法是否存在
//        );

        /* 设置CURLOPT_RETURNTRANSFER为true */
        if (!isset($curlOptions[CURLOPT_RETURNTRANSFER]) || $curlOptions[CURLOPT_RETURNTRANSFER] == false) {
            $curlOptions[CURLOPT_RETURNTRANSFER] = true; //获取结果作为字符串返回
        }

        if (!isset($curlOptions[CURLOPT_FOLLOWLOCATION])) {
            $curlOptions[CURLOPT_FOLLOWLOCATION] = true; // 使用自动跳转
        }

        if (!isset($curlOptions[CURLOPT_HEADER])) {
            $curlOptions[CURLOPT_HEADER] = false; //获取返回头信息
        }

        if (!isset($curlOptions[CURLOPT_SSL_VERIFYPEER])) {
            $curlOptions[CURLOPT_SSL_VERIFYPEER] = 0; // 对认证证书来源的检查
        }

        if (!isset($curlOptions[CURLOPT_SSL_VERIFYHOST])) {
            $curlOptions[CURLOPT_SSL_VERIFYHOST] = 0; // 从证书中检查SSL加密算法是否存在
        }

        /* 发送请求并获取响应信息 */
        $responseText = ''; //接口响应数据
        $errmsg = ''; //错误信息
        $curlInfo = []; //接口响应头信息
        try {

            /* 初始化curl模块 */
            $curl = curl_init();
            /* 设置curl选项 */
            curl_setopt_array($curl, $curlOptions);
            $responseText = curl_exec($curl);

            if (($errno = curl_errno($curl)) != CURLM_OK) {
                $errmsg = curl_error($curl);
                $responseText = 0;
            }
        } catch (\Exception $e) {
            $errmsg = 'API ERROR';
            $responseText = false;
        }

        /**
         * curl_getinfo($curl)
         * array(26) {
         * ["url"]=>string(35) "http://www.dh3t.com/json/sms/Submit"
         * ["content_type"]=>NULL
         * ["http_code"]=>int(200)
         * ["header_size"]=>int(115)
         * ["request_size"]=>int(471)
         * ["filetime"]=>int(-1)
         * ["ssl_verify_result"]=>int(0)
         * ["redirect_count"]=>int(0)
         * ["total_time"]=>float(0.031)
         * ["namelookup_time"]=>float(0.015)
         * ["connect_time"]=>float(0.015)
         * ["pretransfer_time"]=>float(0.015)
         * ["size_upload"]=>float(336)
         * ["size_download"]=>float(95)
         * ["speed_download"]=>float(3064)
         * ["speed_upload"]=>float(10838)
         * ["download_content_length"]=>float(95)
         * ["upload_content_length"]=>float(336)
         * ["starttransfer_time"]=>float(0.031)
         * ["redirect_time"]=>float(0)
         * ["redirect_url"]=>string(0) ""
         * ["primary_ip"]=>string(14) "120.76.198.223"
         * ["certinfo"]=>array(0) {}
         * ["primary_port"]=>int(80)
         * ["local_ip"]=>string(14) "192.168.101.83"
         * ["local_port"]=>int(59281)
         *  }
         */
        if ($isGetCurlInfo) {//如果要获取接口响应头信息，就获取接口响应头信息
            $curlInfo = curl_getinfo($curl);
        }

        /* 关闭curl模块 */
        curl_close($curl);

        return [
            'responseText' => $responseText, //接口响应数据
            'curlInfo' => $curlInfo, //接口响应头信息
            'errmsg' => $errmsg, //错误信息
        ];
    }

    /**
     * 采用异步非阻塞模式进行发送
     * @param $curlOptions
     * @param bool $isGetCurlInfo
     * @return array
     */
    public static  function getResponseWithNoBlock($curlOptions, $isGetCurlInfo = true)
    {
        if (!isset($curlOptions[CURLOPT_RETURNTRANSFER]) || $curlOptions[CURLOPT_RETURNTRANSFER] == false) {
            $curlOptions[CURLOPT_RETURNTRANSFER] = true; //获取结果作为字符串返回
        }

        if (!isset($curlOptions[CURLOPT_FOLLOWLOCATION])) {
            $curlOptions[CURLOPT_FOLLOWLOCATION] = true; // 使用自动跳转
        }

        if (!isset($curlOptions[CURLOPT_HEADER])) {
            $curlOptions[CURLOPT_HEADER] = false; //获取返回头信息
        }

        if (!isset($curlOptions[CURLOPT_SSL_VERIFYPEER])) {
            $curlOptions[CURLOPT_SSL_VERIFYPEER] = 0; // 对认证证书来源的检查
        }

        if (!isset($curlOptions[CURLOPT_SSL_VERIFYHOST])) {
            $curlOptions[CURLOPT_SSL_VERIFYHOST] = 0; // 从证书中检查SSL加密算法是否存在
        }

        /* 发送请求并获取响应信息 */
        $responseText = ''; //接口响应数据
        $errmsg = ''; //错误信息
        $curlInfo = []; //接口响应头信息
        $curls = [];
        try {
            $active = null;

            /* 初始化curl模块 */
            $mcurl = curl_multi_init();

            $curl = curl_init();
            /* 设置curl选项 */
            curl_setopt_array($curl, $curlOptions);

            curl_multi_add_handle($mcurl,$curl);
            $curls[] = $curl;

            do {
                curl_multi_exec($mcurl,$active);
            } while ($active > 0);

            $curlInfo['http_code'] = 200;
            $responseText = json_encode(["status"=>0,"status_code"=> 200]);

        } catch (\Exception $e) {
            $errmsg = 'API ERROR';
            $responseText = false;
        }

        curl_multi_remove_handle($mcurl,$curl);
        /* 关闭curl模块 */
        curl_multi_close($mcurl);
        return [
            'responseText' => $responseText, //接口响应数据
            'curlInfo' => $curlInfo, //接口响应头信息
            'errmsg' => $errmsg, //错误信息
        ];
    }

    /**
     * POST 请求封装
     * @param string $url  请求地址
     * @param array $data  POST 参数
     * @param int $timeout 超时时间
     * @param string $method 请求方式 默认post
     * @return boolean|string 
     */
    public static function requestPost($url, $data = array(), $timeout = 4, $method = "post") {

        if (!is_array($data) || empty($data)) {
            return false;
        }

        $str = "";
        foreach ($data as $k => $v) {
            $nv = rawurlencode($v);
            if ($nv === null) {
                continue;
            }
            if (empty($str)) {
                $str = $k . "=" . $nv;
            } else {
                $str .= "&" . $k . "=" . $nv;
            }
        }

        $curlOptions = array(
            CURLOPT_URL => $url, //访问URL
            CURLOPT_RETURNTRANSFER => true, //获取结果作为字符串返回
            CURLOPT_FOLLOWLOCATION => true,
            //CURLOPT_HEADER => false, //获取返回头信息
            CURLOPT_POST => true, //发送时带有POST参数
            CURLOPT_POSTFIELDS => $str, //请求的POST参数字符串
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_0,
            CURLOPT_TIMEOUT => $timeout, //设置cURL允许执行的最长秒数。  
        );

        if ($method == "get") {
            $curlOptions[CURLOPT_URL] = $url . "?" . $str;
            unset($curlOptions[CURLOPT_POSTFIELDS]);
        }

        $result = self::getResponseText($curlOptions, null);

        return $result;
    }

}
