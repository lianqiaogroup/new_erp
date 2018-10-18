<?php
namespace lib;
class moneyBrace
{
    private $account = '800611';
    private $public_key = "a1GWnLwKurfw6K4WcZgZR4h0yRczJTXD8R0EOeYNgmeE8rRawpeKjUQfTPyEI5bJDLxoTzi6aCTE0M0hacdtPmtnaVU8PuejkDax3Cq5hgJQblnhXrDG1R2qrjo6OiqO
";
    private $postUrl = 'https://payment.onlinecreditpay1.com/Payment4/Payment.aspx';

    public function index($lang)
    {
        $_LANG = [];
        if (is_file(app_path . 'lib/ocean/lang/' . $lang . '.php')) {
            require app_path . 'lib/ocean/lang/' . $lang . '.php';
        }
        return $this->load->view->render('/lib/moneybrace/order_submit.twig', $_LANG);

    }

    //pay
    public function pay($info){

        $order_type = 4;
        $gw_version = trim ( "php(Z5.6)" ); // 接口版本
        $language = $this->getLanguage (); // 接口语言
        $strValue = $this->public_key . $this->account . $info['merchOrderNo'] . $info['currency'] . $info['amount'];
        $signature = md5 ( $this->filter_code ( $strValue ) );

        $data['merchant_id'] = $this->account;
        $data['order_type'] =$order_type;
        $data['language'] = $language;
        $data['gw_version'] = $gw_version;
        $data['merch_order_ori_id'] = $info['merchOrderNo'];
        $data['merch_order_date'] = $info['add_time'];
        $data['merch_order_id'] = $info['merchOrderNo'];;
        $data['price_currency'] = $info['currency'];;
        $data['price_amount'] = $info['amount'];
        $data['url_sync'] = getHttpHost(false, true).'/response/moneyBrace';
        $data['url_succ_back'] =  getHttpHost(false, true).'/response/moneyBrace';
        $data['url_fail_back'] = getHttpHost(false, true).'/response/moneyBrace';
        $data['order_remark'] = '';
        $data['signature'] = $signature;
        $data['ip'] = $info['ip'];
        $data['bill_address'] = $info['address'];
        $data['bill_country'] = $info['country'];
        $data['bill_province'] = $info['province'];
        $data['bill_city'] = $info['city'];
        $data['bill_email'] = $info['email'];
        $data['bill_phone'] = $info['tel'];
        $data['bill_post'] = $info['postal'];
        $data['delivery_name'] = $info['first_name'];
        $data['delivery_country'] =  $info['country'];
        $data['delivery_province'] = $info['province'];
        $data['delivery_city'] =$info['city'];
        $data['delivery_email'] = $info['email'];
        $data['delivery_phone'] = $info['tel'];
        $data['delivery_post'] =  $info['postal'];
        $data['hash_num'] = $info['card_number'];
        $data['hash_sign'] = $info['card_cvv'];
        $data['card_exp_year'] = $info['card_year'];
        $data['card_exp_month'] = $info['card_month'];
        $data['product_name'] = $info['title'];
        $data['product_sn'] = $info['sku'];
        $data['quantity'] = $info['number'];
        $data['unit'] = round($info['amount']/$info['number'],2);
        $data['client_finger_cybs'] = $language;
        $post = vpost($this->postUrl,$data);
        $log = new \lib\log();
        $log->write('moneyBrace','发送==》'.json_encode($data,true)) ;
        $return = $post['return'];
        $this->response($return);

    }

    public function response($load,$data){
        $log = new \lib\log();
        $log->write('moneyBrace','返回==》'.$data) ;
        $xml = simplexml_load_string($data);
        $merchant_id =(string)$xml->merchant_id;
        $merch_order_id = (string)$xml->merch_order_id; // 带有前缀的商户订单号
        $merch_order_ori_id =(string)$xml->merch_order_ori_id;
        $order_id = (string)$xml->order_id;
        $price_currency =(string)$xml->price_currency;
        $price_amount =(string)$xml->price_amount;
        $status = (string)$xml->status; // 真实商户订单号
        $message = (string)$xml->message;
        $signature =(string)$xml->signature;
        $allow1 = (string)$xml->allow1;

        $request_method = strtolower($_SERVER['REQUEST_METHOD']);
        $response_type = $request_method == "post" ? 1:0;
        //判断是否支付成功
        $order = new \lib\order($load);
        $orderFind = $order->getOrder($merch_order_id,1);
        $data['merchOrderNo'] = $merch_order_id;
        $data['orderNo'] = $orderFind['order_no'];
        $data['order_id'] = $orderFind['order_id'] ;
        $data['product_id'] = $orderFind['product_id'];
        $data['response_type'] = $response_type;
        $data['success'] = 0;
        if ($orderFind['order_status'] == 'SUCCESS' && $orderFind['erp_status'] == 'SUCCESS') {
            $data['success'] = 1;
            return ['ret'=>1,'data'=>$data];
        }

        if($status !='Y')
        {
            return ['ret'=>0,'msg'=>$message];
        }

        return ['ret'=>1,'data'=>$data];

    }

    // 获取浏览器的语言
    public function getLanguage() {
        $lang = substr ( $_SERVER ['HTTP_ACCEPT_LANGUAGE'], 0, 4 );
        $language = '';
        if (preg_match ( "/en/i", $lang ))
            $language = 'en-us'; // 英文
        elseif (preg_match ( "/fr/i", $lang ))
            $language = 'fr-fr'; // 法语
        elseif (preg_match ( "/de/i", $lang ))
            $language = 'de-de'; // 德语
        elseif (preg_match ( "/ja/i", $lang ))
            $language = 'ja-jp'; // 日语
        elseif (preg_match ( "/ko/i", $lang ))
            $language = 'ko-kr'; // 韩语
        elseif (preg_match ( "/es/i", $lang ))
            $language = 'es-es'; // 西班牙语
        elseif (preg_match ( "/ru/i", $lang ))
            $language = 'ru-ru'; // 俄罗斯
        elseif (preg_match ( "/it/i", $lang ))
            $language = 'it-it'; // 意大利语
        else
            $language = 'en-us'; // 英文
        return $language;
    }

    // 过滤ASCII码32-127位之外的订单字符串
    public function filter_code($str) {
        if ($str == null || $str == "") {
            return "";
        } else {
            $str = str_split ( $str );
            for($ii = 0; $ii < count ( $str ); $ii ++) {
                if (ord ( $str [$ii] ) < 32 || ord ( $str [$ii] ) > 127) {
                    $str [$ii] = '';
                }
            }
        }
        $str = implode ( '', $str );
        return $str;
    }
}