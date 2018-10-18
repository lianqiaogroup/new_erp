<?php
define('app_path',dirname(dirname(__FILE__)).'/');
require_once app_path.'vendor/autoload.php';
include_once app_path . 'lib/function.php';
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('date.timezone','Asia/Shanghai');
date_default_timezone_set("Asia/Shanghai");
$server_name = $_SERVER['HTTP_HOST'];
if($l = stripos($server_name,':')){
    $server_name = substr($server_name, 0,$l);
}
if(strtolower($server_name) == strtolower('ShopSite-ELB-1669882205.ap-southeast-1.elb.amazonaws.com')){
    $view = new \lib\view("theme",app_path);
    $view->show_404();exit;
}


//注册全局实例
lib\register::setInstance("config", new \lib\config());
lib\register::setInstance("db",new \lib\db());
lib\register::setInstance("view", new \lib\view('blog/'));
lib\register::setInstance("cache",  \lib\cache\Cache::createInstance(DI('cache')));

//session共享 redis
$sess_handler = new \lib\SessionShare(DI('session.lifetime'));
session_set_save_handler($sess_handler,true);
session_start();

define('environment',$config['environment']);