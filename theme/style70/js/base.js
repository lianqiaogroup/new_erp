 var _PAGE_SIZE = 10;
 var _WEB_PATH = document.getElementById('baseScript').getAttribute('path');
 
 var _ONCLICK = "click",
     _ONDBCLICK = "doubletap",//双击屏幕
     _ONLONGCLICK = "longtap",//长按屏幕
     _ONHOLD = "hold",//按住屏幕
     _ONRELEASE = "release",//离开屏幕
     _ONSWIPEUP = "swipeup",
     _ONSWIPEDOWN = "swipedown",
     _ONSWIPELEFT = "swipeleft",
     _ONSWIPERIGHT = "swiperight";
	 
(function($2) {
	_WEB_PATH = _WEB_PATH + "/mobile/page/";
	$2.openWin = function(params){
		//$.openWindow(params);
		window.location.href = params.url;
	};
	
	$2.getParam = function(paramName){
		var match = RegExp('[?&]' + paramName + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace('/+/g', ' '));
	};
	
	/*$2.$$ = function(eName){
		return jQuery(eName);
	};*/
	
	$2.id = function(id){
		return document.getElementById(id);
	};
	
	$2.ajax2 = function(url, data, onSuccess, onError){
		
		jQuery.ajax({
			url:_WEB_PATH + url,
			data:data,
			dataType:'json',
			type:'post',
			timeout:10000,
			success:function(rdata){
				if(onSuccess) onSuccess(rdata);
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				//alert("ajax2 error: " + errorThrown);
				console.log("ajax2 error: " + errorThrown);
				if(onError) onError(errorThrown);
			}
		});
	};
	
	$2.toast = function(msg){
		var box = $2('<div class="message-box"></div>');
		box.text(msg);
		$2("body").append(box);
		box.show();
		window.setTimeout(function(){
			box.hide(1000);box.remove();
		}, 3000);
	};
	
	$2.loading = function(isShow){
		var ldbox = $2('<div class="ajax-loading"></div>');
		if(isShow){
			ldbox.show();
		}else{
			ldbox.hide();
		}
	};
	
	$2.confirm = function(msg, onYes, onNo){
		if(window.confirm(msg)){
			if(onYes) onYes();
		}else{
			if(onNo) onNo();
		}
	};
	
}(window.$2 = jQuery.noConflict()||{}));


$2(document).ready(function(e) {
	 $2(".mui-badge").each(function(index, element) {
        if($2(this).text()=='0'||$2(this).text()==''){
			$2(this).hide();
		}else{
			$2(this).show();
		}
     });
	 
	 $2('.touch-link').each(function(index, item){		 
	    $2(item).bind(_ONCLICK, function() {
			var _url = this.getAttribute('data-link');
			var _id = this.getAttribute('data-id');
	
			window.$2.openWin({
				url: _url, 
				id:_id,
				styles: {
					top: '45px',
					bottom: '50px',
					bounce: 'vertical'
				}
			});
	    });
    });
	
	$2('.mui-action-back').each(function(index, item){		 
		$2(item).bind(_ONCLICK, function() {
			window.history.go(-1);
		});
	});

	mui('.mui-tab-item').each(function(index,item){
		item.addEventListener('tap', function(e) {
			var _url = this.getAttribute('href');
			var _id = this.getAttribute('id');
			window.location.href = _url;
		});
	});
 });


