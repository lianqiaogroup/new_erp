<?php

/**
 * 大汉三通短信
 * @package lib\sms
 * @author cenyongjian <cenyongjian@stosz.com>
 * @version 1.0
 * @link 大汉三通短信云接口手册V1.5.18.docx
 * @copyright (c) 2018-06-21, cuckoo
 */

namespace lib\sms;

class SmsDaHan extends ISmsMessage {

    //发送短信url
    public static $uri = 'http://www.dh3t.com/json/sms';
    //apiKey
    public static $account;
    public static $password;

    public function __construct() {
        self::$account = DI('SMS.DaHanSanTong.ACCOUNTID');
        self::$password = DI('SMS.DaHanSanTong.PASSWORD');
    }

    /**
     * 大陆手机直接输入手机号  台湾香港需要加区号 格式： +856
     * @param string $from  发送短信手机号码  目前没有使用
     * @param string $to  接收短信手机号码
     * @param string $tpl 短信模板
     * @param string $encoding 编码方式
     * @return array
     */
    public function Sender($from, $to, $tpl = '', $encoding = '') {

        if ($tpl) {
            $content = parent::formarMsg($tpl);
        } else {
            $content = parent::createMsg();
        }

        $matches = [];
        $pattern = '/.*(\{[^\{].*[^\}]\}|【.*】|\[.*\]).*/ixU';
        preg_match($pattern, $content, $matches);
        $sign = $matches ? $matches[1] : (strpos($content, 'العملاء المحترمون:') !== false ? '[التسوق في الخارج]' : '【海淘购】'); //短信签名，该签名需要提前报备，生效后方可使用，不可修改，必填，示例如：【大汉三通】
        //短信内容，最多350个汉字，必填,内容中不要出现【】[]这两种方括号，该字符为签名专用
        $replaceData = [];
        if (!empty($sign)) {
            $replaceData[$sign] = '';
        }
        $replaceData = array_merge($replaceData, [
            '[' => '(',
            ']' => ')',
            '【' => '(',
            '】' => ')',
        ]);
        $content = strtr($content, $replaceData);

        $replaceData = [
            '{' => '[',
            '}' => ']',
        ];
        $sign = strtr($sign, $replaceData);

        $data = json_encode([
            'account' => self::$account, //用户账号
            'password' => strtolower(md5(self::$password)), //账号密码，需采用MD5加密(32位小写) ，调用大汉三通提供jar包的话使用明文
            'msgid' => md5(uniqid(rand(), true)), //该批短信编号(32位UUID)，需保证唯一，选填
            'phones' => $to, //接收手机号码，多个手机号码用英文逗号分隔，最多500个，必填，国际号码格式为+国别号手机号，示例如：+85255441234
            'content' => $content, //短信内容，最多350个汉字，必填,内容中不要出现【】[]这两种方括号，该字符为签名专用
            'sign' => $sign, //短信签名，该签名需要提前报备，生效后方可使用，不可修改，必填，示例如：【大汉三通】
            'sendtime' => date('YmdHi'),
        ]);
        $ret = \lib\sms\ISmsMessage::sendPost(self::$uri . "/Submit", $data, ['Content-Type: application/json; charset=utf-8', 'Content-Length: ' . strlen($data)]);

        if (!$ret['status']) {
            return ['ret_result' => 0, 'ret_msg' => $ret['message'], 'data' => ['code' => parent::$msg_code, 'text' => $sign . $content]];
        }

        $return = json_decode($ret['message'], true);
        //发送失败
        if ($return['result'] != 0) {
            return ['ret_result' => 0, 'ret_msg' => $return['desc'], 'data' => ['code' => parent::$msg_code, 'text' => $sign . $content]];
        }

        //发送成功
        return ['ret_result' => 1, 'ret_msg' => "OK", 'data' => ['code' => parent::$msg_code, 'text' => $sign . $content]];
    }

    public function CheckMobileFormat($mobile) {

        return true;
    }

}
