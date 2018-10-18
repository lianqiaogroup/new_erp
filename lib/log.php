<?php

namespace lib;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Exception;

class log extends Logger {

    public $path = '/log/';
    public $fileName;
    public $handler;
    public $website;

    public function __construct() {
        $this->website = $_SERVER['HTTP_HOST'];
        $this->fileName = date('Y-m-d') . '.LOG';
        parent::__construct($this->website);

        $this->pushHandler($this->getHandler());
    }

    /**
     * 兼容现有代码
     * @param type $sub
     * @param type $message
     * @return boolean
     */
    public function write($tag, $message = '') {

        if (empty($message)) {
            $message = $tag;
        } else {
            $message = $tag . ':' . $message;
        }

        $rs = true;
        try {
            // add records to the log
            $rs = $this->info($message);
        } catch (Exception $e) {
//            $content = date('Y-m-d H:i:s') . PHP_EOL . __METHOD__ . ': 写入日志失败  ' . $e->getFile() . PHP_EOL . $e->getLine() . PHP_EOL . $e->getMessage() . PHP_EOL;
//            var_dump($content);
            $rs = false;
        }

        return $rs;
    }

    public function getHandler() {
        $this->handler = new StreamHandler(app_path . $this->path . $this->fileName, Logger::INFO);

        return $this->handler;
    }

}
