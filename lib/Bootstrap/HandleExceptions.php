<?php

namespace lib\Bootstrap;

use Exception;
use ErrorException;

class HandleExceptions {

    public function __construct() {
        
    }

    /**
     * Bootstrap the given application.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $app
     * @return void
     */
    public function bootstrap() {

        // 报告所有 PHP 错误
        //error_reporting(-1);
        // 报告 PHP 错误| 警告| PARSE
        error_reporting(E_ERROR | E_WARNING | E_PARSE);

        set_error_handler([$this, 'handleError']); //设置错误处理者

        set_exception_handler([$this, 'handleException']); //设置异常处理者
        register_shutdown_function([$this, 'handleShutdown']); //设置 PHP shutdown event 处理者
//        ini_set('display_errors', 1); //显示错误
//        if ('testing' != environment) {
//            ini_set('display_errors', 'Off');//不显示错误
//        }
    }

    /**
     * Convert PHP errors to ErrorException instances.
     *
     * @param  int  $level
     * @param  string  $message
     * @param  string  $file
     * @param  int  $line
     * @param  array  $context
     * @return void
     *
     * @throws \ErrorException
     */
    public function handleError($level, $message, $file = '', $line = 0, $context = []) {
        if (error_reporting() & $level) {
            throw new ErrorException($message, 0, $level, $file, $line);
        }
    }

    /**
     * 处理异常
     * Handle an uncaught exception from the application.
     *
     * Note: Most exceptions can be handled via the try / catch block in
     * the HTTP and Console kernels. But, fatal error exceptions must
     * be handled differently since they are not normal exceptions.
     *
     * @param  \Throwable  $e
     * @return void
     */
    public function handleException($e) {
        $this->renderHttpResponse($e);
    }

    /**
     * Render an exception to the console.
     *
     * @param  \Exception  $e
     * @return void
     */
    protected function renderForConsole(Exception $e) {
        $this->getExceptionHandler()->renderForConsole(null, $e);
    }

    /**
     * Render an exception as an HTTP response and send it.
     *
     * @param  \Exception  $e
     * @return void
     */
    protected function renderHttpResponse(Exception $e) {
        $this->getExceptionHandler()->report($e);
    }

    /**
     * Handle the PHP shutdown event.
     *
     * @return void
     */
    public function handleShutdown() {
//        if (!is_null($error = error_get_last()) && $this->isFatal($error['type'])) {
//            $this->handleException();
//        }
    }

    /**
     * 是否是致命异常 Determine if the error type is fatal.
     *
     * @param  int  $type
     * @return bool
     */
    protected function isFatal($type) {
        return in_array($type, [E_COMPILE_ERROR, E_CORE_ERROR, E_ERROR, E_PARSE]);
    }

    /**
     * Get an instance of the exception handler.
     *
     * @return \lib\Exceptions\ExceptionHandler
     */
    protected function getExceptionHandler() {
        return \lib\register::createInstance('\lib\Exceptions\Handler');
    }

}
