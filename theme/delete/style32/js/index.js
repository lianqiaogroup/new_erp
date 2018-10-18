require(['jquery', 'swiper','widget','gallery'],function($, Swiper){

    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();


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
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]:checked').val() ? $('input[name="combo_id"]:checked').val() : $('input[name="combo_id"][checked]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo_id"]:checked').parent('label').attr('data-loopIndex') ? $('input[name="combo_id"]:checked').parent('label').attr('data-loopIndex') : $('input[name="combo_id"][checked]').parent('label').attr('data-loopIndex');
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopindex]').eq(sectionIndex-1).find('[comboproduct]').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('[data-prototype-group]').each(function(i,e){
                    var that = this;
                    a.push($(that).find('input[type="radio"]:checked').val());
                });
                attrs[index].push(a);
            });
        }
        console.log(combo_id)
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('button[type="submit"]').click(function(){
        attrval();
    })
    window.widget.repeatOrder.init();
})

$(function(){

    // 点赞模块
    (function(dom){
        dom.show().on('click', '[act-close]', function(event) {
            event.preventDefault();
            dom.fadeOut();
        });
    })($('.like_wrap'));
    setCombPrototypeInit(1);
});

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
// 显示套餐内产品属性
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

// 返回顶部
$('.top').on('click',function(){
    $('body,html').animate({ scrollTop: 0 }, 500);
})

// 最新订单
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
    var imgdata = $('#test').val();
    var img = imgdata.replace(/<img src="/g,'<img class="lazyload" src="public/image/product-preview.png" data-img="');
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
lazyload();

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

