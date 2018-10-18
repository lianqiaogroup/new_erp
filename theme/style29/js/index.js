require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: true,
        autoHeight:true,
        paginationType: 'custom'
    });

    //倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
})

//进度条
function percent(){
    var sales = parseInt($('.process').attr('data-value'));
    var stock = parseInt($('.process span').attr('data-value'));
    var cent =(sales/(sales+stock)*100).toFixed(0)+'%';
    $('.process span').css('width',cent);
    $('.percent').html(cent);
}
percent();
// 显示属性层
var screenWidth = $(window).width();
$('#page-order').css('left',screenWidth);
$('#val-sel').on('click',function(){
        $('#page-order').show();
        if(parseInt(screenWidth)>640){
            var order_left = (parseInt(screenWidth)-640)/2+'px';
            $('#page-order').animate({left:order_left},500);
        }else{
            $('#page-order').animate({left:0},500);
        }
        $('#page_index').delay(400).hide(0);
        $('#add').addClass('ok');
})
//隐藏属性层
$('.back').on('click',function(){
    $('#page-order').animate({left:screenWidth},500);
    $('#page-order').hide(400);
    $('#page_index').css('display','block');
})
$('.top').on('click',function(){
    // $('body').animate({scrollTop:0})
    $(window).scrollTop(0);
})