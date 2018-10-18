// JavaScript Document
function addCart(goodsId, num, onSuccess, onError){
	var params = "gid=" + goodsId +"&num=" + num + "&ran=" + Math.random();
	$2.ajax2('cart/addCart',params, function(msg) {	
			if(msg > 0){
				$2("#cartNum").show();
				//$2.toast("已加入购物车！");
				if(onSuccess) onSuccess(msg);
			}else{
				$2.toast("修改失败！");
				if(onError) onError(msg);
			}
			
		}, function (err) {  
			$2.toast("修改失败！");
			if(onError) onError(err);
		}
    );
}

if($2(".rr").length>0){
    $2("#detial-appraise").css({"display":'block'})
    $2(".pingjia").css({"display":'block'})
}else {
    $2("#detial-appraise").css({"display": 'none'})
    $2(".pingjia").css({"display": 'none'})
	$2(".detail-bars li").css({"width":"50%"})
}