<?php

namespace lib;

class OrderAttr {

    public $table = 'order_attr';

    public function __construct() {
        
    }

    /**
     * 添加订单属性数据
     * @param int $orderId
     * @return boolean 是否添加成功  false:添加失败  true:添加成功
     */
    public function add($orderId) {
        $orderData = register::getInstance('db')->get('order', ['order_no', 'erp_no', 'add_time', 'product_id'], ['order_id' => $orderId]);
        if (empty($orderData)) {
            return false;
        }
        $productData = register::getInstance('db')->get('product', ['theme', 'domain', 'identity_tag'], ['product_id' => $orderData['product_id']]);
        $data = array_merge($orderData, $productData);
        $data['order_id'] = $orderId;
        $data['add_time'] = strtotime($data['add_time']);

        return register::getInstance('db')->insert($this->table, $data);
    }

}
