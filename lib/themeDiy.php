<?php
namespace lib;

class themeDiy {

    public $register;
    public $addTimer;

    public function __construct($register)
    {
        $this->register =  $register;
    }

    public function getModule($product_id, $mid = 0)
    {
        $data = $confData =[];
        $map['product_id'] = $product_id;
        $theme = $this->register->get('db')->get('theme_diy', '*', $map);
        if($theme){
            $confData = json_decode($theme['data'], true);
        }
        if($mid){
            $confData = array_column($confData,NULL,"mid");
            if($confData[$mid]['module_name'] == 'countdown'){
                $confData[$mid]['end_timer'] =  $this->getNextTimer( $confData[$mid]['time_step']);
            }
            $data['modules'] = $confData[$mid];
        } else {
            array_multisort(array_column($confData,'sort'),SORT_ASC,$confData);
            foreach ($confData as $val){
                if($val['module_name'] == 'countdown')
                {
                    $val['end_timer'] = $this->getNextTimer($val['time_step']);
                }
                $module['module_id'] = $val['module_id'];
                $module['module_name'] = $val['module_name'];
                $module['sort'] = $val['sort']?:0;
                $module['options'] = $val;
                unset($module['options']['module_id'], $module['options']['module_name'], $module['options']['sort']);
                $row[] = $module;
            }
            $data['modules'] = $row;
        }
        return $data;
    }

    public function setAddTimer($value)
    {
        $this->addTimer = $value;
    }

   public function getNextTimer($step){
        
        //建站时间和服务器时间戳
       $addTimer = strtotime($this->addTimer);
       $serverTimer = time();
      // $stepStamp = $step * 3600; //转换成秒

       $lastTimer = $serverTimer -$addTimer;
       //转换成时分秒
       $timeChange = $this->timerChange($lastTimer);

       $h = $timeChange['hour'];
       $m = $timeChange['min'];
       $s = $timeChange['sec'];
       // 计算下一个周期的时间
       $nextH  = ((floor($h/$step)) + 1) * $step;
       //下一个周期的剩余时间
       $nextHStamp = $nextH * 3600;
       $nextHStamp =  $nextHStamp - ($h*3600) - ($m*60) - $s;
       //结果是 当前时间 + 下一个周期的剩余时间
       $date = date('Y-m-d H:i:s',$serverTimer + $nextHStamp);
       return $date;

   }
   public  function timerChange($timestamp){
       //计算小时数
       $hours = intval($timestamp/3600);
       //计算分钟数
       $timestamp = $timestamp%3600;
       $mins = intval($timestamp/60);
       //计算秒数
       $secs = $timestamp%60;
       $res = array("hour" => $hours,"min" => $mins,"sec" => $secs);
       return $res;

   }
}