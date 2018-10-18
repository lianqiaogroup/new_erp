<?php
namespace lib;

class serviceorder{
    private $register;

    public function __construct($register)
    {
        $this->register = $register;
        (new \lib\sign())->check_sign($_POST);
    }

    public function updateOrder($data){
		$db = $this->register->get('db')->db;
		$order_data = [];
		if($o = $db->get('order',['order_id','name','last_name','mobile','email','address','payment_amount','num','post_erp_data'],['erp_no'=>$data['erp_no']]))
		{
			try {
				$db->pdo->beginTransaction();
				$order_data['name'] = $data['first_name'];
				$order_data['last_name'] = $data['last_name'];
				$order_data['mobile'] = $data['mobile'];
				$order_data['email'] = $data['email'];
				// $order_data['province'] = $data['province'];
				// $order_data['city'] = $data['city'];
				// $order_data['district'] = $data['district'];
				$order_data['address'] = $data['address'];
				$order_data['payment_amount'] = money_int($data['payment_amount']);
				$order_data['num'] = $data['num'];
				$order_data = array_diff($order_data, $o);
				if($order_data){
					$res = $db->update('order',$order_data,['erp_no'=>$data['erp_no']]);
				}

				$post_erp_data = json_decode($o['post_erp_data'],1);
				$_local_pinfo_keys = $_api_data = $_local_data = $_og_id = [];
				foreach ($post_erp_data['products'] as $k => $v) {
					$key = $v['id_product'];
					$_local_pinfo_keys[$key] = ['product_id'=>$v['product_id'],'sale_title'=>$v['sale_title'],'product_title'=>$v['product_title']];
				}
				$order_id = $o['order_id'];
				if($product_data = $data['product']){
					foreach ($product_data as $k => $v) {
						#no need renew set post_erp_data
					    if(empty($v['attr_id'])){
					    	$attr_id_str = '';
					    }else{
					    	$attr_id_str = implode($v['attr_id'], ',');
					    }
						$key = $attr_id_str.'_'.$v['erp_number'];
						$_api_data[$key] = $v;
					}
				}
				if($order_goods_s = $db->select('order_goods',['order_goods_id','product_id','erp_id','num','price'],['order_id'=>$order_id])){
					foreach ($order_goods_s as $k => $v) {
						$product_attr_id_arr = [];
						$numbers = $db->query("SELECT p.number,p.product_attr_id FROM   order_goods_attr a LEFT JOIN product_attr p on p.product_attr_id=a.product_attr_id WHERE  a.order_goods_id=".$v['order_goods_id']);
						$tmp_numbers_str = '';
						if(!$numbers || !($numbers = $numbers->fetchAll())){
							$numbers = [];
						}else{
							$product_attr_id_arr = array_column($numbers, 'product_attr_id');
							$numbers = array_column($numbers, 'number');
							sort($numbers);
							$tmp_numbers_str = implode($numbers, ',');
						}
						$key = $tmp_numbers_str.'_'.$v['erp_id'];
						$_local_data[$key]['erp_number'] = $v['erp_id'];
						$_local_data[$key]['price'] = $v['price'];
						$_local_data[$key]['attr_id'] = $numbers;
						$_local_data[$key]['quantity'] = $v['num'];
						$_og_id[$key] = ['order_goods_id'=>$v['order_goods_id'],'product_attr_id'=>$product_attr_id_arr,'price'=>$v['price']];
					}
				}
				# 删除：
				if($_local_data){
					foreach ($_local_data as $k => $v) {
						if(empty($_api_data[$k])){
							# delete old order_goods records
							if(!$db->delete('order_goods',['order_goods_id'=>$_og_id[$k]['order_goods_id']])){
								$db->pdo->rollBack();
								return ['ret'=>0,'msg'=>'update fail 2'];
							}
							# delete old order_goods_attr records
							if($_og_id[$k]['product_attr_id_arr']){
								if(!$db->delete('order_goods_attr',['order_goods_id'=>$_og_id[$k]['order_goods_id']])){
									$db->pdo->rollBack();
									return ['ret'=>0,'msg'=>'update fail 3'];
								}
							}
						}
					}
				}
				# 更新:
				if($_api_data){
					foreach ($_api_data as $k => $v) {
						# update  order_goods
						if(empty($_og_id[$k])){
							# insert order_goods_attr
							$_insert = [];
							$_insert['title'] = $_local_pinfo_keys[$v['erp_number']]['sale_title'];
							$_insert['num'] = $v['quantity'];
							//4.6版本起,使用相同erp_id的 product_id 必定相同
							$_insert['product_id'] = $_local_pinfo_keys[$v['erp_number']]['product_id'];
							$_insert['price'] = 0;
							$_insert['total'] = 0;
							$_insert['order_id'] = $order_id;
							$_insert['erp_id'] = $v['erp_number'];

							if(!$_order_goods_id = $db->insert('order_goods',$_insert,['erp_no'=>$data['erp_no']])){
								$db->pdo->rollBack();
								return ['ret'=>0,'msg'=>'update fail 4'];
							}
							if($v['attr_id']){
								$_insert_goods_attr = [];
								foreach ($v['attr_id'] as $key => $value) {
									$_product_attr_id = $db->get('product_attr','product_attr_id',['number'=>$value]);
									$_insert_goods_attr[] = ['order_goods_id'=>$_order_goods_id,'product_attr_id'=>$_product_attr_id];
								}
								if(!$db->insert('order_goods_attr',$_insert_goods_attr)){
									$db->pdo->rollBack();
									return ['ret'=>0,'msg'=>'update fail 5'];
								}
							}
						}else{
							$_update = [];
							$_update['num'] = $v['quantity'];
							$_update['price'] = $_og_id[$k]['price'];
							$_update['total'] = $_og_id[$k]['price'] * $v['quantity'];
							$db->update('order_goods',$_update,['order_goods_id'=>$_og_id[$k]['order_goods_id']]);
						}
	            	}
				}
            	$db->pdo->commit();
            	return ['ret'=>1,'msg'=>'OK'];
			} catch (Exception $e) {
				$db->pdo->rollBack();
				return ['ret'=>0,'msg'=>'处理出现异常错误'];
			}
		}else{
			return ['ret'=>0,'msg'=>'wrong order_no'.$data['erp_no']];
		}
	}
}
