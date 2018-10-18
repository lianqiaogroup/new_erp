require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'bullets',
        uniqueNavElements:false
        // paginationCustomRender: function(swiper, current, total) {
        //     var text = "";
        //     text = '<span class="swiper-pagination-current">' + current + ' / <span class="swiper-pagination-total">'+ total +'</span>';
        //     return text;
        // }
    });
    //倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
})
//显示详情图片
$('.product_info h2').on('click',function(){
    $('.m-img').fadeToggle();
})

// 显示属性层
var screenWidth = $(window).width();
$('#page-order').css('left',screenWidth);

//隐藏属性层
$('.title span').on('click',function(){
    $('#page-order').animate({left:screenWidth},500);
    $('#page-order').hide(400);
    $('#page-index').css('display','block');
})

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#region_code").val();
//泰国地区加入fb三个事件；
if ( region_code == 'Rp') {
    //fb加入购物车事件
    $('[data-cuckootag="buy_now"]').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
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
    })
};