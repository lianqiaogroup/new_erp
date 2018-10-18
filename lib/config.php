<?php

/**
 * Created by PhpStorm.
 * User: jimmy
 * Date: 2018/2/27
 * Time: 15:03
 */

namespace lib;

class config {

    public $config;

    public function __construct() {
        $configFile = app_path . 'config/web.php';
        $configFileDev = app_path . 'config/dev.php';
        if (file_exists($configFile)) {
            $config = require_once $configFile;
            if ($config['environment'] == 'office') {
                $config = require_once $configFileDev;
            }
        } else {
            $config = require_once $configFileDev;
        }

        $this->config = $config;
    }

    /**
     * 获取配置数据 支持 a.b.c获取单个配置
     * @param string|array $key 默认:''表示获取所有配置数据 如：'a'表示获取key是a的配置数据; array('a'=>1)表示设置/更新 配置数据
     * @param mix $default 默认:''
     * @return mix 配置数据
     */
    public function get($key = "", $default = '') {

        if (is_array($key)) {
            $this->config = array_merge($this->config, $key);
            return $this->config;
        }

        $config = $this->config;
        if (empty($key)) {
            return $config;
        }

        if (false === strpos($key, '.')) {
            return isset($config[$key]) ? $config[$key] : $default;
        }

        $keys = explode('.', $key);
        foreach ($keys as $value) {

            if (!isset($config[$value])) {
                return $default;
            }

            $config = $config[$value];
        }

        return $config;
    }

}
