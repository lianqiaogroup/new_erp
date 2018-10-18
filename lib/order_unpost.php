<?php
/**
 * Created by PhpStorm.
 * User: jimmy
 * Date: 2017/7/24
 * Time: 下午2:58
 */
namespace lib;
class order_unpost{


    public $register;

    public function __construct($register)
    {
        $this->register = $register;
    }

    public function add($data){

       return $this->register->get('db')->insert($data);
    }

}