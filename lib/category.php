<?php

namespace lib;

class category
{
    public $domain;
    public $register;

    public $table_category = 'category';
    public $table_product = 'product';
    public $table_product_category = 'product_category';

    /**
     * 构造方法
     * category constructor.
     * @param $register
     * @param $serverName
     */
    public function __construct($register, $serverName)
    {
        $this->register = $register;
        $this->domain = $serverName;
    }

    /**
     * 获取所有的分类（一级分类）
     * @return mixed
     */
    public function getAllCategory()
    {
        $map = ['parent_id' => 0, 'domain[~]' => '%'.$this->domain, 'is_del' => 0, 'ORDER' => ['sort' => 'DESC']];
        $ret_category = $this->register->get('db')->select($this->table_category, ['id', 'domain', 'title'], $map);
        return $ret_category;
    }

    /**
     * [getFirstSecondLevelCategory 获取所有的一级和二级分类]
     * @author leonchou130
     * @return [type] [description]
     */
    public function getAllFirstSecondLevelCategory()
    {
        $map = ['domain[~]' => '%'.$this->domain, 'is_del'=>0, 'ORDER' => ['sort' => 'DESC']];
        $ret_category = $this->register->get('db')->select($this->table_category, ['id', 'domain', 'title', 'parent_id'], $map);
        // print_r($ret_category);
        $results = [];
        foreach ($ret_category as $k => $v) {
            if ($v['parent_id'] == 0) {
                $son = [];
                foreach ($ret_category as $k2 => $v2) {
                    if ($v['id'] == $v2['parent_id']) {
                        array_push($son, $v2);
                    }
                }
                $v['child'] = $son;
                array_push($results, $v);
            }
        }
        // print_r($results);exit;
        return $results;
    }

    /**
     * 根据分类ID 获取该分类下的产品
     * @param $category_id
     * @return array|null
     */
    public function getProductCategoryID($category_id,$p=0)
    {
        //查询一级分类下面的子分类
        $ret_child_category = $this->register->get('db')->select($this->table_category, ['id'], ['parent_id'=>$category_id]);
        $ids = array_column($ret_child_category, 'id');
        array_push($ids, $category_id);
        $map = ['category_id' => $ids];
        $count = $this->register->get('db')->count($this->table_product_category,$map);
        if (!$count) return ['count'=>$count,'page'=>$p,'ModuleGoods'=>null];

        if($p)
        {
            if($p>$count) $p = $count;
            $page = ($p-1)*20;
        }

        $data = [];
        $data['count'] =$count;
        $data['page'] = $p;
        $domain = Util::getDomain($this->domain);
        $map = ['AND' => ['is_del' => 0, 'category_id' => $ids, 'domain' =>$domain], 'ORDER' => ['product.product_id' => "DESC"],'LIMIT'=>[$page,20]];

        $ret = $this->register->get('db')->select($this->table_product_category,["[>]product"=>['product_id'=>'product_id']], "*", $map);
        if ($ret) {
            foreach ($ret as $value) {
                $thumb =  $this->get_home_product_thumb($value['product_id']);
                $code = $this->register->get('db')->get('zone','code',['id_zone'=>$value['id_zone']]);
                $info['product_id'] = $value['product_id'];
                $info['thumb'] = get_image_path($thumb?:$value['thumb']);
                $info['title'] = $value['sales_title'];
                $info['price'] = round(money_int($value['price'], 'float'));
                $info['market_price'] = round(money_int($value['market_price'], 'float'));
                $info['currency_code'] = $value['currency_code'];
                $info['type'] = $value['identity_tag'];
                $info['currency_prefix'] = $value['currency_prefix'];
                $info['sales_num'] = $value['sales'];
                $info['erp_id'] = $value['erp_number'];
                $info['code'] = $code;
                $info2[] = $info;
            }
        }
        $data['ModuleGoods'] = $info2;

        return $data;

    }

    public function get_home_product_thumb($product_id){

       $thumb =  $this->register->get('db')->get('product_original_thumb','thumb',['product_id'=>$product_id,'type'=>2]);
       if($thumb){
           //兼容现有产品，如果是之前的本地地址则还是认为没有
           if(strpos($thumb,',') === false)
           {
               return '';
           }
       }
       list($thumb,$ServerThumb) = explode(',',$thumb);
       return $thumb;
    }

    //jimmy 获取所有分类下产品
    public function getMultiCatGoods(){
        $cats = $this->getAllCategory();
        //获取所有分类的产品
        $cats = array_column($cats,NULL,'id');
        $cats_goods =[];
        foreach ($cats as $cat){
            $key = $cat['id'];
            $map = ['product_category.category_id'=>$cat['id'],'LIMIT'=>10,'product.is_del'=>[0,10]];
            $column = ['product.product_id','product.title','product.price','product.currency_code','product.identity_tag','product.currency_prefix','product.thumb','product.sales_title'];
            $goods = $this->register->get('db')->select($this->table_product,["[>]product_category"=>['product_id'=>'product_id']],$column,$map);
            if($goods){
                $rows =[];
                foreach ($goods as $g){
                    $thumb =  $this->get_home_product_thumb($g['product_id']);
                    $g['thumb'] =get_image_path($thumb ?:$g['thumb']);
                    $g['price'] = round(money_int($g['price'], 'float'));
                    $g['title'] = $g['sales_title'];
                    $rows[] = $g;
                }
                $cats_goods[$key]['title'] = $cats[$key]['title'];
                $cats_goods[$key]['goods'] = $rows;
            }
        }
        return $cats_goods;
    }
}