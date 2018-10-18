<?php

namespace lib\Exceptions;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Exception;

class Handler {

    public static $path = '/tmp/';
    public static $logger = null;

    public function __construct() {
        
    }

    public static function getLogPath() {
        return self::$path . date('Y-m-d') . '_exception.log';
    }

    public static function getLogger() {

        if (self::$logger) {
            return self::$logger;
        }

        $handler = new StreamHandler(self::getLogPath(), Logger::INFO);
        self::$logger = new Logger($_SERVER['HTTP_HOST'], [$handler]);
        //self::$logger->pushHandler($handler);

        return self::$logger;
    }

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception) {

        $message = $exception->getCode() . ':  ' . $exception->getMessage() . ' in ' . $exception->getFile() . ' on line ' . $exception->getLine() . PHP_EOL . 'Stack trace:' . PHP_EOL . $exception->getTraceAsString() . PHP_EOL;

        error_log($message, $exception->getCode(), $exception->getMessage(), 1);
        //error_log($message);
//        try {
//            // add records to the log
//            self::getLogger()->info($message);
//        } catch (Exception $exception) {
//            $message = date('Y-m-d H:i:s') . PHP_EOL
//                    . $exception->getFile() . PHP_EOL
//                    . $exception->getLine() . PHP_EOL
//                    . $exception->getMessage() . PHP_EOL
//                    . $exception->getTraceAsString() . PHP_EOL . PHP_EOL;
//            @file_put_contents(self::getLogPath(), $message, FILE_APPEND);
//        }

        if (\lib\Util::isAjax()) {
            $data = ['ret_code' => 0, 'ret_msg' => 'exception'];
            \lib\Util::ajaxReturn($data);
        }

        $data = ['lang' => \lib\register::getInstance("lang")->getLang('', '', \lib\register::getInstance("config")->get('id_zone', 0))];
        $data['lang']['msg'] = 'exception';
        \lib\register::getInstance('view')->showPublicErrorTemp($data);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render(Exception $exception) {
        return $exception->getMessage();
    }

    /**
     * Render an exception to the console.
     *
     * @param  \Symfony\Component\Console\Output\OutputInterface  $output
     * @param  \Exception  $e
     * @return void
     */
    public function renderForConsole($output, Exception $e) {
        return $e->getMessage();
    }

}
