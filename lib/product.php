<?php

namespace lib;

class product {

    public $domain;
    public $identity_tag;
    public $register;
    public static $cdnType = [];

    public function __construct($register, $serverName) {
        $this->register = $register;
        $this->domain = $serverName;
    }

    /**
     * 设置产品cdn类型
     * @param int $productId  产品id
     * @param int $cdnType 产品cdn类型 默认:null
     * @return boolean 是否设置成功 true:成功  false:失败
     */
    public static function setCdnType($productId, $cdnType = null) {

        if (isset(self::$cdnType[$productId])) {
            return true;
        }

        if ($cdnType !== null) {
            self::$cdnType[$productId] = $cdnType;
            return true;
        }

        $map = ['product_id' => $productId];
        $imgCdnType = register::getInstance('db')->get('product', 'img_cdn_type', $map);
        self::$cdnType[$productId] = empty($imgCdnType) ? 1 : $imgCdnType;

        return true;
    }

    /**
     * 获取产品资源地址
     * @param string $resourceUrl 资源地址
     * @param int $productId  产品id
     * @param int $resourceType 资源类型 1:图片 2:视频 默认:1
     * @param int $cdnType 产品cdn类型 默认:null
     * @return string 产品资源地址
     */
    public static function getResourceUrl($resourceUrl, $productId, $resourceType = 1, $cdnType = null) {
        self::setCdnType($productId, $cdnType);
        return getResourceUrl($resourceUrl, self::$cdnType[$productId], $resourceType);
    }

    public function getProduct_info($domain, $product_id) {
        //匹配数据，
        if ($product_id) {
            $map = ['AND' => ['product_id' => $product_id, 'is_del' => [0, 10]]];
        } else {
            $map = ['AND' => ['domain' => $domain, 'identity_tag' => $this->identity_tag, 'is_del' => [0, 10]]];
        }

        $product = $this->register->get('db')->get('product', '*', $map);

        if (!$product) {
            $this->register->get('view')->show_404();
            exit;
        }

        //获取地址
        $region = new \lib\region($this->register);
        $regions = $region->getRegion($product['id_zone']);
        $product['regions'] = $regions;

        self::setCdnType($product['product_id'], $product['img_cdn_type']);

        return $product;
    }

    /**
     * 获取产品所有信息
     * @param int $product_id
     * @return mixed
     */
    public function getProduct($product_id = 0) {

        $domain = Util::getDomain($this->domain);

        $cloak = new \lib\cloak($this->register);
        $ip = $cloak->get_ip(); //获取用户ip
        $ip = empty(strpos($ip, ',')) ? $ip : strstr($ip, ',', true);

        //同一IP访问的敏感数据进行缓存   有个问题当后台改变关联状态时 需要等缓存失效才能生效
        $redisKey = $ip . $domain . $this->identity_tag;
        $product = \lib\register::getInstance('cache')->get($redisKey);
        $reds = '';
        if ($product) {
            $reds = $redisKey;
            $product = json_decode($product, true);
        } else {
            if (isset($_COOKIE['cloak']) && $_COOKIE['cloak'] == md5($redisKey)) {
                $safety_id = $cloak->get_cloak(['sensitive' => $domain . '/' . $this->identity_tag]);
                $product = $this->getProduct_info($domain, $safety_id);
            } else {
                $product = $this->getProduct_info($domain, $product_id);
                $safety_id = $cloak->get_cloak(['sensitive_id' => $product['product_id']]);

                //是敏感网站进行cloak验证
                if ($safety_id) {
                    $boolean = $cloak->cloak_logic($product, $ip);
                    if (empty($boolean)) {
                        $product = $this->getProduct_info($domain, $safety_id);
                        \lib\register::getInstance('cache')->setEx($redisKey, 3600 * 2, json_encode($product));
                        setcookie('cloak', md5($redisKey), time() + 3600 * 2);
                    }
                }
            }
        }

        $_SESSION['identity_tag'] = $product['identity_tag'];
        if (!$product_id) {
            $product_id = $product['product_id'];
        }
        //jimmy : if has home page
        $product['has_home'] = false;
        $map = ['AND' => ['domain' => $product['domain'], 'is_del' => 0]];
        $ret = $this->register->get('db')->get('site', ['title', 'domain'], $map);

        if ($ret) {
            $product['has_home'] = true;
            $product['home_title'] = $ret['title'];
            //获取文章列表
            $product['home_article'] = $this->register->get('db')->select('article', [
                'article_id', 'title', 'content', 'add_time', 'sort', 'aid'
                    ], ['domain' => $ret['domain'], 'is_del' => 0, 'ORDER' => ['sort' => 'DESC']]);
        }
        // end if

        $product['thumb'] = self::getResourceUrl($product['thumb'], $product['product_id'], 1, $product['img_cdn_type']);
        $product['logo'] = self::getResourceUrl($product['logo'], $product['product_id'], 1, $product['img_cdn_type']);

        $lang = $product['lang'];
        $product['options'] = $this->getProductAttr($product['product_id']);
        $product['json_options'] = json_encode($product['options']);

        $product['lang'] = $this->register->get('lang')->getLang('', '', $product['id_zone']);
        $product['service_email'] = $product['lang']['contact'];


        if ($product_id) {
            $product['lang'] = $this->register->get('lang')->getLang(strtolower($lang), $product['theme'], $product['id_zone']);
        }

        $product['lang']['warming'] = sprintf($product['lang']['warming'], $product['service_email'], $product['service_email']);
        if ($product['lang']['buy_know']) {
            $product['lang']['buy_know'] = sprintf($product['lang']['buy_know'], $product['service_email'], $product['service_email']);
        }

        //获取产品图集数据
        $product['photos'] = $this->getProductPhotos($product['product_id']);
        foreach ($product['photos'] as $k => $v) {
            $product['photos'][$k]['thumb'] = self::getResourceUrl($v['thumb'], $product_id, 1);
        }

        //获取产品视频数据
        $product['video'] = $this->getProductVideo($product['product_id']);
        $product['video']['video_url'] = self::getResourceUrl($product['video']['video_url'], $product_id, 2);
        $product['video']['cover_url'] = self::getResourceUrl($product['video']['cover_url'], $product_id, 2);

        $product['combo'] = $this->getCombo($product['product_id']); //获取产品套餐数据
        $product['comment'] = $this->getComment($product['product_id']); //获取产品评论数据
        $product['comment_length'] = $this->getCommentCount($product['product_id']); //获取产品评论总数
        $product['google_etc'] = $this->getProductGoogleExt($product['product_id']);


        $product['token'] = $_SESSION['token'];
        if (!$_SESSION['token']) {
            $product['token'] = md5(uniqid(rand(), true));
            $_SESSION['token'] = $product['token'];
            setcookie('formToken', $product['token'], time() + 7200);
        }

        $product['price'] = round(money_int($product['price'], 'float'));
        $product['market_price'] = round(money_int($product['market_price'], 'float'));
        $product['discount_price'] = $product['price'];
        $product['erp_title'] = $product['title'];
        //如果不存在GA,填充默认GA
        if (empty(trim($product['google_analytics_js']))) {
            $temp_ga1 = "<script>";
            $temp_ga2 = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();";
            $temp_ga3 = "a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script',";
            $temp_ga4 = "'https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-100584985-1', 'auto');ga('send', 'pageview');";
            $temp_ga5 = "</script>";
            $product['google_analytics_js'] = $temp_ga1 . $temp_ga2 . $temp_ga3 . $temp_ga4 . $temp_ga5;
        }

        if ($product['sales_title']) {
            $product['title'] = $product['sales_title'];
        }
        if ($product['payment_ocean']) {
            $product['ocean'] = $this->getOceanPage($lang);
        }

        //fb_px
        if (strpos($product['fb_px'], ",")) {
            $fb_px = explode(',', $product['fb_px']);
        } else {
            $fb_px[] = $product['fb_px'];
        }
        $product['fb_px'] = $fb_px;

        //增加价格格式化
        $id_zone = $product['id_zone'];
        $new_currency_format = $this->getCurrencyFormat($id_zone, $product['price'], $product['market_price']);
        if (!empty($new_currency_format)) {
            $product['exchange_rate'] = $new_currency_format['exchange_rate'];
            $product['new_price_format'] = $new_currency_format;
        } else {
            $product['exchange_rate'] = 1;
            $product['new_price_format'] = [];
        }

        #对于处于待消档状态的产品，更换成统一模版
        if ($product['is_del'] == 10)
            $product['theme'] = 'style2';


        //查询GA代码
        $ga_analytics_id = $this->queryGAID($id_zone, $product['oa_id_department']);
        $product['google_analytics_id'] = $ga_analytics_id ? $ga_analytics_id : '';

        $product['content'] = get_content_path($product['content'], $product['img_cdn_type']);
        // $product['content'] = $this->replaceAwsImg($product['oa_id_department'],$product['content']);

        $product['product_md_ddn'] = $this->getProductMd($product_id);

        return $product;
    }

