require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]:checked').val() ? $('input[name="combo_id"]:checked').val() : $('input[name="combo_id"][checked]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo_id"]:checked').attr('data-loopIndex') ? $('input[name="combo_id"]:checked').attr('data-loopIndex') : $('input[name="combo_id"][checked]').attr('data-loopIndex');
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopindex]').eq(sectionIndex-1).find('.bdbox').each(function(index,element){
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
        console.log(attrs)
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('button[type="submit"]').click(function(){
        attrval();
    })
    window.widget.repeatOrder.init();
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();

    // 
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
setCombPrototypeInit(1);
//图文详情选项卡切换
$('.product_info .title>span').on('click',function(){
    $(this).siblings().removeClass('tab-sel');
    $(this).addClass('tab-sel');
})

$('.product_info .info').on('click',function(){
    $('.pinlun_content').hide();
    $('.User_notes').show();
    $('.m-img').show();
})
if ($(".lab p").length <= 0) {
    $(".pinglun").hide();
}
//评论大图弹出
$(".msKeimgBox img").click(function (event) {
    var dj = $(this).index();
    var obj = $(this).parent().parent().find('.hidden');
    var onoff = obj.eq(dj).css('display');
    for (var i = 0; i < obj.length; i++) {
        if (i !== dj) {
            obj.eq(i).hide();
        }
    }
    if(onoff == 'none'){
        obj.eq(dj).fadeIn();
    }else{
        obj.eq(dj).fadeOut();
    }
})

//点击选中产品
$('.dxbox label').on('click',function(){
    var allItem = $(this).parent().find('label');
    for(var i = 0;i<allItem.length;i++){
        allItem.eq(i).removeClass('tab-sel');
        $(this).addClass('tab-sel');
    }
})
singleCombo();
//显示套餐内产品属性
$('.combo').on('click',function(){
    var index = $(this).attr('data-loopindex');
    $('section[data-loopindex]').hide();
    $('section[data-loopindex]').eq(index-1).show();
    setCombPrototypeInit(index);
    refresh_price($('#num').val());
    singleCombo();
})
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    // 先要清除选中状态
    $('section[data-loopindex]').find('input').removeAttr("checked");
    $('section[data-loopindex]').eq(sectionIndex-1).find('.dxbox').each(function(){
        if($(this).find('label').length == 1){
            $(this).find('label').removeClass('tab-sel').eq(0).addClass('tab-sel').find('input').prop("checked", true);
        }
        if($(this).find('.tab-sel').length != 0){
            $(this).find('.tab-sel').find('input[type="radio"]').prop('checked',true);
        }
    });
}
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('input[name="combo_id"]:checked').parent('.tab-sel').attr('single_c') ? $('input[name="combo_id"]:checked').parent('.tab-sel').attr('single_c') : $('input[name="combo_id"][checked]').parent('.tab-sel').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.u-fornum').hide();
    }else{
        $('#num').parents('.u-fornum').show();
    }
}
function addnumber(){
    // console.log($('#num').val())
    $('#num').val(parseInt($('#num').val())+1);
    var num = $('#num').val();
    $('.textWrap .tt').html(num);
    refresh_price(num);
}
function minnumber(){    
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        var num = $('#num').val();
        $('.textWrap .tt').html(num);
        refresh_price(num);
    }
}
function refresh_price(num){
    var price = parseInt(num)*parseInt($('.product .tab-sel').attr('data-price'));
    $('input[name="price"]').val(price);
    $('#price').html(price);
}
//属性层折叠
$('.attr .title').on('click',function(){
    $('.attr_num').toggle();
    min = $('.product_info').offset().top;
    max = $('#order').offset().top-screenHeight;
})
//付款方式
$('input[name="payment_type"]').eq(0).parent('label').addClass('check');
$('input[name="payment_type"]').eq(0).attr('checked', true);
if($('input[name="payment_type"]').eq(0).val() == 4){
    $('#ocean-div').fadeIn();
}else{
    $('#ocean-div').fadeOut();
}
$('input[name="payment_type"]').change(function () {
    var val=$('input:radio[name="payment_type"]:checked').val();
    if(val == 4){
        $('#ocean-div').fadeIn();
    }else{
        $('#ocean-div').fadeOut();
    }
    $('.cell label').removeClass('check');
    $('.cell label[rel="'+ val +'"]').addClass('check');
})
//标题栏固定
var screenHeight = $(window).height();
var min = $('.product_info').offset().top;
var max = $('#order').offset().top-screenHeight;
function realFunc(){ 
    var img = $('.lazyload');
} 

window.addEventListener('scroll',realFunc);
function fixed(scroll,max){
    if (min<scroll&&scroll<max) {
        $('.product_info .title').addClass('fixed');
        $('.address-title').addClass('fixed');
    }else{
        $('.product_info .title').removeClass('fixed');
        $('.address-title').removeClass('fixed');
    }
}
$('.top').on('click',function(){
    $(window).scrollTop(0);
})
function checkattrs(ev){
    var loop = $('.product .tab-sel').find('input').attr('data-loopindex');
    var attr = $('section[data-loopIndex="'+ loop +'"] ').find('.dxbox[datattr]');
    if( attr.length > 0 ){
        var prototype = [];
        attr.each(function(){
            var dom = $(this).find('label.tab-sel');
            var prototypeId = dom.find('input[type="radio"]:checked').val();
            if(typeof prototypeId != 'undefined'){
                prototype.push(prototypeId);
            }
        });
        if(prototype.length < attr.length){
            alert($('#page-index').attr('data-error'));
            $(window).scrollTop($('#form').offset().top);
        }else{
            $('a[data-cuckootag="confirm_order"]').trigger('click');
        }
    }else{
        $('a[data-cuckootag="confirm_order"]').trigger('click');
    }
}