require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        spaceBetween:10
    });
    $(document).ready(function(){
        if($('#pinlun_content').length != 0){
            change();
            window.onload=function(){
                change();
            }
            window.onresize=function(){
                change();
            }
        }
    });

})
// 显示属性层
var screenWidth = $(window).width();
$('#page-order').css('left',screenWidth);
$('#val-sel').on('click',function(){
		$(document).scrollTop(0);
        $('#page-order').show();
        if(parseInt(screenWidth)>640){
            var order_left = (parseInt(screenWidth)-640)/2+'px';
            $('#page-order').animate({left:order_left},500);
        }else{
            $('#page-order').animate({left:0},500);
        }
        $('#page-index').delay(400).hide(0);
})
//隐藏属性层
$('.back').on('click',function(){
    $('#page-order').animate({left:screenWidth},500);
    $('#page-order').hide(400);
    $('#page-index').css('display','block');
})
//进度条
function percent(){
    var sales = parseInt($('.progress').attr('data-value'));
    var stock = parseInt($('.progress span').attr('data-value'));
    var cent =(sales/(sales+stock)*100).toFixed(0)+'%';
    $('.progress span').css('width',cent);
}
percent();
$(".cover").click(function(){
    var that = $(this).clone();
    $('.layer-main').html('').append(that);
    $('.layer_com').show();
    $('body').addClass('overflow');
});
$(".close-btn").click(function(){
    $('.layer_com').hide();
    $('body').removeClass('overflow');
});
$('.userev').click(function(){
    if($('#pinlun_tt').length != 0){
        var h = $('#pinlun_tt').offset().top;
        $('html,body').scrollTop(h);
    }
})


if(parseInt($('#pinlun_content li').length)<=6){
    $('#loadMore').hide();
}
$('#loadMore').click(function(){
    var dom = $('li[datashowid]').length;
    if(parseInt(dom) > 6){
        for(var l = 0 ; l < 6;l++){
            $('li[datashowid]').eq(l).show();
        }
        for(var l = 0 ; l < 6;l++){
            $('li[datashowid]').eq(0).removeAttr('datashowid');
        }
    }else{
        if(parseInt(dom) != 0){
            for(var l = 0 ; l < dom;l++){
                $('li[datashowid]').eq(l).show();
            }
            $('#loadMore').hide();
        }
    }
    change();
})
//瀑布流评论
var fall=document.getElementById("pinlun_content");
if(fall){
    function change(){
        var lis=fall.getElementsByTagName("li");
        var lis_W=lis[0].offsetWidth;
        var windowCW = document.getElementById("pinlun_content").offsetWidth;
        var n = Math.round(windowCW/lis_W);
        var arrH = [];

        for(var i=0;i<lis.length;i++){
            var j = i%n;
            if (arrH.length == n) {
                var min = findMin(arrH);
                lis[i].style.left = min*(lis_W) +"px";  
                lis[i].style.top = arrH[min]+10 + "px";
                arrH[min] += lis[i].offsetHeight + 10;
            }else{
                arrH[j] = lis[i].offsetHeight;        
                lis[i].style.left = lis_W*j+j + "px";
                lis[i].style.top = 0;
            }
            var max=0;
            for(var b=0;b<arrH.length;b++){
                max = Math.max(arrH[max],arrH[b]) == arrH[max] ? max : b;
            }
            fall.style.height= arrH[max]+'px';
        }
        function findMin(arr) {
            var m = 0;
            for (var i = 0; i < arr.length; i++) {
                m = Math.min(arr[m], arr[i]) == arr[m] ? m : i;
            }
            return m;
        }
    }
}

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#region_code").val();
//泰国地区加入fb三个事件；
if (region_code == 'THA' || region_code == 'Rp') {
    //fb加入购物车事件
    $('[data-cuckootag="buy_now"]').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    });
    //fb发起结账事件
    $('[data-cuckootag="confirm_arrtibute"]').click(function(){
        if (fbqstatus.InitiateCheckout == 0) {
            fbq('track', 'InitiateCheckout');
            fbqstatus.InitiateCheckout++;
        };
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    })
};