    /**
     * 设置产品标志
     * @param string $value 产品标志
     */
    public function setIdentityTag($value) {
        if (!isset($_SESSION['identity_tag'])) {
            $_SESSION['identity_tag'] = $value;
        }
        $this->identity_tag = $value;
    }

    /**
     * 获取产品标志
     * @param int $product_id 产品id
     * @return string $identity_tag 产品标志
     */
    public function getIdentityTag($product_id) {
        //如果是首页
        if ($_SERVER['SCRIPT_NAME'] == '/index.php') {
            //var_dump($_SERVER['REQUEST_URI']);
            $identity_tag = trim(str_replace($_SERVER['SCRIPT_NAME'], '', $_SERVER['REQUEST_URI']), '/');
            if (strpos($identity_tag, '?') !== false) {
                list($identity_tag, $others) = explode('?', $identity_tag);
            }
            $this->setIdentityTag($identity_tag);
            return $identity_tag;
        }

        if ($product_id) {
            $identity_tag = register::getInstance("db")->get('product', 'identity_tag', ['product_id' => $product_id]);
            $this->setIdentityTag($identity_tag);
            return $identity_tag;
        }
        if ($_SESSION['identity_tag']) {
            $identity_tag = $_SESSION['identity_tag'];
            $this->setIdentityTag($identity_tag);
            return $identity_tag;
        }
    }

