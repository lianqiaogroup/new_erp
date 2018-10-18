<?php
/**
 * Created by PhpStorm.
 * User: jimmy
 * Date: 2018/5/11
 * Time: 16:06
 */

require_once 'lib/blog_ini.php';

$s = $_GET['s'];
$blog = new \lib\blog();
$blog->setIdentityTag($s);
$blog->setHost($server_name);

$data = $blog->getBlog();
if($data['ret'] ==500){

    \lib\register::getInstance('view')->show_404();
    exit;
}

$data['theme'] = '/blog';

\lib\register::getInstance('view')->display('index.twig',$data);
