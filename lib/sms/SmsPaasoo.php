<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/8/23
 * Time: 11:17
 */
namespace lib\sms;

class SmsPaasoo extends ISmsMessage {

    private $MSG_API_KEY;

    private $MSG_API_SECRET;

    const MSG_API_URL = 'https://api.paasoocn.com/json';

    public function __construct()
    {
        $this->MSG_API_KEY = DI('SMS.Paasoo.MSG_API_KEY');
        $this->MSG_API_SECRET = DI('SMS.Paasoo.MSG_API_SECRET');
    }
    public function Sender($from, $to,$tpl = '',$encoding='')
    {
        if($tpl){
            $text = parent::formarMsg($tpl);
        }else{
            $text = parent::createMsg();    
        }
        if(empty($to)){
            return ['ret_result'=> false,'ret_msg'=>'发送的号码不能为空','data'=>['code'=>parent::$msg_code,'text'=>$text]];
        }

        $params = implode("&",[
            'key='.$this->MSG_API_KEY,
            'secret='.$this->MSG_API_SECRET,
            'from='.$from,
            'to='.$to,
            'text='.urlencode($text)
        ]);
        $sendurl = implode("?",[self::MSG_API_URL,$params]);
        $result = parent::sendGet($sendurl);
        if($result['status']){
            $ret = json_decode($result['message'],true);
            switch ($ret['status']){
                case "0":
                    return ['ret_result' => true,'ret_msg'=>'发送成功!','data'=>['code'=>parent::$msg_code,'text'=>$text]];
                    break;
                case "2":
                case "4":
                case "5":
                case "6":
                case "7":
                case "9":
                    return ['ret_result' => false,'ret_msg'=>$ret['status_code'],'data'=>['code'=>parent::$msg_code,'text'=>$text]];
                    break;
                default:
                    return ['ret_result' => false,'ret_msg'=>$ret['status_code'],'data'=>['code'=>parent::$msg_code,'text'=>$text]];
                    break;
            }
        }else{
            return ['ret_result' => false,'ret_msg'=>$result['message'],'data'=>['code'=>parent::$msg_code,'text'=>$text]];
        }
    }

    /**
     * 验证号码是否符合格式规范
     * @param $mobile
     * @param string $contrycode
     * @return bool
     */
    public function CheckMobileFormat($mobile,$contrycode = '86'){
        $params = implode("&",[
            'key='.$this->MSG_API_KEY,
            'secret='.$this->MSG_API_SECRET,
            'countryCode='.$contrycode,
            'nationalNumber='.$mobile
        ]);

        $sendurl = implode("?",['https://client.paasoocn.com/api/validnumber',$params]);
        $result = parent::sendGet($sendurl);
        if($result){
            return $result;
        }
        return false;
    }

    public function getCodes(){
        $text = parent::createMsg();
        return ['code'=> parent::$msg_code,'text'=> $text];
    }
}