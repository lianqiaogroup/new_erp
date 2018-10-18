require(['jquery', 'swiper', 'widget'],function($, Swiper){
$(document).ready(function(){
    var galleryTop = new window.Swiper('.gallery-top', {
        centeredSlides: false,
    });
    $('.gallery-top').css({'height':$('body').width()+"px"});
    var galleryThumbs = new window.Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
        height:80
    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;

	var combo_id = $('input[name="combo_id"]').val();
	if(combo_id != 0){
		$('.goods[combo_id="'+ combo_id +'"]').show();
	}
	refresh_price();
    var is_single = $("#combo option").eq(0).attr('data-single');
    if(is_single == 1){
        $('.u-fornum').hide();
    }
	$('#combo').change(function(){
        is_single = $(this).find('option:selected').attr('data-single');
        if (is_single == 1) {
            $('.u-fornum').hide();
        }else{
            $('.u-fornum').show();
        }
		var val = $(this).val();
		$('input[name="combo_id"]').val(val);
		$('.goods').hide();
		$('.goods[combo_id="'+ val +'"]').show();
		refresh_price();
	});
    $('.attr_mnu').on('click','li',function(){
        $(this).addClass('sel_attr');
        $(this).siblings('li').removeClass('sel_attr');
    })
    addnumber = function(){
        $('#num').val(parseInt($('#num').val())+1);
        $(".less").css({color:'#252c41'});
        refresh_price(); 
    }
    minnumber = function(){
        if($('#num').val() > 1){
            $('#num').val(parseInt($('#num').val())-1);
            $(".less").css({color:'#252c41'});
            refresh_price();
        }else{
            $(".less").css({color:'#dddfe6'});
        }
    }
    inputnumber = function(){
        var number=parseInt($('#num').val());
        if(isNaN(number)||number < 1){
            $('#num').val('1');
            refresh_price();
        }else if(number > 1){
            $('#num').val(number);
        }
        refresh_price();
    }
    // 刷新价格
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name=\'combo_id\'], #act, input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
            if(json.ret)
            {
                $("#price").html(json.total);
                $("input[name='price']").val(json.total);
            }
            else{
                alert(json.msg)
            }
            },
            error: function(xhr, ajaxOptions, thrownError) {
            }
        });
    }
    $('#buyItNowBtn').click(function(){
    	var url = "/checkout.php?";
    	// 数量
        var count = parseInt($('input#num').val()) || 1;
        url = url + "count="+count;
        // 产品ID
        var comb_id = $('input[name="combo_id"]').val();
        var productId = $('input[name="product_id"]').val();
        url = url + "&combo_id="+comb_id + '&product_id=' + productId;

        var prototype = [];
        if(comb_id == 0){
        	$('.sel_attr').map(function(index,item){
        		var g = $('.attr_mnu').eq(index).attr('for');
        		var a = $('.sel_attr').eq(index).val();
        		prototype.push(g+'-'+a);
        	})
        	url = url + "&proto="+prototype.join('|');
        }else{
        	$('.goods[combo_id="'+ comb_id +'"]').map(function(index,item){
        		var g = $('.goods[combo_id="'+ comb_id +'"]').eq(index).attr('goods_id');
        		var p = $('.goods[combo_id="'+ comb_id +'"]').eq(index).attr('group_id');
        		var a = $('.goods[combo_id="'+ comb_id +'"]').eq(index).find('.sel_attr').val();
        		prototype.push(g+'-'+p+'-'+a);
        	})
        	url = url + "&proto="+prototype.join('|');
        }
        if(comb_id == undefined || comb_id == null || comb_id == ''){
            alert("下記商品リストからご希望の商品をお選びください。");
        }else if(comb_id != undefined){
            window.location.href = url;
        }
    })
    $('#toplink').click(function(){
    	$(window).scrollTop(0,0);
    });
    function CountDown(){
        var len = $('.usp-header ul').find('li').length;
        var dom = $('.usp-header ul').find('li');
        var i = 0;

        setInterval(function(){
            dom.eq(i).css({'display':'none','position':'relative'});
            dom.eq(i).animate({'opacity':'0'});
            i = ++i == len ? 0 : i;
            dom.eq(i).css({'display':'block','position':'relative'});
            dom.eq(i).animate({'opacity':'1'});
        },2000);
    }
    CountDown();
})
})