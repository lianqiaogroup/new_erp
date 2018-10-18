<?php

namespace lib;

class register{

     public $register;

     protected static $_instances = [];
     
     public   function set($key,$value)
     {
         $this->register[$key] = $value;

     }

     public function get($key)
     {
         return    $this->register[$key];
     }
     
     public static function setInstance($alias,$instance){
        self::$_instances[$alias] = $instance;
     }
     
     public static function getInstance($alias){
         return self::$_instances[$alias];
     }
     
     /**
     * 创建一个实例
     * @param string $class 类的完整路径
     * @param mix $args 类构造方法参数
     * @return object
     */
    public static function createInstance($class, ...$args) {
        $alias = md5(json_encode(func_get_args()));
        if (isset(self::$_instances[$alias]) && self::$_instances[$alias] instanceof $class) {
            return self::$_instances[$alias];
        }

        self::$_instances[$alias] = new $class(...$args);

        return self::$_instances[$alias];
    }

}