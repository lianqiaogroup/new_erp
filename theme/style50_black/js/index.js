// TouchSlide({ slideCell:"#slider" });
// var lilen = $('#slider').find('li').length;
// if(lilen > 1){
//     TouchSlide({
//         slideCell:"#secMainImg",//（产生轮播效果的包裹元素）
//         mainCell:"#slider ul",//（产生轮播效果的元素）
//         autoPlay:true,//（自动分页）
//         effect:"leftLoop" //（左循环滚动）
//     });
// }


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

    $('.buyone').click(function(){
        var url = "/checkout.php?";
        var count = parseInt($('input#num').val()) || 1;
        var productId = $('input[name="product_id"]').val();
        url = url + "count="+count + '&product_id=' + productId;
        // 产品ID
        url = url + "&combo_id=" + 0;
        /* Act on the event */
        var prototype = [];
        if( $('.action[attrkey]').length > 0 ){
            $('.action[attrkey]').each(function(){
                var groupId = $(this).attr('data-number');
                if(groupId != ''){
                    prototype.push(groupId);
                }
            });
            if(prototype.length == $('.attrlist').length){
                url = url + "&proto="+prototype.join('|');
                window.location.href = url;
            }else{
                alert("กรุณาเลือกสินค้า");
            }
        }else{
            if($('input[name="attrs"]').val() == 0){
                window.location.href = url;
            }else{
                alert("กรุณาเลือกสินค้า");
            }
        }
        // 跳转
        
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
    $('.buyflex').click(function() {
        var top = $('.tip_small').offset().top;
        var url = "/checkout.php?";
        var count = parseInt($('input#num').val()) || 1;
        url = url + "count="+count;
        // 产品ID
        url = url + "&combo_id=" + 0;
        /* Act on the event */
        var prototype = [];
        if( $('.action[attrkey]').length > 0 ){
            $('.action[attrkey]').each(function(){
                var groupId = $(this).attr('data-number');
                if(groupId != ''){
                    prototype.push(groupId);
                }
            });
            if(prototype.length == $('.attrlist').length){
                url = url + "&proto="+prototype.join('|');
                window.location.href = url;
            }else{
                $(window).scrollTop(top);
                alert("กรุณาเลือกสินค้า");
            }
        }else{
            if($('input[name="attrs"]').val() == 0){
                window.location.href = url;
            }else{
                $(window).scrollTop(top);
                alert("กรุณาเลือกสินค้า");
            }
        }
    });
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

