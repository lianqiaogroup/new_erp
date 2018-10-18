<?php

namespace lib;
class product_attr_price
{
    public $register;
    public $num;
    public $price;
    public $combo = [];
    public $combo_id;

    public function __construct($register, $product)
    {
        $this->register = $register;
        $this->num = $product['num'];
        $this->combo = $product['combo'];
        $this->price = $product['price'];
        $this->combo_id = $product['combo_id'];
    }

    public function getPrice()
    {
        //如果为0.则没有套餐
        if ($this->combo_id == 0) {
            $total = $this->price * $this->num;
            return ['ret' => 1, 'price' => $this->price, 'total' => $total];
        }

        $price = $this->combo[$this->combo_id]['price'];
        $promotion_price = $this->combo[$this->combo_id]['promotion_price'];
        $total = $price * $this->num;
        return ['ret' => 1, 'price' => $price, 'total' => $total, 'promotion_price' => $promotion_price];

    }

    //获取编号
    public function getAttrNumber($id = [])
    {
        $map = ['product_attr_id' => $id];
        // mike:加上产品id
        $ret = $this->register->get('db')->get('product_attr', ["[>]product" => "product_id"], ['product_attr.number'], $map);
        return $ret['number'];
    }

    /**
     * 获取产品属性名称
     * @param array $id 产品属性id
     * @return string 产品属性名称
     */
    public function getAttrName($id = []) {
        $map = ['product_attr_id' => $id];
        $product_attr = $this->register->get('db')->select('product_attr', ['name'], $map);
        $ret = array_column($product_attr, 'name');
        $ret = implode(' ', $ret) . ' ';
        return $ret;
    }

    /**
     * 获取属性图片
     * @param array $id 产品属性id
     * @return string 属性图片
     */
    public function getAttrThumb($id = []) {
        $map = ['AND' => ['product_attr_id' => $id, 'thumb[!]' => '']];
        $product_attr = \lib\register::getInstance('db')->get('product_attr', ['thumb', 'product_id'], $map);
        return $product_attr ? \lib\product::getResourceUrl($product_attr['thumb'], $product_attr['product_id'], 1):'';
    }

    /**
     * 获取属性的信息
     * @param array $id 产品属性id
     * @param int $product_id 产品id 默认：0
     * @return array 属性的信息
     */
    public function getAttrInfo($id, $product_id = 0) {
        $map = ['product_attr_id' => $id];
        if ($product_id) {
            $map['product_id'] = $product_id;
        }

        // mike:加上产品id
        $ret = \lib\register::getInstance('db')->select('product_attr', ['number', 'name', 'product_attr_id', 'attr_group_id', 'product_id'], $map);
        return array_column($ret, NULL, 'product_attr_id');
    }

    //mike：获取套餐名称
    public function getComboAttr($data = [])
    {
        $ret = '';
        foreach ($data as $value) {
            $v = '';
            $v['title'] = $value['product_title'];
            $v['num'] = $value['qty'];
            if ($value['product_id'] == 0) {
                $map = ['AND' => ['erp_number' => $value['id_product'], 'is_del' => 0], 'ORDER' => ['product_id' => 'DESC']];
            } else {
                $map = ['product_id' => $value['product_id'], 'ORDER' => ['product_id' => 'DESC']];
            }
            $product = $this->register->get('db')->get('product', '*', $map);
            $v['price'] = round(money_int($product['price'], 'float'));
            $v['market_price'] = round(money_int($product['market_price'], 'float'));
            $v['thumb'] = $product['thumb'];
            $product_attr = $this->register->get('db')->select('product_attr', ['name', 'thumb'], ['number' => $value['attrs']]);
            // mike：订单页修改属性图片
            $attrthumb = array_column($product_attr, "thumb");
            $attrthumb = array_unique($attrthumb);
            if ($attrthumb[0]) $v['thumb'] = $attrthumb[0];
            // mike：将套餐属性作为唯一输出
            $product_attr = array_column($product_attr, "name");
            $product_attr = array_unique($product_attr);
            if ($product_attr) {
                foreach ($product_attr as $value) {
                    $v['attr_name'] .= $value . ' ';
                }
                $ret[] = $v;
            }
        }
        return $ret;
    }

    // mike：获取产品的组数量
    public function getAttrN($id)
    {
        $map = ['product_id' => $id, 'GROUP' => "attr_group_id"];
        $ret = $this->register->get('db')->select('product_attr', ['attr_group_id'], $map);
        $ret = count($ret);
        return $ret;
    }
}