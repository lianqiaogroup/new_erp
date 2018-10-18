<?php
namespace lib;

class payment{
      public $register;

    public function __construct($register)
    {
        $this->register = $register;
    }

    public function get($code)
    {
        $map =['code'=>$code];
        $ret = $this->register->get('db')->get('payment','*',$map);
        return $ret;
    }
}