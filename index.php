<?php
// +----------------------------------------------------------------------
// |[ 程序入口文件 ]
// +----------------------------------------------------------------------
// +----------------------------------------------------------------------
// | Team:   Cuckoo
// +----------------------------------------------------------------------
// | Date:   2018/2/2 10:53
// +----------------------------------------------------------------------

require_once 'lib/ini.php';

if(!isset($_GET['1'])&&!empty($server_name) && !empty($identity_tag))
{

  //判断cloak
  $cloak_page_ddn = $register->get('db')->get('product_cloak', ['safepage', 'product_id'], ['AND' => ['domain' => $server_name, 'identity_tag' => $identity_tag]]);
  //echo 'cloak_page_ddn'.print_r($cloak_page_ddn,1);
  if(!empty($cloak_page_ddn))
  {

    $cloak_by_zone = array(

      "2"=>array('x'=>'9faf5350-ebf4-479c-90df-acc35fb33d97', 'y'=>'tki8a'),//台湾
      "3"=>array('x'=>'f9e472aa-3fdc-41fd-9a5f-0f2e80117d6b', 'y'=>'m1co9'),//香港
      "7"=>array('x'=>'ba38e5ef-1d56-4a61-8a35-5d10c1f7ffc4', 'y'=>'k4fr6'),//新加坡
      "9"=>array('x'=>'1bd272db-3424-4f78-aeff-c26be5069d0a', 'y'=>'n2mh6'),//越南
      "11"=>array('x'=>'da005a5e-91b6-4fd7-828e-f1eebd1aba00', 'y'=>'1st93'),//泰国
      "15"=>array('x'=>'296a3c28-aba4-4b2e-b04f-6195a77ebb4f', 'y'=>'f2un5'),//澳门
      "17"=>array('x'=>'fbc63a79-d571-45df-963d-091818ad737c', 'y'=>'on9nr'),//马来西亚
      "29"=>array('x'=>'218734db-8ceb-4ba4-a086-2ad5c98e4de6', 'y'=>'aqcce'),//印度尼西亚
      "45"=>array('x'=>'b4563cc1-0aa3-4c15-a640-9d4316def3c0', 'y'=>'ck67p'),//菲律宾
      "55"=>array('x'=>'bfd6a521-c744-4a80-a35d-a76f7cd3c2cb', 'y'=>'botkg'),//阿拉伯联合酋长国
    );
    //查询产品地区
    $cloak_by_zone_id = $register->get('db')->get('product', ['id_zone'], ['product_id' => $cloak_page_ddn['product_id']]);
    //echo 'cloak_by_zone_id'.print_r($cloak_by_zone_id,1);

    $cloak_by_zone_id = !empty($cloak_by_zone_id)?$cloak_by_zone_id['id_zone']:'';
    if(empty($cloak_by_zone_id) || !isset($cloak_by_zone[$cloak_by_zone_id]))
    {
      echo '<span style="display: block;text-align: center;padding-top: 100px;font-size: 24px;">Website config error.</span>';
      exit;
    }
    $cloak_by_zone = $cloak_by_zone[$cloak_by_zone_id];
    //echo 'cloak_by_zone'.print_r($cloak_by_zone,1);exit();

    $cloak_page_ddn2 = checkCloak($cloak_by_zone['x'], $cloak_by_zone['y']);

    unset($cloak_by_zone, $cloak_by_zone_id);
    if(!$cloak_page_ddn2)
    {
      echo @file_get_contents($cloak_page_ddn['safepage']);
      exit();
    }
  }
  unset($cloak_page_ddn);
}


$pLang             = strtolower($ret['lang']);

//显示页面
$isHome = $product->getHome();
if($isHome) {
    $category_id = isset($_GET['category_id']) ? $_GET['category_id'] : null;
    $product->showHome($category_id);
    exit;
}

//产品信息存redis
$KEY_PRODUCT = 'PRO_'.$server_name."_".str_replace('/','',$identity_tag);
$cache = false;

if($cache) {

   $ret = $cache->get($KEY_PRODUCT);
   if($ret) {
        $ret = json_decode($ret,true);
        $ret['token'] = $_SESSION['token'];
        if(!$_SESSION['token']) {
           $ret['token'] = md5(uniqid(rand(), true));
           $_SESSION['token'] = $ret['token'];
        }
   } else {
        $ret = $product->getProduct();
        $cache->setEx($KEY_PRODUCT,3600,json_encode($ret));
   }
} else {
    $ret = $product->getProduct();
    $view = new \lib\view('theme/'.$ret['theme'].'/');
    $pLang = $ret['regions']['code'];
}

$_SESSION['theme'] = $ret['theme'];
$theme             = $ret['theme'];

//all for test theme style85 and style86
if(($theme == 'style85') || ($theme=='style86')) {

  $domain = $ret['domain'];
  $r = $db->select('site','domain',['domain'=>$domain]);

  if($r) {
    $c =  new \lib\category($register,$ret['domain']);
    $ret['category'] = $c->getAllCategory($ret['domain']);

    $siteProduct = new \lib\home($register, $domain);
    $home_theme = $siteProduct->getThemeDomain();

    $a =  new \lib\article($register,$ret['domain'],$home_theme);
    $ret['article'] = $a->getAllArticleBy($ret['domain'],$ret['ad_member']);    
  }
}

//判断模板是否存在
if (!file_exists("./theme/$theme")) {
    echo '<span style="display: block;text-align: center;padding-top: 100px;font-size: 24px;">找不到该模板,请更换模板</span>';
    exit;
}
setcookie('orderSubmitTimer', time(), time()+3600*24, '/');
setcookie('indexTimer', time(), time()+3600*24, '/');

if($_GET['utm_campaign']){
    setcookie('utm_campaign', $_GET['utm_campaign'], time()+3600*24, '/');
}else{
   if(!empty($_COOKIE['utm_campaign'])) setcookie('utm_campaign', NULL );
}

$module = new \lib\themeDiy($register);
$module->setAddTimer($ret['add_time']);
$modules = $module->getModule($ret['product_id']);

// 兼容旧版style79
$ret['modules'] = $modules;
// 新模版配置数据
$modules = $modules['modules'];
for($i=0;$i<count($modules);$i++){
  $module_name = $modules[$i]['module_name'];
  $module_param = $modules[$i];
  $ret['modulesParam'][$module_name] = $module_param;
}

$region =  new \lib\region($register);
$ret['region']  =$region->getAllRegion();
$ret['THEME'] = '/theme/'.$theme;
$ret['jsonDatas'] = json_encode($ret, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
$ret['embedStatScript'] = $view->embedStatScript(2, $ret);
$ret['pageSign'] = 'index';

// 判断产品地区, 是否邮箱置空 
$pzone = new \lib\zone($register->get('db'));
$pBool = $pzone->isTwamZone($pLang, $ret['id_zone']);
if ($pBool) $ret['service_email'] = "";
$ret['embedStatScript'] = $view->embedStatScript(2, $ret);


$view->display('index.twig', $ret);