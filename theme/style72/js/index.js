require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var galleryTop = new window.Swiper('.gallery-top', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        spaceBetween:14,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
    });
    var galleryThumbs = new window.Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
        height:80
    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;
    //倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
    //评论滚动
    var boxer = $('[data-fn=userScroll]');
    var list = $(boxer).children().eq(0);
    var clone = list.clone();
    $(boxer).append(clone);
    var speed = 35;
    function Marquee(){
        if( boxer.scrollTop() - list.height() >= 0 ){
             boxer.scrollTop(0); 
        }else{
             boxer.scrollTop(boxer.scrollTop()+1);
        }
    }
    setInterval(Marquee,speed);
})
//属性折叠
$('.tt').on('click',function(){
    var self = $(this);
    if (self.hasClass('up')) {
        self.next().slideDown();
        self.removeClass('up');
    }else{
        self.next().slideUp();
        self.addClass('up');
    }
})