    /**
     * 请求货币格式化数据
     * @param $id_zone      时区
     * @param $price        价格
     * @param $market_price 市场价格
     * @return array
     */
    function getCurrencyFormat($id_zone, $price, $market_price) {
        //错误地区ID
        if ($id_zone <= 0) {
            return [];
        }

        //原始SQL语句查询
        $sql = 'select c.`symbol_left`, c.`symbol_right`, c.`currency_format`, c.`exchange_rate` from zone z ';
        $sql = $sql . ' left join currency c on z.`currency_id` = c.`currency_id` where z.`id_zone` = ' . $id_zone . ';';
        //服务IP：ip-172-31-28-108,
        //错误信息：[02-Jul-2018 23:28:41 Asia/Shanghai] PHP Fatal error:  Call to a member function fetchAll()
        // on boolean in /home/cuckoo/www/webserver/lib/product.php on line 293
        $pdoStatement = $this->register->get('db')->query($sql);
        if( ! $pdoStatement ){
            return [];
        }
        $ret = $pdoStatement->fetchAll();

        //如果查询为空返回空数组
        if (!$ret) {
            return [];
        }

        //转化价格格式
        $data = [];
        $ret = $ret[0];
        $symbol_left = empty($ret['symbol_left']) ? '' : $ret['symbol_left'];
        $symbol_right = empty($ret['symbol_right']) ? '' : $ret['symbol_right'];
        $currency_format = trim($ret['currency_format']);
        $currency_format = empty($currency_format) ? '' : $currency_format;
        $exchange_rate = $ret['exchange_rate'];

        if (empty($currency_format) || $currency_format == '' || is_null($currency_format)) {
            $data['symbol_left'] = $symbol_left;
            $data['symbol_right'] = $symbol_right;
            $data['price_format'] = $price;
            $data['market_price_format'] = $market_price;
            $data['exchange_rate'] = $exchange_rate;

            return $data;
        } else {
            //获取位数和分隔符
            $num_len = (strlen($currency_format) - 1) / 2;
            $symbol = substr($currency_format, $num_len, 1);
            $str_price = $this->formatPrice($num_len, $symbol, (string) $price);
            $str_market_price = $this->formatPrice($num_len, $symbol, (string) $market_price);

            $data['symbol_left'] = $symbol_left;
            $data['symbol_right'] = $symbol_right;
            $data['price_format'] = $str_price;
            $data['market_price_format'] = $str_market_price;
            $data['exchange_rate'] = $exchange_rate;
            $data['num_len'] = $num_len;
            $data['symbol'] = $symbol;

            return $data;
        }
    }

    /**
     * 字符串反转格式化
     * @param $num_len
     * @param $symbol
     * @param $price
     * @return string
     */
    function formatPrice($num_len, $symbol, $price) {
        if ($price <= 0 || empty($price) || is_null($num_len) || is_null($symbol) || $num_len <= 0) {
            return $price;
        }

        $arr = str_split(strrev($price), $num_len);
        $temp = implode($symbol, $arr);
        $price = strrev($temp);

        return $price;
    }

    function getLangAndThemeByTag($domain, $identity_tag) {
        $map = ['AND' => ['domain' => $domain, 'identity_tag' => $identity_tag, 'is_del' => [0, 10]]];

        //查询字段数组
        $field = ['id_zone', 'product_id', 'lang', 'theme', 'service_contact_id', 'service_email'];
        $product = $this->register->get('db')->get('product', $field, $map);

        if (empty($product)) {
            $this->register->get('view')->show_404();
            exit;
        } else {
            //保存产品标识在session中
            if (empty($_SESSION['identity_tag'])) {
                $_SESSION['identity_tag'] = $product['identity_tag'];
            }
        }
        $product['token'] = $_SESSION['token'];
        if (!$_SESSION['token']) {
            $product['token'] = md5(uniqid(rand(), true));
            $_SESSION['token'] = $product['token'];
        }
        $product['theme'] = $product['theme'];
        $product['lang'] = $this->register->get('lang')->getLang('', '', $product['id_zone']);

        return $product;
    }

    /**
     * 通过订单id获取产品的lang和theme 同时将token保存到session中
     * @param int $order_id 订单id
     * @param string $server_name 域名
     * @return array 产品数据
     */
    function getLangAndThemeByOid($order_id, $server_name) {
        $product_id = $this->register->get('db')->get('order', 'product_id', ['order_id' => $order_id]);

        //查询字段数组
        $field = ['id_zone', 'product_id', 'lang', 'identity_tag', 'theme', 'service_contact_id'];
        $product = $this->register->get('db')->get('product', $field, ['product_id' => $product_id]);

        if (empty($product)) {
            $this->register->get('view')->show_404();
            exit;
        }

        //保存产品标识在session中
        if (empty($_SESSION['identity_tag'])) {
            $_SESSION['identity_tag'] = $product['identity_tag'];
        }

        if (empty(I('data.token/s', '', '', $_SESSION))) {
            $_SESSION['token'] = md5(uniqid(rand(), true));
        }
        $product['token'] = $_SESSION['token'];
        $product['identity_tag'] = $product['identity_tag'];
        $product['theme'] = $product['theme'];

        //jimmy fix session失效找不到lang包的情况
        $productModel = new \lib\product($this->register, $server_name);
        $theme = $productModel->getProductTheme($product_id);
        $lang = strtolower($theme['lang']);
        $lang = new \lib\lang($lang, $theme['theme']);
        $product['lang'] = $lang->getLang('', '', $product['id_zone']);

        return $product;
    }

    //jimmy 判断是否是首页
    public function getHome() {
        if ($this->identity_tag) {
            return false;
        }

        $cache = \lib\register::getInstance('cache');
        $cache = false;
        if ($cache) {
            $this->domain = Util::getDomain($this->domain);
            $ukey = 'KEY_IS_INDEX';
            if ($cache->hExists($ukey, $this->domain)) {
                return true;
            } else {
                return false;
            }
        } else {
            #稳妥起见，先只改product里面的like
            $domain = Util::getDomain($this->domain);
            $map = ['AND' => ['domain' => $domain, 'is_del' => [0, 10], 'identity_tag' => ""]];
            $ret = $this->register->get('db')->get('product', ['product_id'], $map);
            if ($ret) {
                return false;
            }
            $map = ['AND' => ['domain' => $domain, 'is_del' => [0, 10]]];
            $ret = $this->register->get('db')->count('site', $map);
            if ($ret) {
                return true;
            }
        }
    }

