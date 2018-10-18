<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/8/23
 * Time: 13:53
 */
namespace lib\sms;

class SmsNexmo extends ISmsMessage {

    private $MSG_API_KEY;

    private $MSG_API_SECRET;

    const MSG_API_URL = 'https://rest.nexmo.com/sms/json';

    public function __construct()
    {
        $this->MSG_API_KEY = DI('SMS.Nexmo.MSG_API_KEY');
        $this->MSG_API_SECRET = DI('SMS.Nexmo.MSG_API_SECRET');
    }

    public function Sender($from, $to,$tpl = '',$encoding = 'unicode')
    {
        if($tpl){
            $text = parent::formarMsg($tpl);
        }else{
            $text = parent::createMsg();    
        }
        if(empty($to)){
            return ['ret_result'=>false,'ret_msg'=>'发送的号码或消息错误','data'=>['code'=>parent::$msg_code,'text'=>$text]];
        }
        $params = implode("&",[
            'api_key='.$this->MSG_API_KEY,
            'api_secret='.$this->MSG_API_SECRET,
            'from='.$from,
            'to='.$to,
            'text='.$text,
            'type='.$encoding
        ]);
       // var_dump($params);exit();
        $result =  parent::sendPost(self::MSG_API_URL,$params);
        // var_dump($result);
        if($result['status']){
            $ret = json_decode($result['message'],true);
            if($ret['status'] == 0){
                return ['ret_result'=> true,'ret_msg'=>'发送成功!','data'=>['code'=>parent::$msg_code,'text'=>$text]];
            }else{
                return ['ret_result'=> false,'ret_msg'=>$result['message'],'data'=>['code'=>parent::$msg_code,'text'=>$text]];
            }
        }else{
            return ['ret_result'=> false,'ret_msg'=>$result['message'],'data'=>['code'=>parent::$msg_code,'text'=>$text]];
        }

    }

    public function CheckMobileFormat($mobile)
    {
        // TODO: Implement CheckMobileFormat() method.
    }

    public function getCodes(){
        $text = parent::createMsg();
        return ['code'=> parent::$msg_code,'text'=> $text];
    }

}