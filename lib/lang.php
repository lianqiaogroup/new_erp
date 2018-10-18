<?php

namespace lib;

use lib\register;

class lang
{
    public $theme;
    public $lang;
    private $_db;

    public function __construct($lang, $theme)
    {
        $this->theme = $theme;
        $this->lang = $lang;
        $this->_db = register::getInstance('db');
    }

    public function getLang($lang = '', $theme = '', $productZoneID = '')
    {
        $_LANG = [];
        if ($lang) {
            $this->lang = $lang;
        }
        if ($theme) {
            $this->theme = $theme;
        }
        //引入通用的语言包
        if (file_exists(app_path . '/lang/' . $this->lang . '.php')) {
            require app_path . '/lang/' . $this->lang . '.php';
            // 专门处理台湾澳门地区的特殊
            $rr = $this->dealTwamLanguage($this->lang, $productZoneID);
            if ($rr) {
                require app_path . 'lang/tw_special.php'; 
            }
        }

       

        if (file_exists(app_path . '/theme/' . $this->theme . '/lang/' . $this->lang . '.php')) {
            require app_path . '/theme/' . $this->theme . '/lang/' . $this->lang . '.php';
        }
        if ($this->theme == 'home' && file_exists(app_path . '/public/' . $this->theme . '/lang/' . $this->lang . '.php')) {
            require app_path . '/public/' . $this->theme . '/lang/' . $this->lang . '.php';
        }
        return $_LANG;
    }

    /**
     * [dealTwamLanguage 台湾和澳门两地使用tw。php语言包的时候，加载一些特殊的语句]
     * @param  [type] $lang [description]
     * @return [type]       [description]
     */
    public function dealTwamLanguage($lang, $productZoneID)
    {
        $res = false;
        if (strtolower($lang) == 'tw' && $productZoneID) {
            // 台湾澳门地区提示变化
            
            $zone = new \lib\zone($this->_db);
           
            $s = $zone->getOriginZone($productZoneID);
            if (!$s) {
                die('not found product zone tree!!!');
            } 
            $specialZoneTitle = ['台湾', '澳门'];
            if (in_array($s['title'], $specialZoneTitle)) {
                $res = true;
            } 

        }
        return $res;
        
    }

    public function getHomeLang($lang = '', $theme = '')
    {
        $_LANG = [];
        if ($lang) {
            $this->lang = $lang;
        }
        if ($theme) {
            $this->theme = $theme;
        }

        if (file_exists(app_path . '/home/' . $this->theme . '/lang/' . $this->lang . '.php')) {
            require app_path . '/home/' . $this->theme . '/lang/' . $this->lang . '.php';
        }
        return $_LANG;
    }
}