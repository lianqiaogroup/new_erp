<?php

namespace lib\cache;


use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Exception\AMQPProtocolChannelException;
use PhpAmqpLib\Message\AMQPMessage;

class Rabbitmq  {

    #对象实例
    private $instance ;

    #队列通道
    private $channel;


    #配置文件
    private $config = [
        'host' => '127.0.0.1',
        'port' => 5672,
        'login' => '',
        'password' => '',
        'vhost'=>'/'
    ];


    public function __construct($config = [])
    {
        if($config)
            $this->config = array_merge($this->config,$config);

        //ZhuangDeBiao: 不要在构造函数内return
        $this->reconnect();
    }

    public function reconnect() {
        try{
            $this->instance = new AMQPStreamConnection(
                $this->config['host'],
                $this->config['port'],
                $this->config['login'],
                $this->config['password'],
                $this->config['vhost']
            );
            $this->channel = $this->instance->channel();
        }catch (\AMQPConnectionException $ex){
            return ['retcode'=> $ex->getCode(),'message'=>$ex->getMessage()];
            //die($ex->getCode() .':'.$ex->getMessage());
        }catch (\Exception $ex){
            return ['retcode'=> $ex->getCode(),'message'=>$ex->getMessage()];
            //die($ex->getCode().':'.$ex->getMessage());
        }
    }

    public function Send($queue,$message,$routeKey,$exchange = ''){
        try{
            //服务IP：ip-172-31-46-254,
            //错误信息：[02-Jul-2018 23:28:26 Asia/Shanghai] PHP Fatal error:
            //  Call to a member function exchange_declare() on null
            // in /home/cuckoo/www/webserver/lib/cache/Rabbitmq.php on line 55
            if( is_null($this->channel) ) {
                $ret = $this->reconnect();
                if(is_null($this->channel)){
                    trigger_error('RabbitMQ Channel reconnect fail', E_USER_ERROR);
                    return $ret;
                }
            }

            if($exchange) {
                $this->channel->exchange_declare($exchange, 'direct', false, true, false);
                $this->channel->queue_bind($queue, $exchange, $routeKey);

            }else{
                $this->channel->queue_declare($queue,false,true,false,false);
            }
            $this->channel->basic_publish((new AMQPMessage($message)),$exchange,$routeKey);

        }catch (AMQPProtocolChannelException $ex){
            return ['retcode'=> 500,'message'=>$ex->getMessage()];
        }
    }

    public function __destruct()
    {
        $this->channel->close();
        $this->instance->close();
        // TODO: Implement __destruct() method.
    }
}