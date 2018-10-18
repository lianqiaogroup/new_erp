<?php
/**
 * Created by PhpStorm.
 * User: yangpan
 * Date: 2018/3/15
 * Time: 15:07
 */

namespace lib;


class cloak
{
    public $register;

    public function __construct($register)
    {
        $this->register =  $register;
    }

    //获取安全站点ID
    public function get_cloak($filter){
        $filter['is_close'] = 1;//1开启 2关闭
        return $this->register->get("db")->get('cloak','safety_id',$filter);
    }

    //cloak逻辑层
    public function cloak_logic($product,$ip)
    {
        $config = DI();
        $cloak = $config['cloak'];
        $visit_domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);     // 当前网站域名
        $jsonData['ip'] = $ip;
        $jsonData['country'] = $product['regions']['two_code'];
        $jsonData['domain'] = $visit_domain;
        $Authenticate = $cloak[$product['oa_id_department']]['user_Authenticate'];
        $Authenticate_code = $cloak[$product['oa_id_department']]['password_Authenticate'];
        if(empty($Authenticate) &&  empty($Authenticate_code)){
            $Authenticate = $cloak[661]['user_Authenticate'];
            $Authenticate_code = $cloak[661]['password_Authenticate'];
        }
        $ch = curl_init($config['cloak_url']);
        curl_setopt($ch, CURLOPT_USERPWD, "$Authenticate:$Authenticate_code");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($jsonData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60); // 设置超时限制防止死循环
        $return = curl_exec($ch);
        $return = json_decode($return, true);
        $boolean = $return['result'];           // 返回true 访问仿品，返回false 访问正品
        return $boolean;
    }


    //不同环境下获取真实的IP
    public function get_ip(){
            static $realip = NULL;
            if($realip !== NULL) return $realip;
            //判断服务器是否允许$_SERVER
            if(isset($_SERVER)){
                if(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
                    $realip = $_SERVER['HTTP_X_FORWARDED_FOR'];
                }elseif(!empty($_SERVER['HTTP_CLIENT_IP'])) {
                    $realip = $_SERVER['HTTP_CLIENT_IP'];
                }else{
                    $realip = $_SERVER['REMOTE_ADDR'];
                }
            }else{
                //不允许就使用getenv获取
                if(getenv("HTTP_X_FORWARDED_FOR")){
                    $realip = getenv( "HTTP_X_FORWARDED_FOR");
                }elseif(getenv("HTTP_CLIENT_IP")) {
                    $realip = getenv("HTTP_CLIENT_IP");
                }else{
                    $realip = getenv("REMOTE_ADDR");
                }
            }
            return $realip;
    }
}