require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'bullets',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            text = '<span class="swiper-pagination-current">' + current + ' / <span class="swiper-pagination-total">'+ total +'</span>';
            return text;
        }
    });
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
$('.top a').on('click',function(){
    $('html, body').animate({scrollTop:0}, 'slow');
})
//切换选项卡
$('.tab_bar li').on('click',function(){
    var index = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    $('.details > .tab').hide();
    $('.details > .tab').eq(index).show();
    console.log($('.details > .tab').length)
})
//无属性的时候隐藏选择属性
// if ($('section[data-loopindex]').children().length == 0){
//     $('.attr').css('display','none');
// }
$('.attr > span').on('click',function(){
    if ($(this).hasClass('show')) {
        $(this).removeClass('show');
        $('.dt-paramselect').fadeOut();
    }else{
        $(this).addClass('show');
        $('.dt-paramselect').fadeIn()
    }
})