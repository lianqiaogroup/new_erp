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

$('.product_info .title').on('click',function(){
    if ($(this).hasClass('off')) {
        $(this).next().fadeIn();
        $(this).removeClass('off');
    }else{
        $(this).next().fadeOut();
        $(this).addClass('off');
    }
    
})

//分数
var n1 = parseInt(Math.random()*9+1);
var n2 = parseInt(Math.random()*9+1);
var node = $(".score");
var score1 = '4.'+ n1 + '/5.0';
var score2 = '4.'+ n2 + '/5.0';
node.eq(0).html(score1);
node.eq(1).html(score2);