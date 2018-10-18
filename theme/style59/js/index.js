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
    // widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
    var minHeight = $('.product_info').offset().top;
    $(window).on('scroll',function(){
        var scroll = $(window).scrollTop();
        if(scroll>=minHeight){
            $('.detail_tt').addClass('fixed');
            $('.top').fadeIn();
        }else{
            $('.detail_tt').removeClass('fixed');
            $('.top').fadeOut();
        }

    })

    $('.close').on('click', function(event) {
        $('.attr_contant').animate({bottom:-$('.attr_contant').height()},500);
        //$('.attr_contant').css('bottom',0);
           $('.shade').delay(400).hide(0);
    })
})

//点赞
$('.heart').on('click',function(){
    if (!$(this).hasClass('fill')) {
        var heart = $('.praise').html();
        heart = parseInt(heart) +1;
        $('.praise').html(heart);
    }
    $(this).addClass('fill');
})
//切换选项卡
$('.detail_tt li').on('click',function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
})
$('.top').on('click',function(){
    $('body').animate({scrollTop:'0'},'slow');
})