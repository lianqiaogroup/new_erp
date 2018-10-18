<?php
/**
 * Created by PhpStorm.
 * User: jimmy
 * Date: 2017/8/23
 * Time: 上午11:16
 */

namespace lib\sms;

class yunPian extends ISmsMessage {
    //发送短信url
    const uri ='https://sms.yunpian.com/v2/sms/single_send.json';

    const msg_format ='【海淘购】您的验证码是 {{code}}';
    //apiKey
    private $apiKey;

    public function __construct()
    {
        $this->apiKey = DI('SMS.YunPian.MSG_API_KEY');
    }
    //大陆手机直接输入手机号
     //台湾香港需要加区号 格式： +856

    public function Sender($from, $to,$tpl = '',$encoding='')
    {
        if($tpl){
            $msg = parent::formarMsg($tpl);
        }else{
            $msg = parent::createMsg();
        }
        $send = [
            'mobile'=>$to,
            'text'=>$msg,
            'apikey'=>$this->apiKey
        ];
        $ret =  parent::sendPost(self::uri,http_build_query($send),['Accep:application/json','charset:utf-8','Content-Type:application/x-www-form-urlencoded']);
        //超时
        if(!$ret['status']){
            return ['ret_result'=> 0 ,'ret_msg'=>'post超时','data'=>['code'=>parent::$msg_code,'text'=>$msg]];
        }
        $return =  json_decode($ret['message'],true);
        //发送失败
        if($return['code'] !=0)
        {
            return ['ret_result'=>0,'ret_msg'=>$return['detail'],'data'=>['code'=>parent::$msg_code,'text'=>$msg]];
        }

        //发送成功
        return ['ret_result'=>1,'ret_msg'=>"OK",'data'=>['code'=>parent::$msg_code,'text'=>$msg]];
    }
    public function CheckMobileFormat($mobile)
    {

        return true;
    }

    public function getCodes(){
        $text = parent::createMsg();
        return ['code'=> parent::$msg_code,'text'=> $text];
    }
}