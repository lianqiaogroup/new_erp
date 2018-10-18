<?php
/**
 * Created by PhpStorm.
 * User: jimmy
 * Date: 2017/8/23
 * Time: 上午11:45
 */

namespace lib\sms;

class ucpaas extends ISmsMessage
{
    /**
     *  云之讯REST API版本号。当前版本号为：2014-06-30
     */
    const SoftVersion = "2014-06-30";
    /**
     * API请求地址
     */
    const BaseUrl = "https://api.ucpaas.com/";
    /**
     * @var string
     * 开发者账号ID。由32个英文字母和阿拉伯数字组成的开发者账号唯一标识符。
     */
    private  $accountSid;
    /**
     * @var string
     * 开发者账号TOKEN
     */
   private $token;
    /**
     * @var string
     * 时间戳
     */
    private $timestamp;

    //手机号需要加国码和区号 格式： 00856
    public function __construct(){
        $this->accountSid = DI('SMS.UcPaas.ACCOUNTSID');
        $this->token = DI('SMS.UcPaas.TOKEN');
        $this->timestamp = date("YmdHis") + 7200;
    }

    private function getAuthorization()
    {
        $data = $this->accountSid . ":" . $this->timestamp;
        return trim(base64_encode($data));
    }
    /**
     * @return string
     * 验证参数,URL后必须带有sig参数，sig= MD5（账户Id + 账户授权令牌 + 时间戳，共32位）(注:转成大写)
     */
    private function getSigParameter(){
        $sig = $this->accountSid . $this->token . $this->timestamp;
        return strtoupper(md5($sig));
    }

    public function Sender($from, $to,$tpl = '',$encoding='')
    {
        $url = join("",[
                                self::BaseUrl,
                                self::SoftVersion,
                                '/Accounts/',
                                $this->accountSid,
                                '/Messages/templateSMS?sig=',
                                $this->getSigParameter()
                            ]);
        //self::BaseUrl . self::SoftVersion . '/Accounts/' . $this->accountSid . '/Messages/templateSMS?sig=' . $this->getSigParameter();

        //$code = parent::createCode(parent::$msg_length);

        if($tpl){
            $text = parent::formarMsg($tpl);
        }else{
            $text = parent::createMsg();    
        }
        $body_json = array(
            'templateSMS'=>array(
                    'appId'=>'9bf2f88f8cee4c4c915d063642cb9a92',
                    'templateId'=>321324,
                    'to'=>$to,
                    'param'=>parent::$msg_code
              )
        );
        $body = json_encode($body_json);

        $header = array(
                        'Accept:application/json' ,
                        'Content-Type:application/json'.';charset=utf-8',
                        'Authorization:' . $this->getAuthorization(),
                    );

        $ret = parent::sendPost($url,$body,$header); //$this->curlPost($url,$body,$header);

        //超时
        if(!$ret['status']){
            return ['ret_result'=>0,'ret_msg'=>'post超时','data'=>['code'=>parent::$msg_code,'text'=>$text]];
        }

        $return = json_decode($ret['message'],true);
        if($return['resp']['respCode'] !='000000'){
            return ['ret_result'=>0,'ret_msg'=>'发送失败，错误代码：'.$return['resp']['respCode'],'data'=>['code'=>parent::$msg_code,'text'=>$text]];
        }

        return ['ret_result'=>1,'ret_msg'=>'OK','data'=>['code'=>parent::$msg_code,'text'=>$text]];
    }


    public function CheckMobileFormat($mobile){
        return true;
    }

    public function getCodes(){
        $text = parent::createMsg();
        return ['code'=> parent::$msg_code,'text'=> $text];
    }
}