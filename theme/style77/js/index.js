require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next'
    });
    var video = document.getElementById("video");
    if(video){
        video.addEventListener("play", function () {
            mySwiper1.stopAutoplay();
        }, false);
        $(".swiper-container").on("touchmove", function () {
            video.pause();
        });
        $(".swiper-container").on("mouseup", function () {
            video.pause();
        });

        $(".swiper-button-prev").on("click", function () {
            video.pause();
        })
        $(".swiper-button-next").on("click", function () {
            video.pause();
        });
        $(document).scroll(function () {
            var top = $(document).scrollTop();
            var h = $("header").outerHeight() + $("#video").height();
            if (top > h) {
                video.pause();
            }
        });
    }
    
})

//返回顶部
$(window).on('scroll',function(){
    var minscroll = $('section .buy_now').offset().top+40;
    if ($(document).scrollTop()>minscroll) {
        $('footer').show();
    }else{
        $('footer').hide();
    }
})
$('.top').on('click',function(){
    $('html, body').animate({scrollTop:0}, 'slow');
})

require(['commentsScroll', 'gallery']);