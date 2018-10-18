<?php

namespace lib;

use lib\sms\yunPian as yunPian;
use \lib\register as register;

class db
{
    public $db;
    public $config = [];
    public $error;

    public function __construct()
    {
        $this->config = DI();
    }

    /*获取对应DB库*/
    public function getDBInstance($config, $key)
    {
        try {
            $this->db = \Medoo\Medoo::createInstance($config, $key);
        } catch (\exception $e) {
            $this->error = $e->getMessage();
            $this->smsAlert();
        }
    }

    /*短信报警*/
    public function smsAlert()
    {
        if ($this->config['SMS_ALERT'] == 1 && count($this->config['SMS_USERS']) > 0 && is_array($this->config['SMS_USERS']) && environment == 'idc') {

            $sms = new yunPian();
            foreach ($this->config['SMS_USERS'] as $user) {

                $sms->Sender('', $user, "【单品站警报】单品站(IP:{$_SERVER['SERVER_ADDR']})DB数据库出现崩溃，请马上处理！");
            }
        }
        $loger = new log();
        $loger->error($this->error);
        exit("DB Run Away");
    }

    public function __call($name, $arguments)
    {
        if ($name == 'get' || $name == 'select' || $name == 'count') {
            $this->getDBInstance($this->config['db_read'], 'db_read');
        } else if ($name == 'query' && count($arguments) > 0) {
            $pos = strpos(strtolower($arguments[0]), "select");
            if ($pos === false) {
                $this->getDBInstance($this->config['db'], 'db');
            } else {
                $this->getDBInstance($this->config['db_read'], 'db_read');
            }
        } else {
            $this->getDBInstance($this->config['db'], 'db');
        }
        //
        return call_user_func_array([$this->db, $name], $arguments);
    }


    //带分页
    public function pageSelect($table, $column, $where = [], $pageSize)
    {
        $page = I('get.p') ?: 1;
        $pageSize = $pageSize ?: 20;
        $start = ($page - 1) * $pageSize;

        $map = ['LIMIT' => [$start, $pageSize]];
        $maps = array_merge($where, $map);
        $ret = $this->db->select($table, $column, $maps);
        $count = $this->db->count($table, $column, $where);
        $data['goodsList'] = $ret;
        $data['count'] = $count;
        $data['pageHtml'] = $this->Pagebarht($_GET, $pageSize, $page, $count);

        return $data;
    }

    /**
     * 分页方法
     * @param $url
     * @param $param
     * @param $limit
     * @param $page
     * @param $total
     * @return bool|string
     */
    function Pagebarht($param, $limit, $page, $total)
    {

        if ($total < 0) {
            return false;
        }
        $url = $_SERVER["PHP_SELF"] . '?';
        $link = $url;
        if (is_array($param)) {
            foreach ($param as $str_key => $str_value) {
                if ($str_key == 'p') {
                    continue;
                }

                $link = $link . "$str_key=" . urlencode($str_value) . "&";
            }
        }
        $int_pages = ceil($total / $limit);
        if ($page < 1) {
            $page = 1;
        }
        if ($page > $int_pages) {
            $page = $int_pages;
        }
        $start_url = $link . "p=1";
        $end_url = $link . "p=$int_pages";
        $pre_url = $link . "p=" . ($page - 1);
        $next_url = $link . "p=" . ($page + 1);
        if ($page < 6) {
            $start_page = 1;
            $end_page = 7;
        } else {
            $start_page = $page - 5;
            $end_page = $page + 3;
        }
        if ($end_page > $int_pages) {
            $end_page = $int_pages;
        }
        $urls = null;
        /**
         * THE URL
         */
        for ($i = $start_page, $j = 0; $i <= $end_page; $i++, $j++) {
            $temp_url = $link . "p=$i";
            if ($i == $page) {
                $urls [$j] = "<li class='active'><a>" . $i . "</a></li>";
            } else {
                $urls [$j] = "<li><a href=\"$temp_url\">" . $i . "</a></li>";
            }
        }
        if (is_array($urls)) {
            $str_html = '<ul class="pagination">';
            $str_html .= "<li><a>共" . $total . "条信息</a></li>";
            $str_html .= "<li><a href=\"$start_url\" text=\回第1页\ >首页</a></li>";
            if ($page > 1) {
                $str_html .= "<li><a href=\"$pre_url\" >上页</a></li>";
            } else {
                $str_html .= "<li><a>上页</a></li>";
            }
            foreach ($urls as $sub_url) {
                $str_html .= $sub_url;
            }
            if ($page >= $int_pages) {
                $str_html .= "<li><a>下页</a></li>";
            } else {
                $str_html .= "<li><a href=\"$next_url\">下页</a></li>";
            }
            $str_html .= "<li><a href=\"$end_url\" text=\"到第$int_pages\">尾页</a> </li>";
            $str_html .= "<li><a>共" . $int_pages . "页 </a></li>";
            $str_html .= "</ul>";
            return $str_html;
        }
        return false;
    }

}