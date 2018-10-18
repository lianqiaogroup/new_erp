require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        spaceBetween:10
    });
})
// 显示属性层
var screenWidth = $(window).width();
$('#page-order').css('left',screenWidth);
function showAttr() {
    var w_top = parseInt($(window).scrollTop(),10);
    var w_height = parseInt(window.screen.height,10);
    $(document).scrollTop(0);
    $('#page-order').show();
    if(parseInt(screenWidth)>640){
        var order_left = (parseInt(screenWidth)-640)/2+'px';
        $('#page-order').animate({left:order_left},500);
    }else{
        $('#page-order').animate({left:0},500);
    }
    $('#page-index').delay(400).hide(0);
};
//隐藏属性层
$('.back').on('click',function(){
    $('#page-order').animate({left:screenWidth},500);
    $('#page-order').hide(400);
    $('#page-index').css('display','block');
})
//进度条
function percent(){
    var sales = parseInt($('.progress').attr('data-value'));
    var stock = parseInt($('.progress span').attr('data-value'));
    var cent =(sales/(sales+stock)*100).toFixed(0)+'%';
    $('.progress span').css('width',cent);
}
percent();

//分类导航
$('header .ui-icon-scan1').click(function(event) {
    /* Act on the event */
    var bd = $('body');
    var css = 'offcanvas-in';
    !bd.hasClass(css) ? bd.addClass(css) : bd.removeClass(css);
});

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#region_code").val();
//泰国地区加入fb三个事件；
if (region_code == 'TW' || region_code == 'HK') {
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