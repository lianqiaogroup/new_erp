require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
    });
//倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
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