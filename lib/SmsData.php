<?php

namespace  lib;

use lib\register;

class SmsData {

    private $_db ;

    public function __construct()
    {
        if(register::getInstance("db")){
            $this->_db = register::getInstance('db');
        }
    }

    public function insertSmsContent($order_id,$sms_code,$in_code,$erp_data,$atime='',$isp = 0){
        if(empty($atime)) $atime = time();
        return $this->_db->insert('t_sms_order',[
            'order_id' => $order_id,
            'sms_code' => $sms_code,
            'in_code' => $in_code,
            'erp_data' => $erp_data,
            'times'    => 0,
            'status'   => 0,
            'atime'    => $atime,
            'isp'      => $isp
        ]);
    }

    public function updateSmsCode($order_id,$sms_code){
        return $this->_db->update('t_sms_order',[
            'sms_code' => $sms_code
        ],[
            'order_id' => $order_id
        ]);
    }

    public function updateErrCode($order_id,$in_code){
        return $this->_db->update('t_sms_order',[
            'in_code' => $in_code
        ],[
            'order_id' => $order_id
        ]);
    }

    public function fetchSmsOrder($order_id){
        return $this->_db->get('t_sms_order',['sms_code','erp_data'],['order_id'=>$order_id],['ORDER'=>['id'=>'DESC'],'LIMIT'=>1]);
    }

    /**
     * 获取验证次数
     * @param $order_id
     * @return mixed
     */
    public function fetchSmsTimes($order_id){
        $result = $this->_db->get("t_sms_order",['times'],['order_id'=>$order_id],['ORDER'=>['id'=>'DESC','LIMIT'=>1]]);
        if($result){
            return $result['times'];
        }
        return 0;
    }

    public function UpdateSmsTimes($order_id,$times = 1){
        return $this->_db->update('t_sms_order',[
            'times[+]' => $times
        ],[
            'order_id'=>$order_id
        ]);
    }

    public function updateErpData($order_id,$erp_data){
        return $this->_db->update('order',[
            'post_erp_data'=> $erp_data
        ],[
            'order_id' => $order_id
        ]);
    }

    public function UpdateStatus($order_id,$status = 1){
        return $this->_db->update('t_sms_order',[
            'status'=>$status
        ],[
            'order_id'=>$order_id
        ]);
    }

    public function InsertSmsRecord($mobile,$smscode,$content,$addtime,$isp,$status = 0,$errmsg = ''){
        return $this->_db->insert('t_sms_record',[
            'mobile'  => $mobile,
            'smscode' => $smscode,
            'content' => $content,
            'atime'   => $addtime,
            'isp'     => $isp,
            'status'  => $status,
            'errmsg'  => $errmsg
        ]);
    }

    protected function getIspCount($id_zone,$stype =''){
        $info = $this->_db->select('t_isp_state',[
            '[>]t_sms_isp'=>['ispid'=>'id']
        ],['ispid']
        );
        if($info){
            return array_column($info,"id");
        }
        return [];
    }

    /**
     * 获取短信服务提供商 v3.0
     * @param $areaid
     * @param string $style
     * @return bool
     */
    public function fetchIspList($id_zone,$style = ''){
        if(empty($id_zone)) return false;

        $list = $this->_db->select('t_isp_state',
            [
            '[>]t_sms_isp'=>['ispid'=>'id']
        ],[
            't_isp_state.ispid',
            't_isp_state.nation',
            't_isp_state.lang',
            't_isp_state.styles',
            't_isp_state.ncode',
            't_isp_state.prefix',
            't_sms_isp.classname'
        ],[
            't_isp_state.nation'=>$id_zone,
            't_isp_state.styles' =>$style,
            't_sms_isp.status'=>1,
        ]);
        if(!$list){
            $list = $this->_db->select('t_isp_state',[
                '[>]t_sms_isp'=>['ispid'=>'id'],
            ],[
                't_isp_state.ispid',
                't_isp_state.nation',
                't_isp_state.lang',
                't_isp_state.styles',
                't_isp_state.ncode',
                't_isp_state.prefix',
                't_sms_isp.classname'
            ],[
                't_isp_state.nation'=>$id_zone,
                't_isp_state.styles'=>'',
                't_sms_isp.status'=>1,
            ]);
        }
        if(count($list) > 1){
            $rand_isp = array_rand(array_keys($list));
            $list = $list[$rand_isp];
        }else{
            $list = $list[0];
        }
        return $list;
    }

    /**
     * 获取模版语言包
     * @param $productid
     * @return bool
     */
    public function getLangById($productid){
        if(!$productid) return false;
        $info = $this->_db->get('product',['theme','lang','id_zone'],[
           'product_id'=>intval($productid)
        ],[
            'LIMIT'=>1
        ]);
        return $info;
    }

    public function fetchIspData($ipsid){
        if(!$ipsid) return false;
        return $this->_db->get('t_sms_isp',['*'],[
            'id'=>intval($ipsid)
        ]);

    }

    public function fetchIspinfo($ispid){
        return $this->_db->get('t_sms_isp','*',[
            'id'=>$ispid
        ]);
    }

    public function fetchOrderInfo($orderId){
        return $this->_db->get('order','*',[
           'order_id'=>$orderId
        ]);
    }

    public function update_sms($orderId,$incode,$times = 1){
        return $this->_db->update('t_sms_order',[
            'in_code' => $incode,
            'times[+]'   => intval($times)
        ],[
            'order_id' => $orderId
        ]);
    }

}