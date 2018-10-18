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
    //widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
})
//显示温馨提示
$('.service .right').on('click',function() {
    if ($(this).hasClass('down')) {
        $('.service_detail').css('display','none');
        $(this).removeClass('down');
    }else{
        $('.service_detail').css('display','block');
        $(this).addClass('down');
    }
})

//进度条
function percent(){
    var sales = parseInt($('.process').attr('data-value'));
    var stock = parseInt($('.process span').attr('data-value'));
    var cent =(sales/(sales+stock)).toFixed(2)*100+'%';
    $('.process span').css('width',cent);
}
percent();

//显示最新购买和浏览量

var marquee = "張**（095***6831）在2分鐘前購買了此產品";

function show() {
    $('#fahuo').fadeIn();
    $('#fahuo').delay(3000).fadeOut();
}
function buyshow(){
    $('#fahuo span').html(marquee);
    $('#fahuo').fadeIn();
    $('#fahuo').delay(3000).fadeOut();
}
window.setTimeout(show,3000);
window.setTimeout(buyshow,20000);

//返回顶部
$(window).on('scroll',function(){
    var minscroll = $(".swiper-container").height()+$(".message").height()+$(".detial").height();
    if ($(document).scrollTop()>minscroll) {
        $('.top').fadeIn();
    }else{
        $('.top').fadeOut();
    }
})
$('.top').on('click',function(){
    //$(window).scrollTop(0)
    $('html, body').animate({scrollTop:0}, 'slow');
})

//显示送达时间
var myDate = new Date();
myDate.setDate(myDate.getDate()+7);
var date2 = new Date();
date2.setDate(date2.getDate()+14);
/*var arrival_time = '現在下單預計'+ (myDate.getMonth()+1) + '/' + myDate.getDate() + '-' + (date2.getMonth()+1) + '/' + date2.getDate()+'日送達'
$('.arrival_time').html(arrival_time)*/


var screenHeight = $(window).height();
function showAttr(){
    $('#page-order').css('top',screenHeight).show().animate({top:0},500);
    $('#page-index').delay(400).hide(0);
};
//隐藏属性
$('.close').on('click',function(){
    $('#page-order').animate({top:screenHeight},400).delay(400).hide(0);
    $('#page-index').show();
});

//剩余时间
function leftTimer(year,month,day,hour,minute,second){ 
  var leftTime = (new Date(year,month-1,day,hour,minute,second)) - (new Date()); //计算剩余的毫秒数 
  var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数 
  var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
  var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
  var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
  days = checkTime(days); 
  hours = checkTime(hours); 
  minutes = checkTime(minutes); 
  seconds = checkTime(seconds); 
  setInterval("leftTimer(2018,7,31,23,59,59)",1000); 
  document.getElementById("timer2").innerHTML = days+"天" + hours+"時" + minutes+"分"+seconds+"秒";  
} 
function checkTime(i){ //将0-9的数字前面加上0，例1变为01 
  if(i<10) 
  { 
    i = "0" + i; 
  } 
  return i; 
}
leftTimer(2018,7,31,23,59,59);