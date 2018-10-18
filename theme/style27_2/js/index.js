require(['jquery', 'widget','gallery'],function($, Swiper){


    // 轮播图
    require(['swiper'], function(Swiper){
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
    });


    // 初始化选择
    
    setCombPrototypeInit(1);
    singleCombo();
    // 选择产品
    $("#comb .tab").click(function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).find('input').attr("checked", 'true');
        $(this).siblings().find('input').attr("checked", false);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        $('[currentprice]').html($(this).attr('data-price'));
        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);
        refresh_price();
        cur_chosen();
        singleCombo();
    });

    // 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        var src = self.attr('data-img');
        if( src ){ $('#attrimg').attr('src', src); }
        cur_chosen();
        var data_index = self.parents('section').attr('data-loopindex');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').find('input').attr("checked", 'true');
    });
    cur_chosen();

})
//显示温馨提示
$('.module_service .right').on('click',function() {
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
// var marquee = "張**（095***6831）在2分鐘前購買了此產品";
var marquee = $("#marquee").val();
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
var _day = (myDate.getMonth()+1) + '/' + myDate.getDate() + '-' + (date2.getMonth()+1) + '/' + date2.getDate();
$('#arrival_days').html(_day);

//隐藏属性
$('.close').on('click',function(){
    var screenHeight = $(window).height();
    $('#page-order').animate({top:screenHeight},500);
    $('#page-order').delay(400).hide(0);
    $('#page-index').css('display','block');
})

//评论滚动
var boxer = $('[data-fn=commentScroll]');
var list = $(boxer).children().eq(0);
var clone = list.clone();
var clone2 = list.clone();
$(boxer).append(clone).append(clone2);
var speed = 35;
function Marquee(){
    if( list.height() < boxer.height() ){
        if( boxer.scrollTop() >= list.height()+14 ){
            boxer.scrollTop(0);
        }else{
            boxer.scrollTop(boxer.scrollTop()+1);
        }
    }else{
        if( boxer.scrollTop() - list.height() >=4 ){
             boxer.scrollTop(0); 
        }else{
             boxer.scrollTop(boxer.scrollTop()+1);
        }
    }
}
setInterval(Marquee,speed);
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    section.find('li.protoLayer').each(function(){
        if($(this).find('.tab').length == 1){
            $(this).find('.tab').eq(0).addClass('tab-sel');
            var id = $(this).find('.tab').eq(0).attr('data-id');
            $(this).find('.u-format.count_atrr').attr('data-select',id);
        }
        if(section.find('li.protoLayer').length == section.find('.tab-sel').length){
            $('#comb .tab').eq(sectionIndex-1).addClass('tab-sel').find('input').attr("checked", 'true');
            $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
            $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
        }
    });
}


function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
        $('.textWrap .tt span').html($('#num').val());
    refresh_price(); 
}

function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.textWrap .tt span').html($('#num').val());
        refresh_price();
    }
}

function inputnumber(){
    var number=parseInt($('#num').val());
    if(isNaN(number)||number < 1){
        $('#num').val('1');
        $('.textWrap .tt span').html(1);
        refresh_price();
    }else if(number > 1){
        $('#num').val(number);
        $('.textWrap .tt span').html(number);
    }
    refresh_price();
}

// 刷新价格
function refresh_price() {
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('#comb input[checked=checked],input[name=\'product_id\'], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret)
           {
                $("#price").html(json.total);
              $("input[name='price']").val(json.total);
           }
           else{
               alert(json.msg)
           }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });
}

// 提交表单
function postcheckGuige() {
    var url = "/checkout.php?";

    // 数量
    var count = parseInt($('input#num').val()) || 1;
    url = url + "count="+count;

    // 产品ID
    var comb_id = $("#comb .tab-sel").find('input').val();
    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comb_id + '&product_id=' + productId;
    
    /* Act on the event */
    var prototype = [];
    if( $('section[data-loopIndex]:visible .u-format.count_atrr').length > 0 ){
        $('section[data-loopIndex]:visible .u-format.count_atrr').each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).attr('data-select');
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if(prototype.length < $('section[data-loopIndex]:visible .u-format.count_atrr').length){
            alert($('#ui-paramselect').attr('data-error'));
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }  
    // 跳转
    window.location.href = url;
    return false;
}
$('.buy_now .add').on('click', function() {
        var screenHeight = $(window).height();
        $('#page-order').show();
        $('#page-order').css('top',screenHeight);
        $('#page-order').animate({top:0},500);
        $('#page-index').delay(400).hide(0);
});
function cur_chosen(){
    var chosen = '';
    var loop = parseInt($(".tab-sel").eq(0).attr('data-loopindex'))-1;
    var tab = $('[productid]').eq(loop).find('.tc');
    for(var i =0; i < tab.length; i++){
        var attr_num = tab.eq(i).find('.tab-sel');
        for (var j =0; j < attr_num.length; j++){
            chosen += '<span>'+ attr_num.eq(j).html()+'</span>'
        }
    }
    console.log(tab)
    $('[chosen]').html(chosen);
}
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') ? $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') : $('input[name="combo_id"][checked]').parent('.tab').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.u-fornum').hide();
    }else{
        $('#num').parents('.u-fornum').show();
    }
}



// 倒计时模块
+(function(){
    var interval = 1000;
    var deadline_date = $('#timer').attr('data-value');
    var time_step = $('#timer').attr('data-step') || '8';
    // reset
    function resetDate(){
        var _currentTime = new Date().getTime()+28800000+(parseInt(time_step)*3600*1000);
        var _currentDate = new Date();
            _currentDate.setTime(_currentTime);
            _currentDate = _currentDate.toISOString().replace('T',' ');
            _currentDate = _currentDate.replace(/\.[0-9a-zA-Z]*/g,'');
        deadline_date = _currentDate;
        $('#timer').attr('data-value', deadline_date);
    }
    // module core
    function ShowCountDown() {
        var deadline = Date.parse(deadline_date);
        var now = new Date().getTime();
        if( deadline <= now ){
            resetDate();
            deadline = Date.parse(deadline_date);
        }
        var leftTime = deadline - now;
        var leftsecond = parseInt(leftTime/1000);
        var day1=Math.floor(leftsecond/(60*60*24));
        var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
        var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
        var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
        $('#timer').html("<span id='h'>"+0+hour+"</span>"+"<span class='colon'>:</span>"+"<span id='m'>"+minute+"</span>"+"<span class='colon'>:</span>"+"<span id='s'>"+second+"</span>"+"<span class='colon'></span>");
        document.getElementById("times").innerHTML = hour+":"+minute+":"+second;
    }
    deadline_date=='' && resetDate();
    if( document.getElementById('timer') ){
        ShowCountDown();
        window.setInterval(function(){ ShowCountDown(); }, interval);
    }
})();


var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#region_code").val();
//泰国地区加入fb三个事件；
if (region_code == 'THA' || region_code == 'HK') {
    //fb加入购物车事件
    $('[data-cuckootag="buy_now"]').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    });
    //fb发起结账事件
    $('[data-cuckootag="confirm_arrtibute"]').click(function () {
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

