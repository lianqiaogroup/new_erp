<?php

namespace lib;


class SessionShare implements \SessionHandlerInterface {
    
    /**
     * 保存前缀
     */
    const PREFIX = "PHPSESSID";

    /**
     * @var \lib\Cache\driver\Redis $_handler
     */
    protected $_handler = null;

    /**
     * 设置过期时间
     * @var int|string
     */
    protected $lifetime = 0;
    
    public function __construct($lifetime = 0) {
        if(0 != $lifetime) {
            $this->lifetime = $lifetime;
        }else{
            $this->lifetime = ini_get("session.gc_maxlifetime");
        }
    }

    /**
     * 启动session
     * @param string $save_path
     * @param string $session_name
     * @return bool
     */
    public function open($save_path , $session_name ){ 
        if(is_resource($this->_handler))
            return true;
        
        $this->_handler = register::getInstance("cache");
        return true;
    }

    /**
     * 关闭session
     * @return bool|mixed
     */
    public function close(){ 
        return $this->_handler->close();
    }

    //Warning: session_start(): Failed to read session data: user (path: tcp://127.0.0.1:6379)
    // in D:\PHP\stoshop\lib\ini.php on line 31
    //PHP 7.1 要求session read操作无法命中则应该返回空串,而不是布尔值

    /**
     * @param string $session_id
     * @return mixed|string
     */
    public function read($session_id){
        $session_id = self::PREFIX.":".$session_id;
        $session_data =  $this->_handler->get($session_id);
        $value = unserialize($session_data);
        if($value === false){
            return '';
        }
        return $value;
    }

    /**
     * 垃圾回收
     * @param int $maxlifetime
     * @return bool
     */
    public function gc($maxlifetime) {
        return true;
    }

    /**
     * 销毁
     * @param string $session_id
     * @return bool
     */
    public function destroy ($session_id ){ 
        $session_id = self::PREFIX.":".$session_id;
        return $this->_handler->del($session_id) > 1 ? true : false;
    }

    /**
     * 写入
     * @param string $session_id
     * @param string $session_data
     * @return bool
     */
    public function write ( $session_id , $session_data ){
        $session_id = self::PREFIX.":".$session_id;
        return $this->_handler->setEx($session_id,$this->lifetime,serialize($session_data));
    }
}