<?php
namespace lib;

class region {

    public $register;

    public function __construct($register)
    {
        $this->register =  $register;
    }

    public function getAllRegion()
    {
        $map = ['parent_id'=>0] ;
        $ret = $this->register->get("db")->select('region','*',$map);

         return $ret;
    }

    public function getSonRegion($id)
    {
        if ($id == 15)
        {
            $map = ['parent_id'=>$id] ;
            $ret = $this->register->get("db")->select('zone','*',$map);
        }else{
            $ret = $this->getYnRegion($id);
        }
        return $ret;
    }

    public function getRegion($id_zone)
    {
        $map = ['id_zone'=>$id_zone] ;
        $ret = $this->register->get("db")->get('zone',['lang','title','id_country','code','two_code'],$map);
        $ret['region_name'] = $ret['lang'];
        $ret['region_id'] = $id_zone;
        $ret['region_son'] = $this->getSonRegion($id_zone);
        return $ret;
    }

    public function getProvince($id_zone)
    {
        $map = ['id_zone'=>$id_zone];
        $ret = $this->register->get("db")->get('zone','*',$map);
        return $ret;
    }

    public function getYnRegion($id_zone)
    {
        $ret = $this->register->get("db")->select('yn_region',['name','id_region','id_parent'],['id_parent'=>0,'id_zone'=>$id_zone,'is_del'=>0]);

        if($id_zone==29 || $id_zone==51)
        {
            sort($ret);
        }
        return $ret?:[];
    }

    /**
     * [getYnRegionBypostCode 根据邮编找地区]
     * @param  [type] $id_zone [description]
     * @return [type]          [description]
     */
    public function getYnRegionBypostCode($postCode, $idZone)
    {
        $zoneName  = '马来西亚';
        $res = $this->register->get("db")->get('zone',['id_zone','title'],['title'=>$zoneName]);
        $result = [];
        if ($idZone == $res['id_zone'] ) {
            $ret1 = $this->register->get("db")->get('yn_region',['name','id_region','id_parent'],['id_zone'=>$idZone,'post_code'=>$postCode,'is_del'=>0]);
            if ($ret1) {
                $ret2 = $this->getCurrentRegion($ret1['id_parent']);
                if ($ret2) {
                    $ret3 = $this->getCurrentRegion($ret2['id_parent']);
                    
                    $result = ["state" => $ret3['name'],
                               "city" => $ret2['name'], 
                               "district" => $ret1['name']
                           ];
                }
            }
        }
        return $result;
    }

    public function getCurrentRegion($idRegion)
    {
        $map = ['id_region'=>$idRegion, 'is_del' => 0];
        $ret = $this->register->get("db")->get('yn_region',['id_region','name', 'id_parent'],$map);
        return $ret?:[];
    }

    public function getYnSonRegion($id_region){
        $map = ['id_parent'=>$id_region,'is_del'=>0,'ORDER' => ['post_code' => 'ASC']];//jimmy 加上是否删除字段
        $ret = $this->register->get("db")->select('yn_region',['name','id_region','id_zone','post_code'],$map);
        if($ret)
        {
            $id_zone = $ret[0]['id_zone'];
            if (in_array($id_zone, array(29, 51, 17,45))) {//29:印度尼西亚 51:沙特阿拉伯 17:马来西亚 45:菲律宾
                sort($ret);
            }
        }
        return $ret?:[];
    }

    public function getOneYnRegion($name)
    {
        $map = ['name'=>$name,'type'=>'city'];
        $ret = $this->register->get("db")->get('yn_region','*',$map);
        return $ret;
    }

    //获取西马的市和邮编
    public function getMLXYArea($filed,$id_zone,$is_post_code=0){

        if(!$is_post_code){
            $map = ['id_parent'=>$filed,'is_del'=>0,'id_zone'=>$id_zone];//jimmy 加上是否删除字段
            $map['GROUP'] = 'name';
        }else{
            $map = ['name'=>$filed,'is_del'=>0,'id_zone'=>$id_zone,'type'=>'ward'];
        }
        $ret = $this->register->get("db")->select('yn_region',['name','id_region','post_code'],$map);
        sort($ret);
        return $ret;
    }
    //获取西马的邮编
    public  function getMLXYCode($parent_id){
        $map = ['id_parent'=>$parent_id,'is_del'=>0,'id_zone'=>17];
        $map['GROUP'] = 'post_code';
        $ret = $this->register->get("db")->select('yn_region',['post_code'],$map);
        return $ret;
    }

    public function getZoneOfCode($postCode)
    {
        $map = ['post_code'=>$postCode,'type'=>'city','id_zone'=>11];
        $ret = $this->register->get("db")->select('yn_region','*',$map);
        $value=[];
        if($ret)
        {
            $parent_id  =  array_column($ret,'id_parent');

            $parent = $this->register->get("db")->select('yn_region',['id_region','name'],['id_region'=>$parent_id]);
            $parent = array_column($parent,NULL,'id_region');
            foreach ($ret as $item)
            {
                $item['parent_name'] = $parent[$item['id_parent']]['name'];
                $item['parent_id'] = $parent[$item['id_parent']]['id_region'];

                $value[] = $item;
            }
        }
        return $value;
    }

    //搜索
    public function getZonename($id_zone,$name){
        $map = ['name'=>$name,'is_del'=>0,'id_zone'=>$id_zone];
        $ret = $this->register->get("db")->select('yn_region',['name','id_region','id_parent','id_zone','post_code'],$map);
        if($ret){
            foreach ($ret as $key => $value){
                $ret[$key]['id_parent'] =  $this->getNavPid($value['id_parent']);
            }
        }else{
            $ret = ['msg'=>'No data was found'];
        }
        return $ret;
    }

    //获取所有父级分类
    public function getNavPid($id){
        global $tree;
        $map = ['id_region'=>$id];
        $ret = $this->register->get("db")->get('yn_region',['name','id_region','id_parent','id_zone'],$map);
        $tree[] =$ret;
        if($ret['id_parent'] != 0) return $this->getNavPid($ret['id_parent']);
        $ret = $tree;
        unset($GLOBALS['tree']);
        return $ret;
    }

}

