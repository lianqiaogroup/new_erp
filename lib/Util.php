<?php

/**
 * 常用工具类
 * User: cenyongjian@stosz.com
 * ver:  1.0
 * Date: 2018/5/25
 * Time: 10:47
 */

namespace lib;

class Util {

    /**
     * 获取有效的域名
     * @param string $domain 域名
     * @return string 有效的域名
     */
    public static function getDomain($domain) {

        if (substr($domain, 0, 4) == 'www.') {
            return $domain;
        }
        return 'www.' . $domain;
    }

    /**
     * debug调试
     * @return array 调试信息
     * 名字         类型    说明
     * function    string  当前的函数名，参见： __FUNCTION__。
     * line        integer 当前的行号。参见： __LINE__。
     * file        string  当前的文件名。参见： __FILE__。
     * class       string  当前 class 的名称。参见 __CLASS__
     * object      object  当前的 object。
     * type        string  当前调用的类型。如果是一个方法，会返回 "->"。如果是一个静态方法，会返回 "::"。 如果是一个函数调用，则返回空。
     * args        array   如果在一个函数里，这会列出函数的参数。 如果是在一个被包含的文件里，会列出包含的文件名。
     */
    public static function debug() {
        return debug_backtrace();
    }

    /**
     * http响应json数据
     * @param array $data 响应数据
     */
    public static function ajaxReturn($data = []) {
        ob_end_clean();
        ob_start();
        echo json_encode($data);
        ob_end_flush();
        exit(0);
    }

    /**
     * http响应json数据
     * @param array $data 响应数据
     */
    public static function isAjax() {

        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            return 1;
        }

        return 0;
    }

}
