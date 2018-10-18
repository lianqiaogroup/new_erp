<?php

namespace lib;

class home
{
    public $domain;
    public $register;
    public $view;

    public function __construct($register, $serverName)
    {
        $this->register = $register;
        $this->domain = $serverName;
        //$this->view = new \lib\view('home/style1', app_path);
    }

    public function setLibView($theme, $app_path)
    {
        $this->view = new \lib\view($theme, $app_path);
    }

    /**
     * 根据域名查询主页的模板风格
     * @return string
     */
    public function getThemeDomain()
    {
        $map = ['domain[~]' => '%'.$this->domain, 'is_del' => 0];
        $res = $this->register->get('db')->get('site', ['theme'], $map);
        if (empty($res)) {
            return 'style1';
        } else {
            $theme = $res['theme'];
            if (!$theme) {
                $theme = 'style1';
            }
            return $theme;
        }
    }

    /**
     * @return string
     * 获取首页头部
     */
    public function head($data)
    {
        return $this->view->render('header.twig', $data);
    }

    /**
     * @return string
     * 获取首页尾部
     */
    public function footer($data)
    {
        $data['google_js'] = $data['info']['google_js'];
        $map = ['is_del' => 0, 'domain[~]' => '%'.$this->domain, 'ORDER' => ['sort' => "DESC", "article_id" => "DESC"], 'LIMIT' => [0, 6]];
        $data['article'] = $this->register->get('db')->select('article', "*", $map);
        foreach ($data['article'] as $k => $v){
            $data['article'][$k]['content'] = get_content_path($v['content']);
        }
        return $this->view->render('footer.twig', $data);
    }

    /**
     * @return string
     * 获取首页焦点图
     */
    public function index_focus()
    {
        $map = ['AND' => ['is_del' => 0, 'domain[~]' => '%'.$this->domain], 'ORDER' => ["sort" => "DESC", 'id' => "DESC"]];
        $ret = $this->register->get('db')->select('index_focus', "*", $map);
        $data = [];
        if ($ret) {
            $product_id = array_column($ret, 'product_id');
            $product = $this->register->get('db')->select('product', ['identity_tag', 'product_id'], ['product_id' => $product_id]);
            $product = array_column($product, NULL, 'product_id');
            foreach ($ret as $value) {
                $value['thumb'] = get_image_path($value['thumb'] );
                $value['type'] = $product[$value['product_id']]['identity_tag'];
                $data[] = $value;
            }
        }
        $data2['index_focus'] = $data;
        return $this->view->render('index_focus.twig', $data2);
    }

    /**
     * 查询已经定制的产品
     * @return mixed
     * $p 页码
     */
    public function getAjaxRecomGoods($p)
    {
        $page = ($p-1)*20;
        $product_ids =[];
        $arr_thumb_pid = [];
        if($p >1 ){
            $map = ['domain[~]' => '%'.$this->domain, 'is_del' => 0];
            $count = $this->register->get('db')->count('site_products', $map);
            if(!empty($count) && $count < $page) return [];
        }

        if($p < 2 || !empty($count)){
            $map = ['domain[~]' => '%'.$this->domain, 'is_del' => 0, 'ORDER' => ['sort' => 'DESC'], 'LIMIT' => [$page, 20]];
            $ret_site_product = $this->register->get('db')->select('site_products', '*', $map);
            if($ret_site_product) {
                $product_ids = array_column($ret_site_product, 'product_id');
                $arr_thumb_pid = array_column($ret_site_product, 'thumb', 'product_id');
            }
        }

        $arr_goods = $this->getAjaxGoods($product_ids,$page);

        //将产品图片替换为首页产品推荐上传的图片
        if (!empty($arr_thumb_pid) && !empty($arr_goods['ModuleGoods'])) {
            $temp_module_good = [];
            foreach ($arr_goods['ModuleGoods'] as $key=>$item) {
                $arr_thumb_pid[$item['product_id']] && ($item['thumb'] = $arr_thumb_pid[$item['product_id']]);
                $item['thumb'] = get_image_path($item['thumb']);
                $temp_module_good[] = $item;
            }
            $arr_goods['ModuleGoods'] = $temp_module_good;
        }

        return $arr_goods;
    }

    /**
     * @return string
     * ajax获取首页产品
     */
    public function getAjaxGoods($filter = [],$page)
    {
        $data = array(
            "mid" => "1", "title" => "首页", "sort" => "1", "num" => "2", "parent_id" => "0", "add_time" => "2017-02-23 11:18:35", "is_del" => "0",
        );
        $domain = Util::getDomain($this->domain);
        if (empty($filter)) {
            $map = ['AND' => ['is_del' => 0, 'domain' => $domain], 'ORDER' => ['product_id' => "DESC"],'LIMIT'=>[$page,20]];
        } else {
            $map = ['AND' => ['is_del' => 0, 'product_id' => $filter, 'domain' => $domain]];
        }

        $cat = new \lib\category($this->register,$this->domain);
        $ret = $this->register->get('db')->select('product', "*", $map);

        $info2 = [];
        if ($ret) {
            foreach ($ret as $value) {
                $thumb = $cat->get_home_product_thumb($value['product_id']);
                $info['product_id'] = $value['product_id'];
                $info['thumb'] = $thumb?:$value['thumb'];
                $info['title'] = $value['sales_title'];
                $info['price'] = round(money_int($value['price'], 'float'));
                $info['market_price'] = round(money_int($value['market_price'], 'float'));
                $info['currency_code'] = $value['currency_code'];
                $info['type'] = $value['identity_tag'];
                $info['currency_prefix'] = $value['currency_prefix'];
                $info['sales_num'] = $value['sales'];
                $goods_info[] = $info;
            }
            $info2 = $goods_info;
            if($filter)
            {
                $goods =[];
                $info_array = array_column($info2,NULL,'product_id');
                foreach ($filter as  $k=>$p)
                {
                    if($info_array[$p])
                    {
                        $goods[] =  $info_array[$p];
                    }
                }
                $info2 = $goods;
            }


        }
        $data['ModuleGoods'] = $info2;
        return $data;
    }

    /**
     * @return string
     * ajax获取首页信息
     */
    public function getHomeInfo()
    {
        $domain = Util::getDomain($this->domain);
        $map = ['AND' => ['is_del' => 0, 'domain' => $domain]];
        $ret = $this->register->get('db')->get('site', "*", $map);
        $ret['logo'] = get_image_path($ret['logo']);
        if (!$ret) {
            $this->register->get('view')->show_404();
            exit;
        }
        return $ret;
    }
}