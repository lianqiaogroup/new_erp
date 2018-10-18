//删除元素
var screenWidth = parseInt($(window).width());
if(screenWidth > 1000){
    $('.panel-small').remove()
}else{
    $('.panel-large').remove()
}
require(['jquery', 'swiper','widget'],function(){

	// 倒计时模块
    +(function(){
        var interval = 1000;
        var deadline_date = $('#timer').attr('data-value');
        var time_step = $('#timer').attr('data-step') || '8';
        // reset
        function resetDate(){
            var _currentTime = new Date().getTime()+28800000+(parseInt(time_step)*3600*1000);
            var _currentDate = new Date();
                _currentDate.setTime(_currentTime);
                _currentDate = _currentDate.toISOString().replace('T',' ');
                _currentDate = _currentDate.replace(/\.[0-9a-zA-Z]*/g,'');
            deadline_date = _currentDate;
            $('#timer').attr('data-value', deadline_date);
        }
        // module core
        function ShowCountDown() {
            var deadline = Date.parse(deadline_date);
            var now = new Date().getTime();
            if( deadline <= now ){
                resetDate();
                deadline = Date.parse(deadline_date);
            }
            var leftTime = deadline - now;
            var leftsecond = parseInt(leftTime/1000);
            var day1=Math.floor(leftsecond/(60*60*24));
            var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
            var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
            var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
            $('#timer').html("<span id='h'>"+0+hour+"</span>"+"<span class='colon'>:</span>"+"<span id='m'>"+minute+"</span>"+"<span class='colon'>:</span>"+"<span id='s'>"+second+"</span>"+"<span class='colon'></span>");
        }
        deadline_date=='' && resetDate();
        ShowCountDown();
        window.setInterval(function(){ ShowCountDown(); }, interval);
    })();



    
	var mainSwiper = new Swiper('.main_swiper',{
		autoplay:3000,
		roundLengths : true,
		pagination:'.swiper-pagination',
		paginationType:'custom',
		paginationCustomRender:function(swiper,current,total){
			var text = '';
			for(var i = 1;i<=total;i++){
				if(i == current){
					text += '<span class="active-nav"></span>'
				}else{
					text += '<span></span>'
				}
			}
			return text;
		}
	});
	var controlSwiper = new Swiper('.control_swiper',{
		spaceBetween :10,
		centeredSlides:true,
		slidesPerView:'auto',
		roundLengths : true,
		slideToClickedSlide: true
	});
	mainSwiper.params.control = controlSwiper;
	controlSwiper.params.control = mainSwiper;
	if($('.comment_swiper').length != 0){
		var commentSwiper = new Swiper('.comment_swiper',{
			spaceBetween :10,
			slidesPerView: 'auto',
			roundLengths : true,
		});
	}


	$('.buy_now').on('click',function(){
		$('.dt-paramselect').show().animate({'bottom':'0'},500);
		$('.cover').show();
	})
	$('.cover').on('click',function(){
		$('.dt-paramselect').animate({'bottom':'-100vh'},500).hide(400);
		$('.cover').delay(400).hide(0);
	})


	//已售百分比
	function percent(){
	    var sales = parseInt($('.progress').attr('data-value'));
	    var stock = parseInt($('.progress div').attr('data-value'));
	    var cent =(sales/(sales+stock)*100).toFixed(0)+'%';
	    $('.progress div').css('width',cent);
	}
	percent();

	// 套餐初始化
	// $("#comb .tab").eq(0).addClass('tab-sel').find('input').prop("checked", 'true');
	
	refresh_price();
	//限制套餐数量
	is_single = $('#comb .tab').attr('single_c');
    if (is_single == 1) {
        $('.m-selnum').hide();
    }
	setCombPrototypeInit(1);

	//点击选择产品
	 $("#comb .tab").click(function(event) {
        event.preventDefault();
        /* Act on the event */
        is_single = $(this).attr('single_c');
        if (is_single == 1) {
            $('.m-selnum').hide();
        }else{
            $('.m-selnum').show();
        }
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).find('input').prop("checked", 'true');
        $(this).siblings().find('input').attr("checked", false);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        refresh_price();
        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);    
    });
	 //点击选择属性
	 $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        var src = self.attr('data-img');
        if( src ){ $('#attrimg').attr('src', src); }
        //当前选择属性
        var cur_choose = self.parents('.tc').find('.tab-sel');
        var attrs = [];
        cur_choose.map(function(item,elem){
        	attrs.push($(elem).attr('data-name'));
        })
        self.parents('.tc').prev('.title_ac').find('span').html(attrs.join(','));
        var data_index = self.parents('section').attr('data-loopindex');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').find('input').attr("checked", 'true');
    });

	 $('.confirm button').on('click',function(){
	 	postcheckGuige();
	 })
	 $('.more').on('click',addnumber);
	 $('.less').on('click',minnumber);

	function addnumber(){
	    $('#num').val(parseInt($('#num').val())+1);
	    $('.textWrap .num').html($('#num').val()); 
	    refresh_price();
	}

	function minnumber(){
	    if($('#num').val() > 1){
	        $('#num').val(parseInt($('#num').val())-1);
	        $('.textWrap .num').html($('#num').val());
	        refresh_price();
	    }
	}
	//显示评论
	$('.head a').on('click',function(){
		$('.page-index').show();
		$('.comment').hide();
	})
	$('.view_all').on('click',function(){
		$('.page-index').hide();
		$(document).scrollTop(0);
		$('.comment').show();
	})

	//星星
	$('.stars').each(function(){		
		var starNum = parseInt($(this).attr('data-num'));
		for(var i=starNum;i<5;i++){
			$(this).find('span').eq(i).addClass('grey');
		}
	})
	$('.comment_item').each(function(){
		var addTime = $(this).find('[data-buytime]').attr('data-buytime');
		$(this).find('[data-buytime] span').html(calcDay(addTime));
	})

	//计算距离当前时间多少天
	function calcDay(time1){
		time1 = Date.parse(new Date(time1));
	    time2 = new Date();
	    return day = Math.abs(parseInt((time2 - time1)/1000/3600/24));
	}
	function setCombPrototypeInit(sectionIndex){
	    $('section[data-loopindex]').hide();
	    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
	    section.find('.tc').each(function(){
	    	var text = [];
	    	var self = $(this);
	    	self.find('li.protoLayer').each(function(){
	    		if($(this).find('.tab').length == 1){
			        var current = $(this).find('.tab').removeClass('tab-sel').eq(0).addClass('tab-sel');
			        text.push($(this).find('.tab-sel').attr('data-name'));
			        self.prev().find('span').html(text.join())
			        var id = current.attr('data-id');
			        $(this).find('.u-format.count_atrr').attr('data-select', id);
			    }
		    });
	    })
	    if(section.find('li.protoLayer').length == section.find('.tab-sel[data-name]').length){
            $('#comb .tab').eq(sectionIndex-1).addClass('tab-sel').find('input').attr("checked", 'true');
        }
	    $('.combo_tt span').html($(".dt-paramselect .tab-sel .text_this").html());
	}
	// 提交表单
	function postcheckGuige() {
	    var url = "/checkout.php?";

	    // 数量
	    var count = parseInt($('input#num').val()) || 1;
	    url = url + "count="+count;

	    // 产品ID
	    var comb_id = $("#comb .tab-sel").find('input').val();
	    var productId = $('input[name="product_id"]').val();
	    url = url + "&combo_id="+comb_id + '&product_id=' + productId;
	    
	    /* Act on the event */
	    var prototype = [];
	    var loop = $('#comb .tab-sel').attr('data-loopIndex') ? $('#comb .tab-sel').attr('data-loopIndex') : 1;
	    var attr = $('section[data-loopIndex="'+ loop +'"] ').find('.u-format.count_atrr');
	    if( attr.length > 0 ){
	        attr.each(function(){
	            var groupId = $(this).attr('data-group');
	            var prototypeId = $(this).attr('data-select');
	            if( parseInt(prototypeId)>0 ){
	                prototype.push(groupId+"-"+prototypeId);
	            }
	        });
	        if( prototype.length < attr.length ){
	            var error = $('.page-index').attr('data-error')?$('.page-index').attr('data-error'):$('.panel-large').attr('data-error')
	            alert(error);
	            return false;
	        }
	        url = url + "&proto="+prototype.join('|');
	    }
	    // 跳转
	    window.location.href = url;
	    return false;
	}
	function refresh_price() {
	    $.ajax({
	        url: '/checkout.php?',
	        type: 'post',
	        data: $('input[name=combo_id]:checked, #act, input[name=\'num\']'),
	        dataType: 'json',
	        success: function(json) {
	           if(json.ret){
	                $('combprice').html(json.total);
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

})
if($(window).width()>1000){
    var comment_num = $('.comment_item').length;
    var page = Math.ceil(comment_num/5);
    if(page<10){
        for(var i=0;i<page;i++){
            $('.panel-large .page_wrap').append('<div class="page">'+ (i+1) +'</div>')
        }
    }else{
        $('.panel-large .page_wrap').append('<div class="pre">《</div><div class="page">1</div><span class="dot"> ... </span><div class="small page">5</div><div class="page">6</div><div class="large page">7</div><span class="dot"> ... </span><div class="page">'+ page +'</div><div class="next">》</div>');
    }
    $('.panel-large .page_wrap .pre').on('click',function(){
        turnPage(false);
    })
    $('.panel-large .page_wrap .next').on('click',function(){
        turnPage(true);
    })
    $('.panel-large .page_wrap .page').on('click',function(){
        $(this).addClass('action').siblings().removeClass('action');
        showComment(parseInt($(this).html())-1);
    })
    showComment(0);
    $('.page').eq(0).addClass('action');

    

    function showComment(p) {
        var start = 5*p;
        var end = comment_num<(p+1)*5?comment_num:(p+1)*5;
        $('.panel-large .comment_item').hide();
        for(var i=start;i<end;i++){
            $('.panel-large .comment_item').eq(i).show();
        }
    }
    function turnPage(turnNext){
        var small = parseInt($('.small.page').html());
        $('.dot').show();
        //turnNext : true =>next
        if(turnNext){
            small = small>=page-3?page-3:small+3;
        }else{
        //turnNext : false =>pre
            small =small<=2?2:small-3;
        }
        $('.dot').eq(0).next().html(small).next().html(small+1).next().html(small+2);
        if(small<=2){
            $('.dot').eq(0).hide();
            return false;
        }else if(small>=page-3){
            $('.dot').eq(1).hide();
            return false;
        }
        $('.small.page').next().addClass('action').siblings().removeClass('action');
        showComment(small);
    }
}
$(document).ready(function(){
	var host = window.location.host;
	$('.copyright span').html(host.match(/^www\.(\S*)\./)[1]);
})

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#region_code").val();
//台湾、香港加入fb三个事件；
if (region_code == 'TW' || region_code == 'HK') {
    //fb加入购物车事件
    if ($(".buy_now").length>0){//移动端
        $(".buy_now").on('click', function () {
            if (fbqstatus.AddToCart == 0) {
                fbq('track', 'AddToCart');
                fbqstatus.AddToCart++;
            };
        });

        $('.confirm').on('click', function () {
            judge();
        })
    }else{//PC端
        $('.confirm').on('click', function () {
            if (fbqstatus.AddToCart == 0) {
                fbq('track', 'AddToCart');
                fbqstatus.AddToCart++;
            };
        });
        //fb发起结账事件
        var list = $('.con .tab');
        list.on("click", function () {
            judge();
        });
    }
   
    function judge() {
        if (fbqstatus.InitiateCheckout == 0) {
            fbq('track', 'InitiateCheckout');
            fbqstatus.InitiateCheckout++;
        };
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    }
    
};

var payInfo = true;
$('input[name="name"]').on("keydown", function () {
    if (payInfo) {
        fbq('track', 'AddPaymentInfo');
        payInfo = false;
    };
});