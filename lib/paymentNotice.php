<?php
namespace lib;

class paymentNotice{
    public $register;

    public function __construct($register)
    {
        $this->register = $register;
    }

    public function insert($data= [])
    {
        $ret = $this->register->get('db')->insert('payment_notice',$data);
        return $ret;
    }
   
}