    //mike 显示首页内容
    public function showHome($category_id) {
        // 初始化类
        $home = new \lib\home($this->register, $this->domain);
        //查询站点信息 获取站点模板
        $site = $home->getHomeInfo();
        $siteTheme = $site['theme'];
        //先保证原先的字段问题
        if (empty($site))
            $site = 'style1';


        // diy 模版
//        if( $site['theme'] == 'diy' ){
//
//            $this->register->get('view')->display('home/diy/head.twig', []);
//            $rowshead = $this->register->get('db')->select("themebuilder","*",['theme_id'=>1,"module_sort"=>0,"ORDER"=>"module_sort"]);
//            $rowsmiddle = $this->register->get('db')->select("themebuilder","*",['theme_id'=>1,"module_sort[<>]"=>[1,98],"ORDER"=>"module_sort"]);
//            $rowsfoot = $this->register->get('db')->select("themebuilder","*",['theme_id'=>1,"module_sort"=>99,"ORDER"=>"module_sort"]);
//            $rows = array_merge($rowshead, $rowsmiddle);
//
//            foreach ($rows as $module) {
//                $moduleName = $module['module_type'];
//                $moduleID = $module['module_id'];
//                $module_param = $module['module_param'];
//
//                if( !imodule_param ){
//                    $data = [];
//                }else{
//                    $data = json_decode($module_param, true);
//                }
//                if( $moduleName == 'collection' ){
//                    for($i=0;$i<6;$i++){
//                        $list[$i]['title'] = '测试产品';
//                        $list[$i]['description'] = '啊啊啊啊？';
//                        $list[$i]['thumb'] = 'http://imgcn.stosz.com/home/20170825/1503649868410.jpg-shop';
//                        $list[$i]['shop_price'] = '199';
//                        $list[$i]['url'] = '#';
//                    }
//                    $data['list'] = $list;
//                }
//
//                $this->register->get('view')->display('home/diy/'.$moduleName.'.twig', $data);
//            }
//            $this->register->get('view')->display('home/diy/footer.twig', []);
//            die();
//        }
        //设置home下的view
        $home->setLibView('home/' . $siteTheme, app_path);
        $view = new \lib\view('home/' . $siteTheme, app_path);

        //分类模型 获取所有分类标题数据
        $mod_category = new category($this->register, $this->domain);

        $category_title = $mod_category->getAllFirstSecondLevelCategory();

        $data['category_title'] = $category_title;

        // 初始化信息
        $data['THEME'] = 'home/' . $siteTheme;
        $data['info'] = $site;
        $data['head'] = $home->head($data);   //头部

        $data['footer'] = $home->footer($data); //底部
        $data['index_focus'] = $home->index_focus(); //焦点图
        //加载语言包
        $lang = strtolower($data['info']['lang']);
        $lang = new \lib\lang($lang, $siteTheme);
        $this->register->set('lang', $lang);
        $data['lang'] = $this->register->get('lang')->getHomeLang($lang->lang, $lang->theme);

        //分页
        $p = empty($_GET['p']) ? 1 : $_GET['p'];

        //判断是否是分类数据查询
        if (empty($category_id)) {
            if (isset($_GET['act']) && $_GET['act'] == 'getAjaxGoods' && !isset($_GET['category_id'])) {
                if ($siteTheme == 'style12') {
                    $ret = $mod_category->getMultiCatGoods();
                } else {
                    $ret = $home->getAjaxRecomGoods($p);
                }
                echo json_encode($ret);
                exit;
            }
        } else {
            if (isset($_GET['act']) && $_GET['act'] == 'getCategoryGoods') {
                //分类
                $ret = $mod_category->getProductCategoryID($category_id, $p);
                echo json_encode($ret);
                exit;
            }
            if (isset($_GET['show']) && $_GET['show'] == "1") {
                $ret = $mod_category->getProductCategoryID($category_id, $p);
                foreach ($category_title as $key => $val) {
                    if ($val['id'] == $category_id) {
                        $data['title'] = $val['title'];
                        $data['title_id'] = $val['id'];
                        $data['title2'] = '';
                        $data['title2_id'] = '';
                        break;
                    } else {
                        if (!empty($val['child'])) {
                            foreach ($val['child'] as $k1 => $v1) {
                                if ($v1['id'] == $category_id) {
                                    $data['title'] = $val['title'];
                                    $data['title_id'] = $val['id'];
                                    $data['title2'] = $v1['title'];
                                    $data['title2_id'] = $v1['id'];
                                    break;
                                }
                            }
                        }
                    }
                }

                $data['category_id'] = $category_id;
                $data['ModuleGoods'] = $ret['ModuleGoods'];

                $view->display('cat.twig', $data);
                exit;
            }
            $data['category_id'] = $category_id;
        }
        $view->embedStatScript(1, array('title' => $data['info']['title']));

        $view->display('index.twig', $data);
    }

    /**
     * 获取产品属性
     * @param int $product_id
     * @param array $attr_ids 属性id
     * @param int $parent_product_id 父类产品id
     * @return array 属性数据
     */
    public function getProductAttr($product_id, $attr_ids = [], $parent_product_id = 0) {
        $attr_array = [];
        $map = ['product_id' => $product_id, 'is_del' => 0, 'ORDER' => ["sort", 'product_attr_id']];
        if ($attr_ids) {
            $map['product_attr_id'] = $attr_ids;
        }

        $attrs = $this->register->get('db')->select('product_attr', '*', $map);
        if ($attrs) {
            $_productId = $parent_product_id ? $parent_product_id : $product_id; //cdn遵循的产品id
            foreach ($attrs as $key => $attr) {
                $attr['thumb'] = self::getResourceUrl($attr['thumb'], $_productId, 1);
                $id = $attr['attr_group_id'];
                if (!isset($attr_array[$id])) {
                    $attr_array[$id]['attr_group_id'] = $attr['attr_group_id'];
                    $attr_array[$id]['attr_group_title'] = $attr['attr_group_title'];
                }

                $attr_array[$id]['attr'][$attr['product_attr_id']] = $attr;
            }
        }
        return $attr_array;
    }

    public function getProductsAttrNumbers($product_id = []) {
        $map = ['product_id' => $product_id, 'is_del' => [0, 10]];
        $attrs = $this->register->get('db')->select('product_attr', ['number'], $map);

        return $attrs;
    }

