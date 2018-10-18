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

lazyload();
//点赞
setTimeout(function(){
    $('.like_wrap').show();
},500);
$('.like_shadow').on('click',function(){
    $('.like_wrap').fadeOut();
})
$('.close').on('click',function(){
    $('.like_wrap').fadeOut();
})
//点击选中产品
$('.dxbox').each(function(){
    $(this).find('input[type="radio"]').eq(0).prop('checked',true);
    $(this).find('label').eq(0).addClass('tab-sel');
})
$('.dxbox label').on('click',function(){
    var allItem = $(this).parent().find('label');
    for(var i = 0;i<allItem.length;i++){
        allItem.eq(i).removeClass('tab-sel');
        $(this).addClass('tab-sel');
    }
})
//显示套餐内产品属性
$('.combo').on('click',function(){
    var index = $(this).attr('data-loopindex');
    $('section[data-loopindex]').hide();
    $('section[data-loopindex]').eq(index-1).show();
    setCombPrototypeInit(index);
    price = $('.combo.tab-sel').attr('data-price');
    refresh_price($('#num').val());
})
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    // 先要清除选中状态
    $('section[data-loopindex]').find('input').removeAttr("checked");
    $('section[data-loopindex]').eq(sectionIndex-1).find('.dxbox').each(function(){
        $(this).find('label').removeClass('tab-sel').eq(0).addClass('tab-sel').find('input').prop("checked", true);
    });
}
//订单查询
$('.inquiry').click(function(){
    var url = '/order_quality.php';
    window.location.href = url;
})
//返回顶部
$('.top').on('click',function(){
    $('body,html').animate({ scrollTop: 0 }, 500);
})

//最新订单
require(['commentsScroll', 'gallery']);
var liNum = $('.picList li');
for (var i =0; i <= liNum.length; i++) {
    liNum.eq(2*i+1).addClass('odd');
}

var price = parseInt($('.combo.tab-sel').attr('data-price'));

function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    var num = $('#num').val();
    $('.textWrap .tt span').html(num);
    refresh_price(num);
}
function minnumber(){
    
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        var num = $('#num').val();
        $('.textWrap .tt span').html(num);
        refresh_price(num);
    }
}
function refresh_price(num){
    $('input[name="price"]').val(num*price);
}
//懒加载
function lazyload(){
    var screenHeight = $(window).height();
    var imgdata = $('.m-img').html();
    var img = imgdata.replace(/<img src="/g,'<img class="lazyload" src="" data-img="');
    $('.m-img').html(img);
    showImg(screenHeight);
    window.addEventListener('scroll', function(){
        var img = $('.lazyload');
        if(img.length<=0){
            window.removeEventListener('scroll',arguments.callee);
            return false;
        }else{
            var screenHeight = $(document).scrollTop();
            setTimeout(function(){
                showImg(screenHeight+screenHeight);
            },300)
        }
            
    })
}
function showImg(height){
    var img = $('.lazyload');
    for (var i = 0; i < img.length; i++) {
        var top = img.eq(i).offset().top;
        var src = img.eq(i).attr('data-img');
        if (top<=height) {
            img.eq(i).attr('src',src);
        }
    }
}