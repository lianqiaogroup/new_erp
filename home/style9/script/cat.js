$(function(){
	var cat_id = $('#cat_id').val();
	$.get('/?act=getCategoryGoods&category_id='+cat_id, function(data) {
	    var datajson = JSON.parse(data);
	    if(datajson.ModuleGoods != null){
		    var html = getdatatitle(datajson.ModuleGoods);
		    $('#content').show().find('.row').html('').append(html);
		    imgwh();
	    }else{
	    	var html = $('#emptydiv').clone().html();
	    	$('#content').show().find('.row').html('').append(html);
	    }
        //谷歌再营销统计
        googlefun(datajson.ModuleGoods);
	})
	function getdatatitle(item){
        if(item){
            var datas = item.length;
            var module = $('#module_dome').clone().html();
            var html = "";
            for(var i =  0; i < datas;i++){
                var newstr = module;
                newstr = newstr.replace(/\{url\}/g, item[i].type);
                newstr = newstr.replace(/\{thumb\}/g, item[i].thumb);
                newstr = newstr.replace(/\{title\}/g, item[i].title);
                if(item[i].currency_prefix == "1"){
                    newstr = newstr.replace(/\{shop_price\}/g, item[i].currency_code + item[i].price);
                }else{
                    newstr = newstr.replace(/\{shop_price\}/g, item[i].price+item[i].currency_code);
                }
                html = html + newstr;
            }
            return html;
        }
    }
    function imgwh(){
        var width = $('.caption').width() + "px";
        $('.thumbnail').find('img').css({'width':width,'height':width});
        window.onresize = function(){
            var width = $('.caption').width() + "px";
            $('.thumbnail').find('img').css({'width':width,'height':width});
        }
    }
    //侧边栏
    $('#menu').click(function(){
        $('body').addClass('with-panel-left-reveal');
        $('#panelview').show();
        $('#icon').removeClass('up').addClass('down');
        $('.class_layer').hide();
        $('body').removeClass('overhidden');
    });
    $('#menuclose,.panel-user').click(function(){
        $('body').removeClass('with-panel-left-reveal');
        $('#panelview').hide();
    });
})