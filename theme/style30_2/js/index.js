require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            text = '<span class="swiper-pagination-current">' + current + ' / <span class="swiper-pagination-total">'+ total +'</span>';
            return text;
        }
    });
    var video = document.getElementById("video");
    if(video){
        video.addEventListener("play", function () {
            mySwiper1.stopAutoplay();
        }, false);
        $(".swiper-container").on("touchmove", function () {
            video.pause();
        });
        $(".swiper-container").on("mouseup", function () {
            video.pause();
        });
        $(document).scroll(function () {
            var top = $(document).scrollTop();
            var h = $("#video").height();
            if (top > h) {
                video.pause();
            }
        });
    }
    
//倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
})
//图文详情选项卡切换
$('.bTitle span').on('click',function(){
    $(this).siblings().removeClass('select');
    $(this).addClass('select');
})
$('.bTitle .pinglun').on('click',function(){
    $('.pinlun_content').show();
    $('.User_notes').hide();
    $('.m-img').hide();
})
$('.bTitle .info').on('click',function(){
    $('.pinlun_content').hide();
    $('.User_notes').show();
    $('.m-img').show();
})
if ($(".lab p").length <= 0) {
    $(".pinglun").hide();
    $(".bTitle .info").css({width: "48%"});
    $(".bTitle .order_query").css({width: "48%"});
}
//评论大图弹出
$(".msKeimgBox img").click(function (event) {
    var dj = $(this).index();
    var obj = $(this).parent().parent().find('.hidden');
    var onoff = obj.eq(dj).css('display');
    for (var i = 0; i < obj.length; i++) {
        if (i !== dj) {
            obj.eq(i).hide();
        }
    }
    if(onoff == 'none'){
        obj.eq(dj).fadeIn();
    }else{
        obj.eq(dj).fadeOut();
    }
})

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#region_code").val();
//台湾地区加入fb三个事件；
if (region_code == 'TW' || region_code == 'HK') {
    //fb加入购物车事件
    $('[data-cuckootag="buy_now"]').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
        console.log(fbqstatus.AddToCart,fbqstatus.InitiateCheckout)
    });
    //fb发起结账事件
    $('[data-cuckootag="confirm_arrtibute"]').click(function () {
        if (fbqstatus.InitiateCheckout == 0) {
            fbq('track', 'InitiateCheckout');
            fbqstatus.InitiateCheckout++;
        };
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
        console.log(fbqstatus.AddToCart, fbqstatus.InitiateCheckout)
    })
};
