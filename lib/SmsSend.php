<?php
/**
 * 短信验证码功能类v3.0
 * User: Administrator
 * Date: 2017/8/23
 * Time: 11:43
 */

namespace lib;

use lib\register;
use lib\sms\SmsPaasoo;
use lib\sms\SmsNexmo;
use lib\sms\ISmsMessage;
use lib\sms\yunPian;
use lib\sms\ucpaas;
use lib\SmsData;


class SmsSend {
    
    private $MSG_API_KEY;

    private $MSG_API_SECRET;

    private $_instance = null;

    //限制短信发送时长(单位：s)
    protected $limit_time = 120;

    protected $isp = 1;

    protected $sms_prefix = '886';

    protected $sms_code = '00886';

    protected $_lang = null;

    protected $_zone = null;

    protected $_style = null;

    protected $_class = 'Paasoo';

    protected $_encoding = '';

    public function __construct($productId,$lang = '',$zone = '',$style='')
    {
        $this->MSG_API_KEY = DI('SMS.Paasoo.MSG_API_KEY');
        $this->MSG_API_SECRET = DI('SMS.Paasoo.MSG_API_SECRET');

        $smsdata = new \lib\SmsData();
        $pdata = $smsdata->getLangById($productId);

       //找到该产品的语言包以及短信通道
        if($lang){
            $this->_lang = $lang;
        } else{
            $this->_lang = register::getInstance('lang');
        }

        if($zone){
            $this->_zone = $zone;
        }else{
            $this->_zone = $pdata['zone'] ;
        }

        if($style){
            $this->_style = $style;
        }

        $ispinfo = (new \lib\SmsData())->fetchIspList($this->_zone,$this->_style,$this->_lang);
        
        if($ispinfo){
            $this->sms_prefix = $ispinfo['prefix'];
            $this->sms_code = $ispinfo['ncode'];
            $this->isp = $ispinfo['ispid'];

            if(array_key_exists('sms_template',$this->_lang)){
                $this->setFormat($this->_lang['sms_template']);
            }

            #针对印尼地区
            if ($ispinfo['classname'] == '\lib\sms\SmsNexmo' ) {
                switch ($this->_zone == 29) {
                    case 29:
                        $this->_encoding = 'text';
                        break;
                    default:
                        $this->_encoding = 'unicode';
                        break;
                }

            }
            
            $this->_instance = new $ispinfo['classname']();
        }
    }

    public function Send($from,$to){
        //条件判断
        if(empty($to)){
            return ['ret_result'=>false,'ret_msg'=>'发送的手机号码为空!','isp'=>$this->isp];
        }
        $last = $this->getLastSendTime($to);
        if((time()-$last) <= $this->limit_time){
            return ['ret_result'=>false,'ret_msg'=>'限制时长内不允许重新发送!','isp'=>$this->isp];
        }
        
        if ($this->_instance instanceof ISmsMessage) {
            $to = join("",[$this->sms_prefix,$to]);
            $result = $this->_instance->Sender($from,$to,$this->_lang['sms_template'],$this->_encoding);
            $smsmodel = new SmsData();
            if($result){
                //$ret = json_decode($result,JSON_UNESCAPED_UNICODE);
                if($result['ret_result']){
                    $smsmodel->InsertSmsRecord($to,$result['data']['code'],$result['data']['text'],time(),$this->isp);
                    return ['ret_result'=> true,'ret_msg'=>'发送成功!','sms_code'=> $result['data']['code'],'isp'=>$this->isp];
                }else{
                    $smsmodel->InsertSmsRecord($to,$result['data']['code'],$result['data']['text'],time(),$this->isp,1,$result['ret_msg']);
                    return ['ret_result'=> false,'ret_msg'=>'发送失败!','sms_code'=>$result['data']['code'],'isp'=>$this->isp];
                }
            }else{
                $smsmodel->InsertSmsRecord($to,$result['data']['code'],$result['data']['text'],time(),$this->isp,1,$result['ret_msg']);
                return ['ret_result'=> false,'ret_msg'=>'发送失败!','sms_code'=>$result['data']['code'],'isp'=>$this->isp];
            }
        }else{
            return ['ret_result'=> false,'ret_msg'=>'服务器错误！','isp'=>$this->isp];
        }
    }

    public function setAreaCode($code){
        if($code) $this->sms_prefix = $code;
    }

    public function setFormat($format){
        if($this->_instance instanceof ISmsMessage){
            $this->_instance->setFormat($format);
        }
    }

    public function setLength($length = 4){
        if($this->_instance instanceof ISmsMessage){
            $this->_instance->setLength($length);
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
        $result = $this->sendGet($sendurl);
        if($result['status'] == 1 && $result['message'] == 'true'){
            return $result;
        }
        return false;
    }

    /**
     * 获取在时间间隔内发送验证码的次数
     * @param $mobile
     * @param int $interval
     * @return bool|int
     */
    public function getSendCount($mobile,$interval = 60){
        if(empty($mobile)) return 0;
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

    /**
     * 获取最后发送时间
     * @param $mobile
     * @param int $interval
     * @return bool|int
     */
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

    protected static function sendGet($url){
        $curl = curl_init();
        curl_setopt($curl,CURLOPT_URL,$url);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, False);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
        $result = curl_exec($curl);
        $retdata['status'] = 1;

        if($error = curl_error($curl)){
            $retdata['status'] = 0;
            $retdata['message'] = $error;
        }else{
            $retdata['message'] = $result;
        }
        curl_close($curl);
        return $retdata;
    }

    public function checkformat($mobile){
        return $this->CheckMobileFormat($mobile,$this->sms_code);
    }

}