require(['jquery', 'swiper'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            text = '<div><span class="swiper-pagination-current" id="imgCnt">' + current + ' / <span class="swiper-pagination-total">'+ total +'</span></div>';
            return text;
        }
    });
})


// 计时器
function rnd(n, m){
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;
}
var times = rnd(60, 1200);
var maxtime = parseInt(times) //一个小时，按秒计算，自己调整! 
function CountDown(){
    if(maxtime>=0){ 
        minutes = Math.floor(maxtime/60); 
        seconds = Math.floor(maxtime%60); 
        if (minutes <= 9) minutes = "0" + minutes;
        if (seconds <= 9) seconds = "0" + seconds;
        $('.h').html("00");
        $('.m').html(minutes);
        $('.s').html(seconds);
        --maxtime; 
    } 
    else{ 
        clearInterval(timer); 
        console.log("时间到，结束!");
    } 
} 
timer = setInterval("CountDown()",1000);

//
$(document).ready(function() {
    $('li[attrkey]').click(function(){
        $(this).siblings().removeClass('action');
        $(this).addClass('action');
    });
    $(window).scroll(function(event){
        var height = $(window).scrollTop();
        var top = $('.tip').offset().top;
        var screenHeight = window.screen.height;
        var screenScroll = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
        var alltop = $('.User_notes').offset().top;
        if(height >= top){
            $('.footer').fadeIn();
            if(alltop <= (screenHeight+screenScroll) ){
                $('.m-goToTop').fadeIn();
            }
        }else{
            $('.footer').fadeOut();
            $('.m-goToTop').fadeOut();
        }
    })
    $('.m-goToTop').click(function(){
        $(window).scrollTop(0);
    })
    addnumber = function(){
        $('#num').val(parseInt($('#num').val())+1);
        $(".less").css({color:'#707070'});
        refresh_price(); 
    }
    minnumber = function(){
        if($('#num').val() > 1){
            $('#num').val(parseInt($('#num').val())-1);
            $(".less").css({color:'#707070'});
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
        //refresh_price();
    }
    // 刷新价格
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name="combo_id"], #act, input[name=\'num\']'),
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
})
function postcheckGuige(){
    var url = "/checkout.php?";
    // 数量
    var count = parseInt($('input#num').val()) || 1;
    url = url + "count="+count;

    // 产品ID
    var comb_id = $("#comb .tab-sel").find('input').val();
    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comb_id + '&product_id=' + productId;
    var warn_word = $('.buyone').attr('data-warn');
    /* Act on the event */
    var prototype = [];
    var loop = $('#comb .tab-sel').attr('data-loopindex');
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
            alert(warn_word);
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }
    // 跳转
    window.location.href = url;
    return false;
};
require(['jquery'], function ($){
    // 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        var src = self.attr('data-img');
        if( src ){ $('#attrimg').attr('src', src); }
    });
});
    setCombPrototypeInit(1);
    var is_single = $(".package .tab").eq(0).attr('data-single');
    if(is_single == 1){
        $('.numberbox').hide();
    }
    $('.package').attr('data-price', $(".package .tab-sel").attr('data-price'));
    $('[currentprice]').html($(".package .tab-sel").attr('data-price'));
    // 选择产品
    $(".package .tab").click(function(event) {
        event.preventDefault();
        /* Act on the event */
        $('input[name="num"]').val(1);
        is_single = $(this).attr('data-single');
        if (is_single == 1) {
            $('.numberbox').hide();
        }else{
            $('.numberbox').show();
        }
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).find('input').attr("checked", 'true');
        $(this).siblings().find('input').attr("checked", false);
        $('.package').attr('data-price', $(this).attr('data-price'));
        $('[currentprice]').html($(this).attr('data-price'));

        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);    
    });
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    section.find('li.protoLayer').each(function(){
        if($(this).find('.tab').length == 1){
            var first = $(this).find('.tab').removeClass('tab-sel').eq(0).addClass('tab-sel');
            var id = first.attr('data-id');
            $(this).find('.u-format.count_atrr').attr('data-select', id);
        }
    });
}

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#regionCode").val();
//泰国加入fb三个事件；
if (region_code == 'THA' || region_code == 'HK') {
    //fb加入购物车事件
    $('.btn').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    });

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
    //fb发起结账事件
    var list = $('.con .tab');
    list.on("click", function () {
        judge();
    });
};