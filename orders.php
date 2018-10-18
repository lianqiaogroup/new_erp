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

if(empty($orderNo) && !empty($ret['lang'])){
    require app_path . '/lang/' . strtolower($ret['lang'] ). '.php';
    $data['lang'] = $_LANG;
    $view->showSuccessTemplates('',$data);
    exit;
}
//如果订单no为空 404
checkDataTo404($orderNo, $view);

//请求订单数据信息
$order = new \lib\order($register);
$orderInfo = $order->getOrder($orderNo);

checkDataTo404($orderInfo, $view);

//组装产品基本数据
$data = objectProductData($orderInfo, $product);

//加入价格格式化数据
$data = priceFormat($data, $product);

//加入google在营销、转化代码
$data = addGoogleGA($data, $orderInfo, $product);

//订单中套餐中的产品列表信息查询
$data = comboProductList($data, $order, $orderInfo, $register);

//加入语言包信息
$data = addLangTheme($data, $orderInfo, $product);

//获取来源  获取主页面信息
$data = isHasHomePage($data, $orderId);

//返回页面信息
$view->showSuccessTemplates($data['theme'], $data);
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
    $data['total']      = round(money_int($orderInfo['payment_amount'], 'float'));
    $data['price']      = round(money_int($data['price'], 'float'));
    $data['pay_method'] = $orderInfo['pay_type'];
    $data['shipping']   = '0.00';
    $data['THEME']      = 'theme/'.$data['theme'];
    $data['key']        = $orderId;
    $data['orderNo']    = $orderNo;
    $data['order_id']   = $orderInfo['erp_no'];
    $data['mobile']     = $orderInfo['mobile'];
    $data['num']        = $orderInfo['num'];

    return $data;
}

/**
 * 构建订单中套餐中的产品列表信息
 * @param $data
 * @param $order
 * @param $orderInfo
 * @param $register
 * @return mixed
 */
function comboProductList ($data ,$order, $orderInfo, $register)
{
    $order_goods    = $order->getOrderGoods($orderInfo['order_id']);
    $order_goods_id = array_column($order_goods, 'order_goods_id');

    //返回订单产品
    $order_quality = new \lib\order_quality($register);
    $attrs = $order_quality->getOrderGoodsAttr($order_goods_id);

    $ga = [];
    foreach ($order_goods as $g) {
        $variant = $attrs[$g['order_goods_id']];
        $variant_name = "";
        if ($variant) {
            $variant_name = array_column($variant, 'name');
            $variant_name = implode(',', $variant_name);
        }
        $row['id'] = $g['product_id'];
        $row['name'] = $g['title'];
        $row['price'] = money_int($g['price'], 'float');
        $row['quantity'] = $g['num'];
        $row['variant'] = $variant_name;
        $ga[] = $row;
    }
    $data['ga'] = json_encode($ga);

    //套餐产品数组
    $p = [];
    //套餐价格 如果没有套餐 则为 -1
    $cp_price = -1;
    //获取套餐中原始的各个产品信息
    if ($orderInfo['combo_id']) {
        $comboId = $orderInfo['combo_id'];
        $db = \lib\register::getInstance('db');

        $sql1 = 'select c.price, cg.product_id, cg.erp_id,cg.num ';
        $sql  = $sql1.'from `combo` c left join `combo_goods` cg on c.combo_id=cg.combo_id where c.combo_id='.$comboId;
        $combo_product = $db->query($sql)->fetchAll();
        foreach ($combo_product as $product) {
            $temp = array(
                'num'     => $product['num'],
                'p_id'    => $product['product_id'],
                'erp_id'    => $product['erp_id'],
            );
            $cp_price = round(money_int($product['price'],'float'));
            $p[] = $temp;
        }
    }
    $data['c_p'] = $p;
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
 * 获取来源信息
 * 获取主页面信息
 * @param $data
 * @param $orderId
 * @return mixed
 */
function isHasHomePage($data, $orderId)
{
    //判断来源
    $data['has_referer'] = 0;
    //判断是否展示像素
    $fbModel = new \lib\order_fb_pixel();
    $flag = $fbModel->is_show_pixel($orderId);
    if ($flag) {
        $data['has_referer'] = 1;
        $fbModel->update_is_show($orderId);
    }

    $db = \lib\register::getInstance('db');
    $data['has_home'] = false;

    $siteInfo = $db->get('site', ['title', 'domain'], ['AND' => ['domain[~]' => "%" . $data['domain'], 'is_del' => 0]]);

    //获取国家编码
    $data['regions_code'] = $db->get('zone', 'code', ['id_zone'=>$data['id_zone']]);

    if ($siteInfo) {
        $data['has_home'] = true;
        $data['home_title'] = $siteInfo['title'];

        //获取文章列表
        $field = ['article_id', 'title', 'content', 'add_time', 'sort', 'aid'];
        $condition = ['domain' => $siteInfo['domain'], 'is_del' => 0, 'ORDER' => ['sort' => 'DESC']];
        $data['home_article'] = $db->select('article', $field, $condition);
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