<?php
/**钱币整数格式
 * @param number $number 数值
 * @param string $type 类型,int 乘以100 ；float除以100
 * @param int $decimals 小数位数
 * @param string $is_currency_local
 *                  NUMBER:默认number_format格式化，
 *                  NUMBER_THOUSANDS:默认number_format格式化,有千分位符号，
 *                  CURRENCY:是显示货币符号,有千分位
 *                  CURRENCY_THOUSANDS_NO:是显示货币符号,没有千分位符号，
 *                  CURRENCY_NO:不显示货币符号,有千分位
 * @param array $options 扩展参数 ['dec_point' => '.', 'thousands_se' => ',', 'locale' => 'zh_CN']
 * @return mixed
 */
function money_int($number, $type = 'int', $decimals = 2, $is_currency_local = 'NUMBER', array $options = [])
{
    if (!isset($number) || !is_numeric($number)) {
        return 0;
    }
    $ret = $number * ($type == 'int' ? 100 : 0.01);
    if ($type == 'float') {
        return money_number_format($ret, $decimals, $is_currency_local, $options);
    } else {
        return $ret;
    }
}
//curl函数
function httpGet($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    //执行并获取HTML文档内容
    $output = curl_exec($ch);
    //释放curl句柄
    curl_close($ch);
    return $output;
}
/**货币格式化
 * @param number $number 数值
 * @param int $decimals 小数位数
 * @param string $is_currency_local
 *                  NUMBER:默认number_format格式化,没有千分位符号，
 *                  NUMBER_THOUSANDS:默认number_format格式化,有千分位符号，
 *                  CURRENCY:是显示货币符号,有千分位
 *                  CURRENCY_THOUSANDS_NO:是显示货币符号,没有千分位符号，
 *                  CURRENCY_NO:不显示货币符号,有千分位
 * @param array $options 扩展参数 ['dec_point' => '.', 'thousands_se' => ',', 'locale' => 'zh_CN']
 * @return string
 */
function money_number_format($number, $decimals = 0, $is_currency_local = 'NUMBER', array $options = [])
{
    $opt = ['dec_point' => '.', 'thousands_se' => '', 'locale' => 'zh_CN'];
    $options && $opt = array_merge($opt, $options);
    if ($is_currency_local == 'NUMBER') {
        return number_format($number, $decimals, $opt['dec_point'], $opt['thousands_se']);
    } elseif ($is_currency_local == 'NUMBER_THOUSANDS') {
        $opt['thousands_se'] = ',';
        return number_format($number, $decimals, $opt['dec_point'], $opt['thousands_se']);
    } else {
        //国家语言
        if (!$opt['locale']) {
            $opt['locale'] = 'zh_CN';
        }
        if ($is_currency_local == 'CURRENCY') {
            $currency = get_S('MONEY/TYPE')[$opt['locale']];
            if (!$currency) {
                $currency = 'CNY';
            }
            return (new \NumberFormatter($opt['locale'], \NumberFormatter::CURRENCY))->formatCurrency($number, $currency);
        } else if ($is_currency_local == 'CURRENCY_THOUSANDS_NO') {
            $currency = get_S('MONEY/TYPE')[$opt['locale']];
            if (!$currency) {
                $currency = 'CNY';
            }
            return str_replace(',', '', (new \NumberFormatter($opt['locale'], \NumberFormatter::CURRENCY))->formatCurrency($number, $currency));
        } else {
            $fmt = new \NumberFormatter($opt['locale'], \NumberFormatter::DECIMAL);
            $number = $fmt->format($number);
            if (intl_is_failure($fmt->getErrorCode())) {
                exit("Formatter error");
            }
            return $number;
        }
    }
}

/** POST 数据
 * @param       $url 链接
 * @param       $data 数据：数组或字符串格式
 * @param array $header 头部
 * @param int   $time_out 超时时间
 * @return mixed
 */
function post($url, $data, $header = ["Content-Type" => "application/x-www-form-urlencoded;"], $time_out = 60) {
    if (is_array($data)) {
        $data = http_build_query($data);
    }
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_TIMEOUT, $time_out); // 设置超时限制防止死循环
    $res = curl_exec($ch); //接收返回信息
    $ret = ['status' => 1];
    //print_r(curl_getinfo($ch));
    if ($error = curl_errno($ch)) { //出错则显示错误信息
        $ret['status'] = 0;
        $ret['return'] = $error;
    } else {
        $ret['return'] = $res;
    }
    curl_close($ch); //关闭curl链接
    return $ret; //显示返回信息
}

