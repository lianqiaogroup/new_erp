<?php
// +----------------------------------------------------------------------
// |[ 订单信息查看控制器 ]
// +----------------------------------------------------------------------
// +----------------------------------------------------------------------
// | Team:   Cuckoo
// +----------------------------------------------------------------------
// | Date:   2018/02/07 16:34
// +----------------------------------------------------------------------


require_once 'lib/ini.php';

$orderNo = I("get.no");
$orderId = I('get.key');

//订单为空加载语言包
if(empty($orderNo) && !empty($ret['lang'])){
    require app_path . '/lang/' . strtolower($ret['lang'] ). '.php';
    $data['lang'] = $_LANG;
    $view->showSuccessTemplates('',$data);
    exit;
}   

//如果订单no为空 404
checkDataTo404($orderNo, $view);

$order = new \lib\order($register);
$orderInfo = $order->getOrder($orderNo) ;
//如果订单no为空 404
checkDataTo404($orderInfo, $view);

//组装产品基本数据
$data = objectProductData($orderInfo, $product);

//加入价格格式化数据
$data = priceFormat($data, $product);

//加入google在营销、转化代码
$data = addGoogleGA($data, $orderInfo, $product);

//订单中套餐中的产品列表信息查询
$data = comboProductList($data, $orderInfo);

//加入语言包信息
$data = addLangTheme($data, $orderInfo, $product);

$data['has_referer'] =0;

$view->showSuccessTemplates($data['theme'],$data);
$view->embedStatScript(4, $data);


/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                                      方法
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 检查数据是否为空
 * 如果为空返回404页面
 * @param $data
 * @param $response
 */
function checkDataTo404($data, $response)
{
    if (empty($data)) {
        $response->show_404();
        exit;
    }
}


/**
 * 构建基本产品数据
 * @param $orderInfo
 * @param $product
 * @return mixed
 */
function objectProductData($orderInfo, $product)
{
    //产品ID
    $productId = $orderInfo['product_id'];
    //订单ID
    $orderId   = $orderInfo['order_id'];
    //订单NO
    $orderNo   = $orderInfo['order_no'];

    $data = $product->getProductId('', $productId);

    $data['orderid']    = $orderInfo['order_no'];
    $data['total']      = round(money_int($orderInfo['payment_amount'],'float'));
    $data['price']      = round(money_int($data['price'],'float'));
    $data['pay_method'] = $orderInfo['pay_type'];
    $data['shipping']   = '0.00';
    $data['THEME']      = 'theme/' . $data['theme'];
    $data['key']        = $orderId;
    $data['orderNo']    = $orderNo;
    $data['num']        = $orderInfo['num'];

    return $data;
}


/**
 * 构建订单中套餐中的产品列表信息
 * @param $data
 * @param $orderInfo
 * @return mixed
 */
function comboProductList ($data , $orderInfo)
{
    //套餐产品数组
    $p = [];
    //套餐价格 如果没有套餐 则为 -1
    $cp_price = -1;
    $db = \lib\register::getInstance('db');

    //获取套餐中原始的各个产品信息
    if ($orderInfo['combo_id']) {
        $comboId = $orderInfo['combo_id'];
        $sql1 = 'select c.price, cg.product_id, cg.erp_id, cg.num ';
        $sql  = $sql1.'from `combo` c left join `combo_goods` cg on c.combo_id=cg.combo_id where c.combo_id='.$comboId;
        $combo_product = $db->query($sql)->fetchAll();
        foreach ($combo_product as $product) {
            $temp = array(
                'num'     => $product['num'],
                'erp_id'    => $product['erp_id'],
                'p_id'    => $product['product_id']
            );
            $cp_price = round(money_int($product['price'],'float'));
            $p[] = $temp;
        }
    }

    //获取国家编码
    $data['c_p'] = $p;
    $data['regions_code'] = $db->get('zone', 'code', ['id_zone'=>$data['id_zone']]);
    $data['c_p_price'] = $cp_price;

    return $data;
}


/**
 * 如果设置了价格格式化
 * 加入价格格式化数据
 * @param $data
 * @param $product
 * @return mixed
 */
function priceFormat($data, $product)
{
    $format = $data['new_price_format'];

    if (empty($format)) {
        $data['new_price_format']['total_format'] = $data['total'];
    } else {
        $total_format = $product->formatPrice($format['num_len'], $format['symbol'], $data['total']);
        $data['new_price_format']['total_format'] = $total_format;
    }

    return $data;
}

/**
 * 加入google在营销、转化代码
 * @param $data
 * @param $orderInfo
 * @param $product
 * @return mixed
 */
function addGoogleGA($data, $orderInfo, $product)
{
    $productId = $orderInfo['product_id'];
    $ga_etc = $product->getProductGoogleExt($productId);

    if (!empty($ga_etc)) {
        $ga_etc['google_conversion_value'] = round($data['total'] * $data['exchange_rate'], 3);
    }
    $data['google_etc'] = $ga_etc;

    if ($_SERVER['HTTP_REFERER'] == NULL) {
        $data['google_js_st'] = 1;
    } else {
        if (isset($_COOKIE["google_js_st"])) {
            $data['google_js_st'] = 1;
        } else {
            setcookie('google_js_st', '1', time() + 3600 * 24 * 30 * 12);
            $data['google_js_st'] = 0;
        }
    }

    return $data;
}



/**
 * 加入语言包和模板数据
 * @param $data
 * @param $orderInfo
 * @param $product
 * @return mixed
 */
function addLangTheme($data, $orderInfo, $product)
{
    $theme = $product->getProductTheme($orderInfo['product_id']);
    $lang = strtolower($theme['lang']);

    $lang = new \lib\lang($lang, $theme['theme']);
        $data['lang'] = $lang->getLang('', '', $data['id_zone']);
    $data['lang']['buy_know'] = sprintf($data['lang']['buy_know'], $data['service_email'], $data['service_email']);
    return $data;
}