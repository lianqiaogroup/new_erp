<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/8/23
 * Time: 11:12
 */

namespace lib\sms;

use  lib\register;

abstract class ISmsMessage {

    protected static $msg_length = 4;

    protected static $msg_format = '【海淘购】你的验证码是{{code}}。如非本人操作，请忽略本短信';//【布谷鸟】

    protected static $msg_code = '0000';

    abstract function Sender($from,$to,$tpl = '', $encoding = '');

    abstract function CheckMobileFormat($mobile);

    /**
     * 生成验证码
     * @param int $length
     */
    protected static function createCode($length = 6){
        return rand(pow(10,($length-1)), pow(10,$length)-1);
    }

    /**
     * 生成短信消息格式
     * @param $code
     * @param $msg_format
     * @return mixed
     */
    protected static function createMsg(){
        self::$msg_code = self::createCode(self::$msg_length);
        return str_replace('{{code}}',self::$msg_code,self::$msg_format);
    }

    /**
     * 生成短信消息格式
     * @param $code
     * @param $msg_format
     * @return mixed
     */
    protected static function formarMsg($tpl){
        $tpl = $tpl?$tpl:self::$msg_format;
        self::$msg_code = self::createCode(self::$msg_length);
        return str_replace('{{code}}',self::$msg_code,$tpl);
    }
    

    /**
     * 设置验证码长度
     * @param int $length
     * @return int
     */
    public function setLength($length = 6){
        return self::$msg_length = $length;
    }

    /**
     * 设置短信内容格式
     * @param $format
     */
    public function setFormat($format) {
        if (empty($format)) {
            return self::$msg_format;
        }

        self::$msg_format = $format;
    }

    /**
     * POST方法
     * @param $url
     * @param $data
     * @return mixed
     */
    protected static function sendPost($url, $data, $headers = ['Content-Type:application/x-www-form-urlencoded']) {

        $curlOptions = array(
            CURLOPT_URL => $url, //访问URL
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POST => true, //发送时带有POST参数
            CURLOPT_POSTFIELDS => $data, //请求的POST参数字符串
        );
       //$responseData = \lib\Http\Curl::getResponseText($curlOptions);
        #采用异步非阻塞模式发送
        $responseData = \lib\Http\Curl::getResponseWithNoBlock($curlOptions);
        if (
                (isset($responseData['curlInfo']['http_code']) && $responseData['curlInfo']['http_code'] != 200) || $responseData['responseText'] === false //请求接口异常
                || $responseData['responseText'] === 0 //接口服务器异常
        ) {
            return ['status' => 0, 'message' => $responseData['errmsg']];
        }

        return ['status' => 1, 'message' => $responseData['responseText']];
    }

    /**
     * GET方法
     * @param $url
     * @return mixed
     */
    protected static function sendGet($url) {

        $curlOptions = array(
            CURLOPT_URL => $url, //访问URL
            CURLOPT_CUSTOMREQUEST => 'GET', //请求的POST参数字符串
        );
        //$responseData = \lib\Http\Curl::getResponseText($curlOptions);

        //采用异步非阻塞模式发送
        $responseData = \lib\Http\Curl::getResponseWithNoBlock($curlOptions);
        if (
                (isset($responseData['curlInfo']['http_code']) && $responseData['curlInfo']['http_code'] != 200) || $responseData['responseText'] === false //请求接口异常
                || $responseData['responseText'] === 0 //接口服务器异常
        ) {
            return ['status' => 0, 'message' => $responseData['errmsg']];
        }

        return ['status' => 1, 'message' => $responseData['responseText']];

    }

}