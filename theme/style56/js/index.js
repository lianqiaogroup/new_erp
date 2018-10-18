require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var main = new window.Swiper('.main', {
        spaceBetween: 10,
        pagination: '.swiper-pagination',
        paginationType :'bullets'
    });
    var page = new window.Swiper('.page', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true
    });
    main.params.control = page;
    page.params.control = main;
})
//返回顶部
$(window).on('scroll',function(){
    var minscroll = window.screen.height ;
    if ($(document).scrollTop()>minscroll) {
        $('.top').show();
    }else{
        $('.top').hide();
    }
})
$('.top').on('click',function(){
    $('html, body').animate({scrollTop:0}, 'slow');
})

//订单查询
function custom_check_order(){
    var mob = $('.inquiry_mob').val();
    var identity_tag = $('#identity_tag').val();
    window.widget.goto_checkOrder({
        phone: mob,
        identity_tag: identity_tag
    });
}

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#region_code").val();
if (region_code == 'Rp') {

    $('.aa').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    });
    //fb发起结账事件
    $('[data-cuckootag="confirm_arrtibute"]').on("click",function(){
        if (fbqstatus.InitiateCheckout == 0) {
            fbq('track', 'InitiateCheckout');
            fbqstatus.InitiateCheckout++;
        };
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    });
};