    /**
     * 获取产品图集
     * @param int $product_id
     * @return mixed
     */
    public function getProductPhotos($product_id) {
        $map = ['product_id' => $product_id, 'ORDER' => ['add_time' => 'DESC']];
        $ret = $this->register->get('db')->select("product_thumb", '*', $map);

        return $ret;
    }

    /**
     * 获取商品视频信息
     * @param int $product_id
     * @return array|boolean $ret
     */
    public function getProductVideo($product_id) {
        $map = ['product_id' => $product_id];
        $ret = $this->register->get('db')->get("product_video", '*', $map);
        return $ret;
    }

    /**
     * 获取产品前台展示模板
     * @param int $product_id
     * @return array|boolean $theme
     */
    public function getProductTheme($product_id = 0) {
        #稳妥起见，先只改product里面的like
        $domain = Util::getDomain($this->domain);

        if (!$product_id) {
            $map = ['AND' => ['domain' => $domain, 'is_del' => [0, 10], 'identity_tag' => $this->identity_tag]];
        } else {
            $map = ['product_id' => $product_id];
        }

        //var_dump($this->domain,$this->identity_tag);
        $theme = $this->register->get('db')->get('product', ['theme', 'lang', 'is_del', 'id_zone'], $map);
        if (!$theme) {
            return false;
        }

        return $theme;
    }

    /**
     * 获取产品评论
     * @param int $product_id 产品id
     * @return array 产品评论
     */
    public function getComment($product_id) {
        $map = ['product_id' => $product_id, 'is_del' => [0, 10]];
        $map['LIMIT'] = [0, 100]; //最多展示100
        $map['ORDER'] = ['comment_id' => "DESC"];
        $ret = $this->register->get('db')->select('product_comment', "*", $map);

        if ($ret) {
            $results = [];
            $comment_id = array_column($ret, 'comment_id');
            $map = ['comment_id' => $comment_id];
            $thumb = $this->register->get('db')->select('product_comment_thumb', ['thumb', 'comment_id'], $map);
            foreach ($ret as $value) {
                foreach ($thumb as $key => $t) {
                    $t['thumb'] = self::getResourceUrl($t['thumb'], $product_id, 1);
                    if ($t['comment_id'] == $value['comment_id']) {
                        $value['thumb'][] = $t;
                    }
                }
                $results[] = $value;
            }
        }
        return $results;
    }

    /**
     * 获取产品评论总数
     * @param int $product_id
     * @return int 产品评论总数
     */
    public function getCommentCount($product_id) {
        $map = ['product_id' => $product_id, 'is_del' => [0]];
        //取出评论条数
        $count = $this->register->get('db')->count('product_comment', $map);

        return $count;
    }

    /**
     * 获取产品套餐数据
     * @param int $product_id 产品id
     * @return array 产品套餐数据
     */
    public function getCombo($product_id) {
        $map['product_id'] = $product_id;
        $map['is_del'] = [0];
        $ret = $this->register->get('db')->select('combo', '*', $map);

        foreach ($ret as $key => $rs) {
            $rs['price'] = round(money_int($rs['price'], 'float'));
            $rs['goods'] = $this->getComboGoods($rs['combo_id']); //获取套餐产品
            $rs['thumb'] = self::getResourceUrl($rs['thumb'], $product_id, 1);
            $_t_price = 0;

            foreach ($rs['goods'] as $k => $v) {
                $product = $this->getProductId($v['erp_id'], $v['product_id']);
                $_t_price = $_t_price + $v['promotion_price'] * $v['num'];
                $v['title'] = empty($v['sale_title']) ? $v['title'] : $v['sale_title'];
                $v['price'] = round(money_int($product['price'], 'float'));
                $v['promotion_price'] = round(money_int($v['promotion_price'], 'float'));
                $v['thumb'] = self::getResourceUrl($product['thumb'], $product_id, 1);

                //获取套餐产品属性数据
                $ids = [];
                if ($v['attr_id_desc']) {
                    $attr_ids = json_decode($v['attr_id_desc'], JSON_OBJECT_AS_ARRAY);
                    foreach (array_values($attr_ids) as $vo) {
                        $ids = array_merge($ids, $vo);
                    }
                }
                $v['options'] = $this->getProductAttr($product['product_id'], $ids, $product_id);

                $rs['goods'][$k] = $v;
            }

            if ($_t_price == $_t_price) {
                $rs['show_detail'] = '1';
            } else {
                $rs['show_detail'] = '0';
            }

            $rs['goods'] = array_column($rs['goods'], NULL, 'combo_goods_id');

            $ret[] = $rs;
        }
        $ret = array_column($ret, NULL, 'combo_id');

        /* 版本( 小于v4.8.0 )
          foreach ($ret as $value) {
          $_c_price = $value['price'];
          $value['price'] = round(money_int($value['price'], 'float'));
          // mike:产品套餐属性
          $value['goods'] = $this->getComboGoods($value['combo_id']);
          $_t_price = 0 ;
          foreach ($value['goods'] as $v) {
          $product = $this->getProductId($v['erp_id'], $v['product_id']);
          //处理名称显示外文 没有显示正常
          $_t_price = $_t_price + $v[' '] * $v['num'];
          $v['title'] = empty($v['sale_title']) ? $v['title'] : $v['sale_title'];
          $v['price'] = round(money_int($product['price'], 'float'));
          $v['promotion_price'] = round(money_int($v['promotion_price'], 'float'));
          $v['thumb'] = $product['thumb'];
          $v['options'] = $this->getProductAttr($product['product_id']);
          $value['goods'][] = $v;
          }
          if($_t_price == $_c_price){
          $value['show_detail'] = '1';
          }else{
          $value['show_detail'] = '0';
          }
          $value['goods'] = array_column($value['goods'], NULL, 'combo_goods_id');
          $ret[] = $value;
          }
          $ret = array_column($ret, NULL, 'combo_id'); */

        return $ret;
    }

