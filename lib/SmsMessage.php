<?php
/**
 * 短信验证码接口类
 * User: xianfei.li@stosz.com
 * ver:  1.0
 * Date: 2017/8/3
 * Time: 10:42
 */
namespace lib;

use  lib\register;

class SmsMessage{

    private $MSG_API_KEY;

    private $MSG_API_SECRET;

    const MSG_API_URL = 'https://api.paasoocn.com/json';

    protected $msg_format = '【布谷鸟】你的验证码是{{code}}。如非本人操作，请忽略本短信';

    /**
     * 短信缓存键值格式
     * @var string
     */
    const KEY_PREFIX = 'MSG_'; //格式 MSG_{{mobile}}

    /**
     * 验证码缓存过期时间
     * @var int
     */
    protected $key_expire = 20;

    public function __construct()
    {
        $this->MSG_API_KEY = DI('SMS.Paasoo.MSG_API_KEY');
        $this->MSG_API_SECRET = DI('SMS.Paasoo.MSG_API_SECRET');
    }


    public function Sender($to,$from = 'messager',$format = ""){
        if(empty($to)){
            return ['ret_result'=> false,'ret_msg'=>'发送的号码不能为空'];
        }

        $lasttime = $this->getLastSendTime($to);
        if((time()- $lasttime) < 120){
            return ['ret_result'=> false,'ret_msg'=>'120秒只能不能重复发送'];
        }
        //重置短信格式
        if(!empty($format)){
            $this->msg_format = $format;
        }

        $code = $this->createCode(4);
        $message = $this->createMsg($code);
        $params = implode("&",[
            'key='.$this->MSG_API_KEY,
            'secret='.$this->MSG_API_SECRET,
            'from='.$from,
            'to='.$to,
            'text='.urlencode($message)
        ]);
        $sendurl = implode("?",[self::MSG_API_URL,$params]);

        $curl = curl_init();
        curl_setopt($curl,CURLOPT_URL,$sendurl);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, False);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
        $result = curl_exec($curl);
        curl_close($curl);

        $retmsg = ['ret_result' => false,'ret_msg'=>'发送失败!'];
        if($result){
            $ret = json_decode($result,true);
            switch ($ret['status']){
                case "0":
                    $db = register::getInstance('db');
                    if($db){
                        $db->insert('t_sms_record',[
                            'mobile'=>$to,
                            'smscode'=>$code,
                            'content'=>$message,
                            'atime'=>time(),
                            'isp'=>1,
                            'status'=>0,
                            'errmsg'=>''
                        ]);
                    }

                    $retmsg = ['ret_result' => true,'ret_msg'=>'发送成功!','sms_code'=>$code];
                    break;
                case "2":
                case "4":
                case "5":
                case "6":
                case "7":
                case "9":
                    $retmsg = ['ret_result' => false,'ret_msg'=>$ret['status_code']];
                    $db = register::getInstance('db');
                    if($db){
                        $db->insert('t_sms_record',[
                            'mobile'=>$to,
                            'smscode'=>$code,
                            'content'=>$message,
                            'atime'=>time(),
                            'isp'=>1,
                            'status'=>1,
                            'errmsg'=>$result
                        ]);
                    }
                    break;
                default:
                    $retmsg = ['ret_result' => false,'ret_msg'=>$ret['status_code']];
                    $db = register::getInstance('db');
                    if($db){
                        $db->insert('t_sms_record',[
                            'mobile'=>$to,
                            'smscode'=>$code,
                            'content'=>$message,
                            'atime'=>time(),
                            'isp'=>1,
                            'status'=>1,
                            'errmsg'=>$result
                        ]);
                    }
                    break;
            }
            return $retmsg;
        }
        return $retmsg;
    }

    /**
     * 检查验证码
     * @param $mobile
     * @param $code
     */
    public function CheckCodeByRedis($mobile,$msgcode){
        $cache = register::getInstance('cache');
        if($cache){
            $code = $cache->get(self::KEY_PREFIX.$mobile);
            if($msgcode == $code){
                return true;
            }else{
                return false;
            }
        }
        return false;
    }

    public function getSendCount($mobile,$interval = 60){
        if(empty($mobile)) return false;
        $db = register::getInstance('db');
        if($db){
            $result = $db->count('t_sms_record',['*'],[
                'atime[>]'=> time() - $interval,
                'mobile'=>$mobile
            ]);
            if(!$result) {
                return 0;
            }else{
                return $result;
            }
        }
        return 0;
    }

    public function getLastSendTime($mobile,$interval = 60){
        if(empty($mobile))  return false;
        $db = register::getInstance('db');
        if($db){
            $result = $db->get('t_sms_record',['atime'],['mobile'=>$mobile]);
            if($result){
                return $result['atime'];
            }else{
                return 0;
            }
        }
        return 0;
    }

    /**
     * 检查验证码
     * @param $mobile
     * @param $code
     */
    public function checkVerifyCode($order_id,$code){
        if(!$order_id || !$code) return false;
        $db = register::getInstance('db');
        if($db){
            $result = $db->get("t_sms_order",['sms_code'],[
                'order_id'=>$order_id,
                'ORDER'=>["atime"=>"DESC"],

            ],['LIMIT'=>[0,1]]);
            if($result){
                if(($code == $result['sms_code']) || (strrev($code) == $result['sms_code'])){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return false;
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
        $curl = curl_init();
        curl_setopt($curl,CURLOPT_URL,$sendurl);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, False);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
        $result = curl_exec($curl);
        curl_close($curl);
        if($result){
                return $result; // json_decode($result,true);
        }
        return false;
    }


    /**
     * 设置短信验证码格式
     * @param $format
     */
    public function setMessageFormat($format){
        if($format) $this->msg_format = $format;
    }


    /**
     * 生成验证码
     * @param int $length
     */
    private function createCode($length = 6){
        return rand(pow(10,($length-1)), pow(10,$length)-1);
    }

    /**
     * 生成短信内容
     */
    private function createMsg($code){
        return str_replace('{{code}}',$code,$this->msg_format);
    }

}