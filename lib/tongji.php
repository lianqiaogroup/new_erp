<?php

namespace lib;
class tongji{

    public $register;

    public function __construct($register)
    {
        $this->register = $register;
    }

    public function add_uv($data){
        return $this->register->get('db')->insert('web_uv',$data);
    }

    public function checkUv($uuid){
        if(!$uuid)
        {
            return ['ret'=>0];
        }
        $TodayDate = date('Y-m-d 00:00:00',time());
        $ret = $this->register->get('db')->get('web_uv','id_uv',['uuid'=>$uuid,'visit_time[>]'=>$TodayDate]);
        return ['ret'=>1,'data'=>$ret];
    }

    public function add_pv($data){
        return $this->register->get('db')->insert('web_pv',$data);
    }

    public function update_pv($data)
    {
        
        $map['id_web_pv'] = $data['id_pv'];
        $data['last_visit_time']  = date('Y-m-d H:i:s',time());
        unset($data['id_pv']);
        $this->register->get('db')->update('web_pv',$data,$map);
    }

    public function  getHttpReferer($ip,$product_id){

        $visit_time = date('Y-m-d H:i:s',strtotime("-2 hours"));
        $map['visit_time[>]'] = $visit_time;
        $map['product_id'] = $product_id;
        $map['ip'] = $ip;

        $ret =  $this->register->get("db")->get('web_uv','url_referer',$map);
        if(!$ret)
        {
            $ret = $_SERVER['HTTP_HOST'];
        }

        return $ret;


    }

    // 判断当前时间段
    public function get_time_type(){
        $t=date('G');
        if($t>=0&&$t<8)
        {
            $type = '1';
        }
        elseif($t>=8&&$t<16){
            $type = '2';
        }
        else
        {
            $type = '3';
        }
        return $type;

    }



}