    public function getComboOfId($combo_id, $product_id = 0) {
        $map['combo_id'] = $combo_id;
        $map['is_del'] = 0;
        if ($product_id) {
            $map['product_id'] = $product_id;
        }
        $ret = $this->register->get('db')->get('combo', '*', $map);
        if ($ret) {
            $ret['price'] = money_int($ret['price'], 'float');
        }
        return $ret;
    }

    /**
     * 获取产品套餐中的产品信息,面单名称,外文名称
     * @param int $combo_id
     * @return null
     */
    public function getComboGoods($combo_id = 0) {
        if (empty($combo_id) || $combo_id == 0) {
            return null;
        }

        //构建请求sql(请求套餐产品 左连接 产品表得到产品面单名称和外文名称)
        $sql1 = 'select cg.*, p.waybill_title, p.sales_title as p_sales_title ';
        $sql2 = 'from combo_goods cg left join product p on cg.product_id=p.product_id ';
        $sql3 = 'where combo_id=' . $combo_id;

        $sql = $sql1 . $sql2 . $sql3;
        $retCG = $this->register->get('db')->query($sql)->fetchAll(\PDO::FETCH_ASSOC);

        return $retCG;
    }

    /**
     * 获取单个产品信息
     * @param int $erp_number erp id
     * @param int $product_id 产品id
     * @return array 单个产品信息
     */
    public function getProductId($erp_number, $product_id = 0) {
        if ($product_id == 0) {
            $map = ['AND' => ['erp_number' => $erp_number, 'is_del' => [0, 10]], 'ORDER' => ['product_id' => 'DESC']];
        } else {
            $map = ['product_id' => $product_id, 'ORDER' => ['product_id' => 'DESC']];
        }
        $field = ['erp_number', 'product_id', 'price', 'la', 'thumb', 'service_email', 'theme', 'currency_code', 'currency_prefix', 'currency', 'id_zone', 'price', 'market_price', 'fb_px', 'domain', 'identity_tag', 'service_contact_id', 'oa_id_department'];
        $ret = $this->register->get('db')->get("product", $field, $map);
        if (strpos($ret['fb_px'], ",")) {
            $fb_px = explode(',', $ret['fb_px']);
        } else {
            $fb_px[] = $ret['fb_px'];
        }
        $ret['fb_px'] = $fb_px;

        $id_zone = $ret['id_zone'];

        //GA代码配置
        $ga_analytics_id = $this->queryGAID($id_zone, $ret['oa_id_department']);
        $ret['google_analytics_id'] = $ga_analytics_id ? $ga_analytics_id : '';

        //yahooID记录
        $ret['google_etc'] = $this->getProductGoogleExt($product_id);

        $new_currency_format = $this->getCurrencyFormat($id_zone, $ret['price'], $ret['market_price']);
        if (!empty($new_currency_format)) {
            $ret['exchange_rate'] = $new_currency_format['exchange_rate'];
            $ret['new_price_format'] = $new_currency_format;
        } else {
            $ret['exchange_rate'] = 1;
            $ret['new_price_format'] = [];
        }

        $ret['product_md_ddn'] = $this->getProductMd($product_id);
        
        return $ret;
    }

    public function getProductIdWithType($identity_tag) {
        #稳妥起见，先只改product里面的like
        $domain = Util::getDomain($this->domain);
        $map = ['is_del' => 0, 'domain' => $domain];
        if ($identity_tag) {
            $map['identity_tag'] = $identity_tag;
        }
        $res = $this->register->get('db')->get("product", ['product_id'], $map);
        return $res['product_id'];
    }

    /**
     * chenhk
     * 产品扩展表google数据查询
     * @param $product_id
     * @return mixed
     */
    public function getProductGoogleExt($product_id) {
        $map = ['product_id' => $product_id];
        $res = $this->register->get('db')->get('product_ext', '*', $map);
        return $res;
    }

    //获取钱海内嵌页面
    public function getOceanPage($lang) {
        $payInfo = $this->register->get("db")->get('domain_payment', '*', ['domain[~]' => '%' . $this->domain, 'code' => 'ocean']);
        $ocean = new \lib\ocean();
        $ocean->setAccount($payInfo);
        $ocean = $ocean->index($this->register, strtolower($lang));
        return $ocean;
    }

    //判断该产品是否是要发送短信验证码
    public function isSendSms($product_id) {

        $ret = $this->register->get("db")->get("product", ['is_open_sms'], ['product_id' => $product_id]);
        return ['is_open_sms' => $ret['is_open_sms']];
    }

