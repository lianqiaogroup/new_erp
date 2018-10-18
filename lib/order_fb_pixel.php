<?php
namespace lib;


class order_fb_pixel{

     public function add($data){

        $ret  =  \lib\register::getInstance('db')->insert('order_fb_pixel',$data);

        return $ret;

     }

     public function is_show_pixel($order_id){

         $map['order_id'] = $order_id;
         $is_show = \lib\register::getInstance('db')->get('order_fb_pixel','is_show',$map);
         if($is_show){
             return false;
         }

         return true;
     }

     public function update_is_show($order_id){
         $data['is_show'] = 1;
         $map['order_id'] = $order_id;
         $ret = \lib\register::getInstance('db')->update('order_fb_pixel',$data,$map);

         return $ret;
     }


}