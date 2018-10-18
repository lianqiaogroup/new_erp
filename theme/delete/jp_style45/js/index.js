TouchSlide({ slideCell:"#slider" });


var myDate = new Date();
var date2 = new Date();
	myDate.setDate(myDate.getDate()+5);
	date2.setDate(date2.getDate()+8);
var arrival_time = (myDate.getMonth()+1) + '/' + myDate.getDate() + '-' + (date2.getMonth()+1) + '/' + date2.getDate();
$('#timer').html(arrival_time);


$('.switchTab li a').click(function(event) {
	var tabName = $(this).attr('href');
	$('.switchTab li').removeClass('current');
	$(this).parent().addClass('current')
	$('.tabInner').removeClass('current');
	$(tabName).addClass('current');

});
$(document).ready(function(){
	//
	var domstr = '<section id="zoom-layer"> <div class="zoom-boxer"> <div class="zoom-bd"> <img src="public/image/videoPlay.jpg" id="zoom-img" class="zoom-img"> </div> </div> </section>';
	var css = '<style type="text/css"> #zoom-layer {display: none; position: fixed; left: 0px; top: 0px; bottom: 0px; right: 0px; background-color: rgba(0,0,0,0.7); z-index: 99999; max-width: 640px; height: 100%; margin: 0 auto; } #zoom-layer .zoom-boxer {display: table; width: 100%; max-width: 100%; height: 100%; } #zoom-layer .zoom-boxer .zoom-bd {width: 100%; overflow: hidden; display: table-cell; text-align: center; vertical-align: middle; } #zoom-layer .zoom-boxer .zoom-bd img {max-width: 95%; } </style>';
	$("body").append(css).append(domstr);
	var zoom = $('#zoom-layer');
	$(document).on('click', '[data-zoom-img]', function(event) {
		/* Act on the event */
		var src = $(this).attr('src');
		if( src!="" ){
			zoom.find('.zoom-img').attr('src', src);
			zoom.fadeIn();
		}
	});
	zoom.click(function(event) {
		$(this).fadeOut();
	});
	refresh_price();
	//
	$(window).scroll(function(){
		var top = $(window).scrollTop();
		if(top > 800){
			$('.pageTop').css("opacity","1");
		}else{
			$('.pageTop').css("opacity","0");
		}
	});
	$('.pageTop').click(function(){
		window.scrollTo(0,0);
	});
	var scrolltop = $(window).scrollTop();
	$('#buynow').click(function(){
		if($(this).hasClass('okNow')){
			checkattr();
		}else{
		scrolltop = $(window).scrollTop();
			$('.modal').show();
			$('#index').css('margin-top',-scrolltop);
			$('#index').addClass('over');
			$('.modalDialog').animate({opacity:1,marginTop:'30px'});
		}
	});
	var comid = $('#combo').find('.action').attr('rel') || 0;
	$('input[name="combo_id"]').val(comid);
	$('.comItem[comboid="'+ comid +'"]').show();
	singleCombo();
	$('#combo').on('click','li',function(){
		$('#combo li').removeClass('action');
		$(this).addClass('action');
		comid = $(this).attr('rel');
		$('input[name="combo_id"]').val(comid);
		$('.comItem').hide();
		$('.comItem[comboid="'+ comid +'"]').show();
		refresh_price();
		singleCombo();
	});
	$('.comItem').on('click','li',function(){
		$(this).siblings().removeClass('action');
		$(this).addClass('action');
	});
	$('.modalClose').click(function(){
		$('#index').removeAttr('style');
		$('#index').removeClass('over');
		$('.modal').fadeOut();
		window.scrollTo(0,scrolltop);
		$('#buynow').addClass('okNow');
	});
	$('#checkout').click(function(){
		checkattr();
	});
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
    //套餐是否可选数量
	function singleCombo(){
	    var single_c =  $('#combo').find('.action').attr('single_c');
	    if(parseInt(single_c) == 1){
	        $('#num').val(1);
	        $('#num').parents('.qty').hide();
	    }else{
	        $('#num').parents('.qty').show();
	    }
	}
    // 刷新价格
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name="combo_id"],input[name=\'product_id\'],input[name="act"], input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
            if(json.ret)
            {
                $("#price").html(json.total);
                //$("input[name='price']").val(json.total);
            }
            else{
                alert(json.msg)
            }
            },
            error: function(xhr, ajaxOptions, thrownError) {
            }
        });
    }
	function checkattr(){
		var comoid = $('input[name="combo_id"]').val();
		var proption = [];
		if(comoid != 0){
			var len = $('.comItem[comboid="'+ comid +'"]').length;
			for(var i = 0; i < len ; i ++){
				var goodid = $('.comItem[comboid="'+ comid +'"]').eq(i).attr('goodid');
				var groupid = $('.comItem[comboid="'+ comid +'"]').eq(i).attr('groupid');
				var attrid = $('.comItem[comboid="'+ comid +'"]').eq(i).find('.action').attr('attrid');
				proption.push(goodid+'-'+groupid+'-'+attrid);
			}
		}else{
			comoid = 0;
			var len = $('.comItem[comboid="'+ comid +'"]').length;
			for(var i = 0; i < len ; i ++){
				var groupid = $('.comItem[comboid="'+ comid +'"]').eq(i).attr('groupid');
				var attrid = $('.comItem[comboid="'+ comid +'"]').eq(i).find('.action').attr('attrid');
				proption.push(groupid+'-'+attrid);
			}
		}
		console.log(comoid);
		var url = '/checkout.php?';
		var count = $('input[name=\'num\']').val();
		var productId = $('input[name="product_id"]').val();
		url = url + "count="+ count + "&combo_id="+ comoid + '&product_id=' + productId + "&proto="+proption.join('|');
		window.location.href = url;
	}
})