    //判断该产品是否是重复购买产品--3天之内判定为是-是的话，返回时间间隔，
    public function isSameBuy($data) {
        $limit_time = time() - 3600 * 24 * 3;
        if ($data['combo']) {
            // $product_attrs = json_decode($data['product_attr'],1);
            $product_attr = (array) $data['product_attr'];
            if (count($product_attr) >= 1) {
                $_bb = [];
                foreach ($product_attr as $key => $value) {
                    if (!empty($value['2']) && is_array($value['2'])) {
                        sort($value['2']);
                        $_bb[$key] = [];
                        $_bb[$key] = implode($value['2'], ',');
                    }
                }
                $_bb = array_unique($_bb);
            } else {
                $_bb = [];
            }
            $mobile = $data['mobile'];
            $product_id = $data['product_id'];
            $obj = $this->register->get('db')->query("SELECT o.mobile,o.order_id,o.title,o.order_status,o.add_time,g.num,g.product_id,g.order_goods_id FROM `order_goods` g LEFT JOIN `order` o on o.order_id=g.order_id WHERE o.mobile ='" . $mobile . "' AND o.combo_id = " . $data['combo'] . " AND o.product_id =" . $product_id . "  AND  o. add_time > " . $limit_time . " order by o.add_time desc");
            if (!$obj)
                return ['ret' => 0];
            $ret = $obj->fetchAll();
            $c = count($ret);
            if (empty($ret[0])) {
                return ['ret' => 0]; //空记录
            } else if (empty($_bb)) {
                $last_time = strtotime($ret[0]['add_time']);
                $interval_time = time() - $last_time;
                $title = $ret[0]['title'];
                $order_status = $ret[0]['order_status'];
                return ['ret' => 1, 'last_time' => $last_time, 'interval_time' => $interval_time, 'name' => $title, 'order_status' => $order_status]; //有记录均无属性
            } else {
                $_aa = [];
                $_t = [];
                foreach ($ret as $k => $v) {
                    $r = $this->register->get('db')->select('order_goods_attr', 'product_attr_id', ['order_goods_id' => $v['order_goods_id']]);
                    if (!isset($_aa[$v['order_id']])) {
                        $_aa[$v['order_id']] = [];
                    }
                    if ($r) {
                        sort($r);
                        $_aa[$v['order_id']][] = implode($r, ',');
                    }
                    if (!isset($_t[$v['order_id']])) {
                        $_t[$v['order_id']] = [$v['add_time'], $v['title'], $v['order_status']];
                    }
                }
                sort($_bb);
                foreach ($_aa as $k => $v) {
                    sort($v);
                    if ($_bb == $v) {
                        $last_time = strtotime($_t[$k][0]);
                        return ['ret' => 1, 'last_time' => $last_time, 'interval_time' => (time() - $last_time), 'name' => $_t[$k][1], 'order_status' => $_t[$k][2]];
                        break;
                    }
                }
                return ['ret' => 0];
            }
        } else {
            // $product_attr = json_decode($data['product_attr'],1);
            $product_attr = (array) $data['product_attr'];
            $product_attr = array_unique($product_attr);
            return $this->checkOneSame($data['mobile'], $limit_time, $data['product_id'], $product_attr);
        }
    }

    function checkOneSame($mobile, $limit_time, $product_id, $product_attr) {
        if (empty($product_attr)) {
            $obj = $this->register->get('db')->query("SELECT o.mobile,o.order_id,o.title,o.order_status,o.add_time,g.num,g.product_id,g.order_goods_id FROM `order_goods` g LEFT JOIN `order` o on o.order_id=g.order_id    WHERE o.mobile ='" . $mobile . "' AND o.product_id =" . $product_id . "  AND  o. add_time > " . $limit_time . " order by o.add_time desc");
            if (!$obj)
                return ['ret' => 0];
            $ret = $obj->fetchAll();
            ;
            if (empty($ret[0])) {
                return ['ret' => 0];
            } else {
                $last_time = strtotime($ret[0]['add_time']);
                $title = $ret[0]['title'];
                return ['ret' => 1, 'last_time' => $last_time, 'interval_time' => (time() - $last_time), 'name' => $title];
            }
        } else {
            $obj = $this->register->get('db')->query("SELECT o.mobile,o.order_id,o.title,o.order_status,o.add_time,g.num,g.product_id,g.order_goods_id FROM `order_goods` g LEFT JOIN `order` o on o.order_id=g.order_id    WHERE o.mobile ='" . $mobile . "' AND o.product_id =" . $product_id . "  AND  o. add_time > " . $limit_time . " order by o.add_time desc ");
            if (!$obj)
                return ['ret' => 0];
            $ret = $obj->fetchAll();
            if (empty($ret[0])) {
                return ['ret' => 0];
            }
            $_t = [];
            $_aa = [];
            foreach ($ret as $k => $v) {
                $r = $this->register->get('db')->select('order_goods_attr', 'product_attr_id', ['order_goods_id' => $v['order_goods_id']]);
                if ($r) {
                    sort($r);
                    if (!isset($_aa[$v['order_id']])) {
                        $_aa[$v['order_id']] = '';
                    }
                    $_aa[$v['order_id']] = $r;
                }
                if (!isset($_t[$v['order_id']])) {
                    $_t[$v['order_id']] = [$v['add_time'], $v['title'], $v['order_status']];
                }
            }
            sort($product_attr);
            foreach ($_aa as $k => $v) {
                if ($product_attr == $v) {
                    $last_time = strtotime($_t[$k][0]);
                    return ['ret' => 1, 'last_time' => $last_time, 'interval_time' => (time() - $last_time), 'name' => $_t[$k][1], 'order_status' => $_t[$k][2]];
                    break;
                }
            }
            return ['ret' => 0];
        }
    }

    /**
     * 通过中文名获取优化师账号
     * @param string $name_cn
     * @param int $ad_member_id 账号id
     * @return string 优化师账号
     */
    public function getUsernameByCn($name_cn, $ad_member_id = 0) {
        return \lib\register::createInstance('\lib\OaUsers')->getUsernameByCn($name_cn, $ad_member_id);
    }

    /**
     * 获取上级账号
     * @param int $ad_member_id 优化师账号id
     * @return string 上级账号
     */
    public function findManagerUserName($ad_member_id) {
        return \lib\register::createInstance('\lib\OaUsers')->findManagerUserName($ad_member_id);
    }

