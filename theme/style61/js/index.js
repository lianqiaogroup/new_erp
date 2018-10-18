require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'bullets',
    });
//倒计时
    // widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
})
//点赞
$('.heart').on('click',function(){
    var bool = $(this).hasClass('like');
    if (bool) {
        $(this).removeClass('like');
    }else{
        $(this).addClass('like')
    }
})
//订单查询
// $('.query').on('click',function(){
//     var url = '/order_quality.php';
//     window.location.href = url;
// })
//评分
$('.score span').on('click',function(){
    var self = $(this);
    var index = self.index();
    $('.right').show();
    $('.right').html(index+1)
    self.siblings().removeClass('color');
    for(var i = 0;i <= index;i++){
        $('.score span').eq(i).addClass('color');
    }
    var buttonItem = $('#add_comment button');
    buttonItem.removeAttr('disabled');
    buttonItem.addClass('ok');
})
//关闭评论
$('.title span').on('click',function(){
    $(this).parents('section').hide();
    $('#page-index').show();
})
//页面切换
$('.single').on('click',function(){
    var index = $('.single').index(this);
    $('.page').hide().eq(index).show();
    $('#page-index').hide()
})