/***
 * 模拟用户浏览器post
 ***/
 function vpost($url, $data,$header) { // 模拟提交数据函数
    if (is_array($data)) {
        $data = http_build_query($data);
    }
    $curl = curl_init(); // 启动一个CURL会话
    curl_setopt($curl, CURLOPT_URL, $url); // 要访问的地址
    //   curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0); // 对认证证书来源的检查
    // curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 1); // 从证书中检查SSL加密算法是否存在
    curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // 模拟用户使用的浏览器
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
    curl_setopt($curl, CURLOPT_AUTOREFERER, 1); // 自动设置Referer
    curl_setopt($curl, CURLOPT_POST, 1); // 发送一个常规的Post请求
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data); // Post提交的数据包
    curl_setopt($curl, CURLOPT_TIMEOUT, 30); // 设置超时限制防止死循环
    curl_setopt($curl, CURLOPT_HTTPHEADER, $header); // 显示返回的Header区域内容
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); // 获取的信息以文件流的形式返回
    $res = curl_exec($curl); // 执行操作
    $ret = ['status' => 1];
    //print_r(curl_getinfo($curl));
    if ($error = curl_errno($curl)) {
        $ret['status'] = 0;
        $ret['return'] = $error;
    } else {
        $ret['return'] = $res;
    }
    curl_close($curl); // 关闭CURL会话
    return $ret; // 返回数据
}

