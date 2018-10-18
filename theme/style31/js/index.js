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
    //倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
})
//详情图片的显示与隐藏
$('.title span').on('click',function(){
    $('.m-img').fadeToggle();
})

var screenWidth = $(window).width();
function showAttr(){
    if(parseInt(screenWidth)>640){
        var left = (parseInt(screenWidth) - 640)/2 +'px';
    }else{
        var left = 0;
    }
    $('#page-order').css('left','100vw').show().animate({'left':left},500);
    $('#page-index').hide();
}
//隐藏属性
$('.back').on('click',function(){
    $('#page-order').animate({left:'100vw'},500).delay(400).hide(0);
    $('#page-index').delay(400).show(0);
})

//返回頂部
//alert($(window).scrollTop());
var screenHeight = $(window).height();
window.onscroll = function(){
    if ($(window).scrollTop()>=screenHeight) {
        $('.top').show();
    }else{
        $('.top').hide();
    }
}
$('.top').on('click',function(){
     //$(window).scrollTop()
    //var sc=$(window).scrollTop();
   $('body,html').animate({scrollTop:0},500);
})