    function getComboProductAttrs($productId, $ids) {
        if (!$productId || !$ids)
            return [];
        return $this->register->get('db')->get('product_attr', [
                    '[>]product' => 'product_id=product_id'
                        ]
                        , [
                    'product_attr.product_attr_id',
                    'product_attr.product_id',
                    'product_attr.attr_group_id',
                    'product.seo_title',
                    'product.title',
                    'product.thumb',
                    ''
                        ], [
                    'id_product_attr' => $ids,
                    'product_id' => $productId
        ]);
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     *                                                谷歌项目组部署GA
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * 查询GA—ID
     * @param $id_zone  地区
     * @param $dep_id   部门ID
     * @return string|void
     */
    function queryGAID($id_zone, $dep_id) {
        $gaID = '';
        //jimmy新增，数字化运营部返回
        if ($dep_id == 271) {
            $gaID = 'UA-115100208-1';
            return $gaID;
        }
        switch ($id_zone) {
            case 15: //澳门
                $gaID = 'UA-112004184-1';
                break;
            case 45: //菲律宾
                $gaID = 'UA-112100723-1';
                break;
            case 7: //新加坡
                $gaID = 'UA-112113191-1';
                break;
            case 29: //印度尼西亚
                $gaID = 'UA-112090054-1';
                break;
            case 2: //台湾
                $gaID = $this->twOrTgGAID($dep_id, $id_zone);
                break;
            case 11: //泰国
                $gaID = $this->twOrTgGAID($dep_id, $id_zone);
                break;
            case 3: //香港
                $gaID = $this->xgOrMlxyGAID($dep_id, $id_zone);
                break;
            case 17: //马来西亚
                $gaID = $this->xgOrMlxyGAID($dep_id, $id_zone);
                break;
        }
        return $gaID;
    }

    /** 根据部门id查询部门名称
     * @param $dep_id
     * @return mixed
     */
    function getDepNameWithID($dep_id) {
        $department = $this->register->get('db')->get('oa_users', ['department'], ['id_department' => $dep_id]);
        return $department['department'];
    }

    /**
     * 台湾或者泰国
     * @param $dep_id
     * @param $id_zone
     * @return string
     */
    function twOrTgGAID($dep_id, $id_zone) {
        $gaID = '';
        $gaIndex = $id_zone == 2 ? '112084247' : '112028227';

        //先部门ID判断,如果没有再查询部门名称判断
        if ($dep_id == 12 || $dep_id == 40 || $dep_id == 55) { //陈学建
            $gaID = 'UA-' . $gaIndex . '-1';
        } else if ($dep_id == 22 || $dep_id == 42) {//黄邵伟
            $gaID = 'UA-' . $gaIndex . '-3';
        } else if ($dep_id == 31 || $dep_id == 90) {//王元林
            $gaID = 'UA-' . $gaIndex . '-7';
        } else if ($dep_id == 34 || $dep_id == 73) {//陈俊华
            $gaID = 'UA-' . $gaIndex . '-9';
        }

        //如果前面判断的已经存在 返回
        if (!empty($gaID)) {
            return $gaID;
        }

        // 部门名称
        $dep_name = $this->getDepNameWithID($dep_id);
        //不符合规则
        if (!preg_match('/(\d+)部(\d+)营/U', $dep_name)) {
            return $gaID;
        }

        if (strpos($dep_name, '1部1营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-1';
        } elseif (strpos($dep_name, '1部2营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-2';
        } elseif (strpos($dep_name, '2部1营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-3';
        } elseif (strpos($dep_name, '2部2营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-4';
        } elseif (strpos($dep_name, '2部3营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-5';
        } elseif (strpos($dep_name, '2部4营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-6';
        } elseif (strpos($dep_name, '3部1营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-7';
        } elseif (strpos($dep_name, '3部2营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-8';
        } elseif (strpos($dep_name, '4部1营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-9';
        } elseif (strpos($dep_name, '5部1营') === 0) {
            $gaID = 'UA-' . $gaIndex . '-10';
        }

        return $gaID;
    }

    /**
     * 香港或者马来西亚
     * @param $dep_id
     * @param $id_zone
     * @return string
     */
    function xgOrMlxyGAID($dep_id, $id_zone) {
        $gaID = '';
        $gaIndex = $id_zone == 3 ? '112098427' : '112073532';

        //先部门ID判断,如果没有再查询部门名称判断
        if ($dep_id == 12 || $dep_id == 40 || $dep_id == 55) { //陈学建
            $gaID = 'UA-' . $gaIndex . '-1';
        } else if ($dep_id == 22 || $dep_id == 42) {//黄邵伟
            $gaID = 'UA-' . $gaIndex . '-2';
        } else if ($dep_id == 31 || $dep_id == 90) {//王元林
            $gaID = 'UA-' . $gaIndex . '-3';
        } else if ($dep_id == 34 || $dep_id == 73) {//陈俊华
            $gaID = 'UA-' . $gaIndex . '-4';
        }

        //如果前面判断的已经存在 返回
        if (!empty($gaID)) {
            return $gaID;
        }

        // 部门名称
        $dep_name = $this->getDepNameWithID($dep_id);
        //不符合规则
        if (!preg_match('/(\d+)部(\d+)营/U', $dep_name)) {
            return $gaID;
        }

        if (strpos($dep_name, '1部') === 0) {
            $gaID = 'UA-' . $gaIndex . '-1';
        } elseif (strpos($dep_name, '2部') === 0) {
            $gaID = 'UA-' . $gaIndex . '-2';
        } elseif (strpos($dep_name, '3部') === 0) {
            $gaID = 'UA-' . $gaIndex . '-3';
        } elseif (strpos($dep_name, '4部') === 0) {
            $gaID = 'UA-' . $gaIndex . '-4';
        } elseif (strpos($dep_name, '5部') === 0) {
            $gaID = 'UA-' . $gaIndex . '-5';
        }

        return $gaID;
    }

    /**
     * 获取商品埋点
     * @param int $product_id
     * @return array|boolean $ret
     */
    public function getProductMd($product_id) {
        $map = ['product_id' => $product_id];
        $ret = $this->register->get('db')->get("product_md", '*', $map);
        if(empty($ret))
        {
            return '';
        }
        return $ret['md'];
    }

}