function getHttpHost($hostname = true, $http = false)
{
    $host = (isset($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : $_SERVER['HTTP_HOST']);
    if ($pos = strpos($host, ':'))
        $host = substr($host, 0, $pos);
    if ($hostname) {
        if (stripos($host, 'www.') !== false)
            $host = str_ireplace('www.', '', $host);
    }
    if ($http)
        $host = 'http://'.$host;

    return $host;
}

function _is_mobile(){
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    $mobile_agents = Array("240x320", "acer", "acoon", "acs-", "abacho", "ahong", "airness", "alcatel", "amoi", "android", "anywhereyougo.com", "applewebkit/525", "applewebkit/532", "asus", "audio", "au-mic", "avantogo", "becker", "benq", "bilbo", "bird", "blackberry", "blazer", "bleu", "cdm-", "compal", "coolpad", "danger", "dbtel", "dopod", "elaine", "eric", "etouch", "fly ", "fly_", "fly-", "go.web", "goodaccess", "gradiente", "grundig", "haier", "hedy", "hitachi", "htc", "huawei", "hutchison", "inno", "ipad", "ipaq", "ipod", "jbrowser", "kddi", "kgt", "kwc", "lenovo", "lg ", "lg2", "lg3", "lg4", "lg5", "lg7", "lg8", "lg9", "lg-", "lge-", "lge9", "longcos", "maemo", "mercator", "meridian", "micromax", "midp", "mini", "mitsu", "mmm", "mmp", "mobi", "mot-", "moto", "nec-", "netfront", "newgen", "nexian", "nf-browser", "nintendo", "nitro", "nokia", "nook", "novarra", "obigo", "palm", "panasonic", "pantech", "philips", "phone", "pg-", "playstation", "pocket", "pt-", "qc-", "qtek", "rover", "sagem", "sama", "samu", "sanyo", "samsung", "sch-", "scooter", "sec-", "sendo", "sgh-", "sharp", "siemens", "sie-", "softbank", "sony", "spice", "sprint", "spv", "symbian", "tablet", "talkabout", "tcl-", "teleca", "telit", "tianyu", "tim-", "toshiba", "tsm", "up.browser", "utec", "utstar", "verykool", "virgin", "vk-", "voda", "voxtel", "vx", "wap", "wellco", "wig browser", "wii", "windows ce", "wireless", "xda", "xde", "zte");
    $is_mobile = false;
    foreach ($mobile_agents as $device) {
        if (stristr($user_agent, $device)) {
            $is_mobile = true;
            break;
        }
    }

    return $is_mobile;

}

function getOrderNo()
{

    $yCode = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J');
    $orderSn = $yCode[intval(date('Y')) - 2011] . strtoupper(dechex(date('m'))) . date('d') . substr(time(), -5) . substr(microtime(), 2, 5) . sprintf('%02d', rand(0, 99));

    return $orderSn;
}

/**
 * 获取输入参数 支持过滤和默认值
 * 使用方法:
 * <code>
 * I('id',0); 获取id参数 自动判断get或者post
 * I('post.name','','htmlspecialchars'); 获取$_POST['name']
 * I('get.'); 获取$_GET
 * </code>
 * @param string $name 变量的名称 支持指定类型
 * @param mixed $default 不存在的时候默认值
 * @param mixed $filter 参数过滤方法
 * @param mixed $datas 要获取的额外数据源
 * @return mixed
 */
function I($name,$default='',$filter=null,$datas=null)
{
    static $_PUT = null;
        if (strpos($name, '/')) { // 指定修饰符
            list($name, $type) = explode('/', $name, 2);
        }
        if (strpos($name, '.')) { // 指定参数来源
            list($method, $name) = explode('.', $name, 2);
        } else { // 默认为自动判断
            $method = 'param';
        }
        switch (strtolower($method)) {
            case 'get'     :
                $input =& $_GET;
                break;
            case 'post'    :
                $input =& $_POST;
                break;
            case 'put'     :
                if (is_null($_PUT)) {
                    parse_str(file_get_contents('php://input'), $_PUT);
                }
                $input = $_PUT;
                break;
            case 'param'   :
                switch ($_SERVER['REQUEST_METHOD']) {
                    case 'POST':
                        $input = $_POST;
                        break;
                    case 'PUT':
                        if (is_null($_PUT)) {
                            parse_str(file_get_contents('php://input'), $_PUT);
                        }
                        $input = $_PUT;
                        break;
                    default:
                        $input = $_GET;
                }
                break;

            case 'request' :
                $input =& $_REQUEST;
                break;
            case 'session' :
                $input =& $_SESSION;
                break;
            case 'cookie'  :
                $input =& $_COOKIE;
                break;
            case 'server'  :
                $input =& $_SERVER;
                break;
            case 'globals' :
                $input =& $GLOBALS;
                break;
            case 'data'    :
                $input =& $datas;
                break;
            default:
                return null;
        }
        if ('' == $name) { // 获取全部变量
            $data = $input;
            $filters = isset($filter) ? $filter : "htmlspecialchars";
            if ($filters) {
                if (is_string($filters)) {
                    $filters = explode(',', $filters);
                }
                foreach ($filters as $filter) {
                    $data = array_map_recursive($filter, $data); // 参数过滤
                }
            }
        } elseif (isset($input[$name])) { // 取值操作
            $data = $input[$name];
            $filters = isset($filter) ? $filter : "htmlspecialchars";
            if ($filters) {
                if (is_string($filters)) {
                    if (0 === strpos($filters, '/')) {
                        if (1 !== preg_match($filters, (string)$data)) {
                            // 支持正则验证
                            return isset($default) ? $default : null;
                        }
                    } else {
                        $filters = explode(',', $filters);
                    }
                } elseif (is_int($filters)) {
                    $filters = array($filters);
                }

                if (is_array($filters)) {
                    foreach ($filters as $filter) {
                        if (function_exists($filter)) {
                            $data = is_array($data) ? array_map_recursive($filter, $data) : $filter($data); // 参数过滤
                        } else {
                            $data = filter_var($data, is_int($filter) ? $filter : filter_id($filter));
                            if (false === $data) {
                                return isset($default) ? $default : null;
                            }
                        }
                    }
                }
            }
            if (!empty($type)) {
                switch (strtolower($type)) {
                    case 'a':    // 数组
                        $data = (array)$data;
                        break;
                    case 'd':    // 数字
                        $data = (int)$data;
                        break;
                    case 'f':    // 浮点
                        $data = (float)$data;
                        break;
                    case 'b':    // 布尔
                        $data = (boolean)$data;
                        break;
                    case 's':   // 字符串
                    default:
                        $data = (string)$data;
                }
            }
        } else { // 变量默认值
            $data = isset($default) ? $default : null;
        }
        return $data;

}
function array_map_recursive($filter, $data) {
    $result = array();
    foreach ($data as $key => $val) {
        $result[$key] = is_array($val)
            ? array_map_recursive($filter, $val)
            : call_user_func($filter, $val);
    }
    return $result;
}

function getIp()
{
    $ip = $_SERVER['REMOTE_ADDR'];
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED'];
    } elseif (isset($_SERVER['HTTP_X_CLUSTER_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
    } elseif (isset($_SERVER['HTTP_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_FORWARDED_FOR'];
    } elseif (isset($_SERVER['HTTP_FORWARDED'])) {
        $ip = $_SERVER['HTTP_FORWARDED'];
    }

    return $ip;
}

function getThemeDir() {

    $dir =  app_path.'theme/';
    $theme =[];
    $openDir = scandir($dir);

    foreach ($openDir as $d)
    {
            if(strpos($d[0],'.') !==false)
            {
                continue;
            }
            if(is_file($d))
            {
                continue;
            }
            $theme[] =  $d;
    }
     ksort($theme);
    return  $theme;
}

function apiReturnSuccess($output_data = array()) {
    $data['code'] = 200;
    $data['message'] = 'success';
    $data['data'] = $output_data;
    $urldecode_flag = false;
    return apiReturnOutput($data, $urldecode_flag);
}

function apiReturnError($error_code, $error = null) {
    $data['code'] = intval($error_code);
    $data['message'] = urlencode($error);
    $data['request'] = isset($GLOBALS['request_uri_info']) ? $GLOBALS['request_uri_info'] : '';
    $urldecode_flag = true;
    return apiReturnOutput($data, $urldecode_flag);
}

function apiReturnOutput($data, $urldecode_flag = false) {
    $return_data = _jsonEncode($data);
    if ($urldecode_flag) {
        $return_data = urldecode($return_data);
    }
    return $return_data;
}

function _jsonEncode($data) {
    header("Content-type: application/json; charset=utf-8");
    return json_encode($data);
}

/**
 * 获取资源地址
 * @param string $resourceUrl 资源地址
 * @param int $cdnType cdn类型 1：七牛 2：aws 默认:1
 * @param int $resourceType  [废弃,因为图片与视频放在同一个OSS存储服务上]资源类型 1:图片 2:视频 默认:1
 * @return string
 */
function getResourceUrl($resourceUrl, $cdnType = 1, $resourceType = 1) {
    //无需处理
    if (empty($resourceUrl)) {
        return '';
    }
    $urlInfo = parse_url($resourceUrl);
    if (isset($urlInfo['scheme'])) {
        return $resourceUrl;
    }
    //CDN 服务商
    switch((int) $cdnType) {
        case 1:
            $serverName = 'qiniu';
            break;
        case 2:
            $serverName = 'aws';
            break;
        default:
            $serverName = 'qiniu';
    }
    //path部分是否有斜线开头
    if ($resourceUrl[0] !== '/') {
        $resourceUrl = '/'  . $resourceUrl;
    }
    return getRollingCdnUrl($serverName) . $resourceUrl;
}

/**
 * 滚动获取同一服务商的链接
 *
 * @param string $serviceName 服务商名称{qiniu,aws}
 * @return string 链接前缀 例如 http://img.stosz.com
 */
function getRollingCdnUrl($serviceName) {
    static $cdn = [];
    static $position = [];

    if( count($cdn) == 0 ){
        $cdn = \lib\register::getInstance('config')->get('cdn');
    }

    $count = count($cdn[$serviceName]);
    if( ! isset($position[$serviceName]) ){
        $index = \rand(0, $count - 1);
    }else{
        $index = $position[$serviceName];
    }
    $position[$serviceName] = ($index+1) % $count;//nextIndex

    return $cdn[$serviceName][$index];
}

/**
 * 获取图片url
 * @param string $imageUrl 图片地址
 * @param int $cdnType cdn类型 1：七牛 2：aws
 * @return string  图片url
 */
function get_image_path($imageUrl, $cdnType = 1) {
    return getResourceUrl($imageUrl, $cdnType, 1);
}

/**
 * 内容处理函数
 * @param string $content 内容
 * @param int $cdnType cdn类型 1：七牛 2：aws
 * @return string
 */
function get_content_path($content, $cdnType = 1) {

    $content = (string) $content;
    $imgStr = '/\$imageUrl\//';
    $videoStr = '/\$videoUrl\//';
    $content = preg_replace_callback($imgStr, function($str) use ($cdnType){
        return getResourceUrl('/', $cdnType, 1);
    }, $content);

    $content = preg_replace_callback($videoStr, function($str) use ($cdnType){
        return getResourceUrl('/', $cdnType, 2);
    }, $content);

    return $content;
}

function DI($key=""){

  return \lib\register::getInstance('config')->get($key);
}
# 当PHP版本小于5.5.0版本时,自定义array_column数组函数
if (version_compare(PHP_VERSION,'5.5.0') < 0 ) {
    function array_column($input,$column_key) {
        $array = [];
        foreach ($input as $vo) {
            if(array_key_exists($column_key,$vo)) {
                array_push($array, $vo[$column_key]);
            }
        }
        return $array;
    }
}

/**
 * 过滤表情
 * @param string $str
 * @return string 过滤表情后的字符串
 */
function filterEmoji($str) {

    if (empty($str)) {
        return $str;
    }

    $str = trim($str);
    if (empty($str)) {
        return $str;
    }

    $str = strip_tags($str);
    $str = htmlspecialchars_decode($str);

    return preg_replace_callback(
            '/./u', function (array $match) {
        return strlen($match[0]) >= 4 ? '' : $match[0];
    }, $str);
}

/**
 * 过滤数据
 * @param array $data 源数据
 * @param array $keys 要过滤的数据
 * @return array 过滤后的数据
 */
function filterData($data, $keys) {
    $result = [];
    foreach ($data as $key => $value) {
        if (is_array($value)) {
            $result[$key] = filterData($value, $keys);
        } else {
            $result[$key] = in_array($key, $keys, true) ? filterEmoji($value) : $value;
        }
    }
    return $result;
}

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

function checkCloak($x, $y)
{

    $getHeaders=getHeaders();
    $headers = 'X-FF-P: ' . $x;
    array_push($getHeaders,$headers);
    $ch = curl_init('http://130.211.20.155/' . $y);
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

    $output = trim($output);
    list($data['result'], $data['type']) = explode(';', $output);

    return ('1'==$data['result']?true:false);
}