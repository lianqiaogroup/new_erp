require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var clientwidth = $(window).width();
    var main = new window.Swiper('.main', {
        spaceBetween: 15,
        pagination: '.swiper-pagination',
        paginationType :'bullets'
    });
    var page = new window.Swiper('.page', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
    });
    main.params.control = page;
    page.params.control = main;
})
$(window).on('scroll',function(){
    var minscroll = $('.page').offset().top;
    if ($(document).scrollTop()>minscroll) {
        $('.header_fixed').css('top','0');
    }else{
        $('.header_fixed').css('top','-78px');
    }
})