<?php
namespace lib;

class zone {

    public $_db; // \lib\db对象

    public function __construct($_db)
    {
        $this->_db =  $_db;
    }

    public function getAllZone()
    {
       
    }

    public function getSonZone($id)
    {
       
    }

    public function getZone($id, $field = "*"){
        $map = ['id_zone'=>$id] ;
        
        return $this->_db->get('zone',$field,$map);
    }

    public function getOriginZone($id_zone)
    {
        $zone = $this->getZone($id_zone);
        if ($zone) {
            if ($zone['parent_id'] != 0) {
                return $this->getOriginZone($zone['parent_id']);
            } else {
                return $zone;
            }
            
        }else{
            return false;
        }
    }

    public function isTwamZone($lang, $productZoneID)
    {
        $res = false;
        if (strtolower($lang) == 'tw' && $productZoneID) {
            // 台湾澳门地区提示变化
            $s = $this->getOriginZone($productZoneID);
            if (!$s) {
                die('not found product zone tree!!!');
            } 
            $specialZoneTitle = ['台湾', '澳门'];
            if (in_array($s['title'], $specialZoneTitle)) {
                $res = true;
            } 

        }
        return $res;
        
    }

 

   


}