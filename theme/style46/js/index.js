require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next',
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            text = '<span class="swiper-pagination-current">' + current + ' of <span class="swiper-pagination-total">'+ total +'</span>';
            return text;
        }
    });
})
$('.title').on('click',function(){
    if ($(this).hasClass('show')) {
        $(this).removeClass('show');
        $(this).next().fadeOut();
    }else{
        $(this).addClass('show');
        $(this).next().fadeIn();
    }
})
//订单查询
$('.order_inquiry').on('click',function(){
    var url = '/order_quality.php';
    window.location.href = url;
})
//返回顶部
$(window).on('scroll',function(){
    var minscroll = $(window).height();
    if ($(document).scrollTop()>minscroll) {
        $('.top').show();
    }else{
        $('.top').hide();
    }
})
$('.top').on('click',function(){
    $('html, body').animate({scrollTop:0}, 'slow');
})
//添加评论
$('.comment_button').on('click',function(){
    $('#add_comment').fadeIn();
})
//关闭添加评论
$(".close").on('click',function(){
    $('#add_comment').fadeOut();
})
//评论满意度
$('span.right span').on('click',function(){
    var index = $(this).index();
    $('span.right span').removeClass('star');
    for (var i = 0; i<=index;i++) {
        $('span.right span').eq(i).addClass('star');
    }
})