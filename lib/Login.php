<?php
namespace lib;

use lib\register;
class Login {
    private $_db;
    // 配置需要登录的域名白名单
    private $need_login_domain = [
            'http://www.zyatr.com/rook',
            'http://www.dzpas.com/test82'
    ];

    public function __construct() {
        if (register::getInstance("db")) {
            $this->_db = register::getInstance('db');
        }
    }

    public function setUserLogin() {
        // 判断来源
        $referer_url = isset($_SERVER['HTTP_REFERER']) ? parse_url($_SERVER['HTTP_REFERER']) : '';
        $referer = isset($referer_url['host']) ? $referer_url['host'] : '';
        $requset_scheme = isset($_SERVER['REQUEST_SCHEME']) ? $_SERVER['REQUEST_SCHEME'] : '';
        $server_name = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
        $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
        $request_url = $requset_scheme . '://' . $server_name . $request_uri;
        if (!in_array($request_url, $this->need_login_domain) || strpos($referer, 'facebook.com') === false) {
            if (strpos($request_uri, '.') === false) {
                setcookie('need_login', 0, 0);
            }
            return false;
        }
        if (isset($_SESSION['user']['facebook'])) {
            setcookie('need_login', 0, 0);
        } else {
            setcookie('need_login', 1, 0);
        }
        return true;
    }

}