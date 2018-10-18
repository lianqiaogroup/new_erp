<?php

require_once 'lib/ini.php';

//根据域名查找主页所用的风格
$domain = $_SERVER['SERVER_NAME'];
$siteProduct = new \lib\home($register, $domain);
$theme = $siteProduct->getThemeDomain();

// 初始化类
$view = new \lib\view("home/$theme", app_path);
$home = new \lib\article($register, $server_name, $theme);

$id     = I('get.id');
$data   = $home->getArticle($id);

$data['theme'] = $theme;
$view->display('article.twig', $data);
$view->embedStatScript(5, array('title' => $data['title'], 'product_id' => $data['article_id']));
