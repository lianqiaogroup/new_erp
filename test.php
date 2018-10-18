<?php

//$link = mysql_connect('ddn.cutrf0tssqpt.ap-southeast-1.rds.amazonaws.com', 'ddn', 'vSebaM3Tf7G5OA') or die('no1');

//mysql_select_db('ddntest', $link) or die('no2');

$re = checkCloak();
var_dump($re);


function getHeaders()
{
$i=0;
$headers[] = 'content-length: 0';
addHeader($headers, 'X-FF-REMOTE-ADDR', 'REMOTE_ADDR');
addHeader($headers, 'X-FF-X-FORWARDED-FOR', 'HTTP_X_FORWARDED_FOR');
addHeader($headers, 'X-FF-X-REAL-IP', 'HTTP_X_REAL_IP');
addHeader($headers, 'X-FF-DEVICE-STOCK-UA', 'HTTP_DEVICE_STOCK_UA');
addHeader($headers, 'X-FF-X-OPERAMINI-PHONE-UA', 'HTTP_X_OPERAMINI_PHONE_UA');
//$this->addHeader($headers, 'X-FF-HEROKU-APP-DIR', 'HEROKU_APP_DIR');
addHeader($headers, 'X-FF-X-FB-HTTP-ENGINE', 'X_FB_HTTP_ENGINE');
addHeader($headers, 'X-FF-X-PURPOSE', 'X_PURPOSE');
addHeader($headers, 'X-FF-REQUEST-URI', 'REQUEST_URI');
addHeader($headers, 'X-FF-COOKIE', 'HTTP_COOKIE');
addHeader($headers, 'X-FF-ACCEPT-ENCODING', 'HTTP_ACCEPT_ENCODING');
addHeader($headers, 'X-FF-ACCEPT-LANGUAGE', 'HTTP_ACCEPT_LANGUAGE');
addHeader($headers, 'X-FF-CF-CONNECTING-IP', 'HTTP_CF_CONNECTING_IP');
addHeader($headers, 'X-FF-QUERY-STRING', 'QUERY_STRING');
addHeader($headers, 'X-FF-X-FORWARDED-FOR', 'X_FORWARDED_FOR');
addHeader($headers, 'X-FF-ACCEPT', 'HTTP_ACCEPT');
addHeader($headers, 'X-FF-X-WAP-PROFILE', 'X_WAP_PROFILE');
addHeader($headers, 'X-FF-WAP-PROFILE', 'WAP_PROFILE');
addHeader($headers, 'X-FF-REFERER', 'HTTP_REFERER');
addHeader($headers, 'X-FF-HOST', 'HTTP_HOST');
addHeader($headers, 'X-FF-HOST-ORDER', 19);
addHeader($headers, 'X-FF-VIA', 'HTTP_VIA');
addHeader($headers, 'X-FF-CONNECTION', 'HTTP_CONNECTION');

addHeader($headers, 'User-Agent', 'HTTP_USER_AGENT');
return $headers;
}

function addHeader(&$headers, $key, $search)
{
$headers[] = $key . ': ' . (isset($_SERVER[$search]) ? $_SERVER[$search] : '');
}

function checkCloak()
{

    $getHeaders=getHeaders();
    $headers = 'X-FF-P: ' . 'a0a8da33-66f0-4a77-ae92-24fa21023e32';
    array_push($getHeaders,$headers);
    $ch = curl_init('http://130.211.20.155/' . 'uc967');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_DNS_CACHE_TIMEOUT, 120);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $getHeaders);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_TCP_NODELAY, 1);

    $output = curl_exec($ch);

    $curl_error_number = curl_errno($ch);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    $output = trim($output);return $output;
    list($data['result'], $data['type']) = explode(';', $output);

    return ('1'==$data['result']?true:false);
}