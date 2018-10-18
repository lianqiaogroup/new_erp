//facebook埋点
var addCar = 0;//加入购物车记录；
var addCheckout = 0;//发起结账记录；
var addPay = 0;//添加支付信息记录；

//评论滚动
+(function(){
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
})();


$(function(){

    // 延时加载图文详情
    setTimeout(function(){
        var content = $('#ceontentTemplate').text();
            // content = content.replace(/poster=\"[^\"]*\"/g, '');
            // content = content.replace(/preload=/g, 'poster="/public/image/videoPlay.jpg" preload=');
        $('.m-img').html(content);
    }, 1000);

});

// 
require(['swiper'],function(Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination'
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
        $(document).scroll(function () {
            var top = $(window).scrollTop();
            var h = $("header").height() + $(".product_title").height() + $("#video").height();
            if (top > h) {
                video.pause();
            }
        });
    }
   
});

//初始化选择
setCombPrototypeInit(1);
$('input[name="payment_type"]').eq(0).prop('checked',true);
$('input[name="combo_id"]').val($('input[name="combo"]:checked').val());
var is_single = $("#comb .tab").eq(0).attr('data-single');
if(is_single == 1){
    $('.u-fornum').hide();
}

// 套餐点击
$("#comb .tab").click(function(event) {
    if (addCar == 0) {
        addCar = 1;
        fbq('track', 'AddToCart');
    };
    addCheckout += 1;
    if (addCheckout == 1) {
        fbq('track', 'InitiateCheckout');
    };
    is_single = $(this).attr('data-single');
    if (is_single == 1) {
        $('.u-fornum').hide();
    }else{
        $('.u-fornum').show();
    }
    $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
    $(this).siblings().find('input').prop("checked", false);        
    $(this).find('input').prop("checked",true);
    $('#comb').attr('data-price', $(this).attr('data-price'));
    $('input[name="combo_id"]').val($('input[name="combo"]:checked').val());
    var index = $(this).attr('data-loopIndex');
    setCombPrototypeInit(index);
});
// 选择事件
$('.u-format.count_atrr').on('click', '.tab', function(){
    if (addCar == 0) {
        addCar = 1;
        fbq('track', 'AddToCart');
    };
    addCheckout += 1;
    if (addCheckout == 1) {
        fbq('track', 'InitiateCheckout');
    };
    var self = $(this);
    var id = self.attr('data-id');
    self.addClass('tab-sel').siblings().removeClass('tab-sel');
    self.find('input').prop('checked',true);
    self.siblings().find('input').prop('checked',false);
    var data_index = self.parents('section').attr('data-loopindex');
    $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
    $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').find('input').attr("checked", 'true');
    $('input[name="combo_id"]').val($('input[name="combo"]:checked').val());
});
// 输入名字埋点
$("input[name='name']").change(function(){
    
    
    if (addCar == 0) {
        addCar = 1;
        fbq('track', 'AddToCart');
    };
    if (addCheckout == 0) {
        addCheckout = 1;
        fbq('track', 'InitiateCheckout');
    };
    addPay +=1;
    if(addPay ==1){
        fbq('track', 'AddPaymentInfo');
    }
});
function attrval(){
    var count = $('input[name="num"]').val();
    var combo_id = $('input[name="combo"]:checked').val() ? $('input[name="combo"]:checked').val() : $('input[name="combo"][checked]').val();
    var product_id = $('input[name="product_id"]').val();
    var sectionIndex = $('input[name="combo"]:checked').parent('label').attr('data-loopindex') ? $('input[name="combo"]:checked').parent('label').attr('data-loopIndex') : $('input[name="combo"][checked]').parent('label').attr('data-loopIndex');
    
    if(parseInt(combo_id) == 0){
        var attrs = [];
        $('section[data-loopIndex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
            var a = $(this).find('.tab-sel').find('input[type="radio"]').val();
            attrs.push(a);
        });
    }else{
        var attrs = [];
        $('section[data-loopindex]').eq(sectionIndex-1).find('.tc[data-goods]').each(function(index,element){
            attrs[index] = [];
            attrs[index].push(product_id);
            attrs[index].push(count);
            var a = [];
            $(this).find('[data-prototype-group]').each(function(i,e){
                var that = this;
                a.push($(that).find('.tab-sel').find('input[type="radio"]').val());
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


//返回顶部
+(function(){
    var minscroll = window.screen.height;
    $(window).on('scroll',function(){
    	if($(window).scrollTop()>=minscroll){
    		$('.footer').show();
    	}else{
    		$('.footer').hide();
    	}
    });
    $('.top').on('click',function(){
    	$('html,body').animate({scrollTop:0},'slow');
    });
})();

function inquiry(){
    var mob = $('.inquiry_mob').val();
    var identity_tag = $('#identity_tag').val();
    window.widget.goto_checkOrder({
        phone: mob,
        identity_tag: identity_tag
    });
}

// 侧边栏
$('header .ui-icon-scan1').click(function(event) {
    /* Act on the event */
    var bd = $('body');
    var css = 'offcanvas-in';
    !bd.hasClass(css) ? bd.addClass(css) : bd.removeClass(css);
});

// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    $('section[data-loopindex]').find('input').removeAttr("checked");
    section.find('li.protoLayer').each(function(){
        if($(this).find('.tab').length == 1){
            var first = $(this).find('.tab').removeClass('tab-sel').eq(0).addClass('tab-sel');
            $(this).find('.tab').eq(0).find('input').prop('checked',true);
        }
        if($(this).find('.tab-sel').length != 0){
            $(this).find('.tab-sel').find('input[type="radio"]').prop('checked',true);
        }
    });
}
function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
        $('.textWrap .tt').html($('#num').val());
}
function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.textWrap .tt').html($('#num').val());
    }
}

// malaysia address code
// $('#region_code').val()=='MYS' && (function(){
//     window.ajaxLocked = false;
//     $('[name="postal"]').blur(function(){
//         var postal_code = $(this).val();
//         if( postal_code=='' ) return false;
//         window.ajaxLocked = true;
//         $.ajax({
//             url: '/api_postcode_address_mapping.php'
//             , type: 'post'
//             , data:{'postName': postal_code }
//             , dataType: 'json'
//             , success: function(response){
//                 ajaxLocked = false;
//                 if( response && response.ret==1 ){
//                     $('[name="state"]').val(response.data['state']||'-');
//                     $('[name="city"]').val(response.data['city']||'-');
//                     $('[name="district"]').val(response.data['district']||'-');
//                 }else{
//                     $('[name="state"]').val('-');
//                     $('[name="city"]').val('-');
//                     $('[name="district"]').val('-');
//                     var errorText = $('[name="postal"]').attr('data-error') || '';
//                     alert(errorText);
//                     $('[name="postal"]').val('');
//                     return false;
//                 }
//             }
//         });
//     });
// })();
function checkattrs(ev){
    addCar += 1;
    if(addCar == 1){
        fbq('track', 'AddToCart');
    };
    var loop = $('#comb').find('.tab-sel').attr('data-loopindex');
    var attr = $('section[data-loopIndex="'+ loop +'"] ').find('.u-format.count_atrr');
    if( attr.length > 0 ){
        var prototype = [];
        attr.each(function(){
            var dom = $(this).find('.tab-sel');
            var prototypeId = dom.find('input[type="radio"]:checked').val();
            if(typeof prototypeId != 'undefined'){
                prototype.push(prototypeId);
            }
        });
        if(prototype.length < attr.length){
            alert($('#page-order').attr('data-error'));
            $(window).scrollTop($('#form').offset().top);
        }else{
            $('a[data-cuckootag="confirm_order"]').trigger('click');
        }
    }else{
        $('a[data-cuckootag="confirm_order"]').trigger('click');
    }
    // console.log(addCar, addCheckout, addPay);
}

$("[name='state']").change(function(event) {
    var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
    loadCity(id);
});
$('[name="city"]').change(function(event) {
    var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
    loadDistrict(id);
});

function loadstate(){
    var region_id = $("[name='region_id']").val();
    $.post('/region.php', { 'region_id': region_id }, function(data) {
        var data = JSON.parse(data);
            data.map(function(item, index){
                $('[name="state"]').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');
            });
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
    });
}
function loadCity(id, callback){
    $.post('/region.php', { 'yn_region_id': id }, function(data, textStatus, xhr) {
        var first =  $('[name="city"]').children().first();
        $('[name="city"]').children().remove();
        $('[name="city"]').append(first);
        var districtFirst = $('[name="district"]').children().first();
        $('[name="district"]').children().remove();
        $('[name="district"]').append(districtFirst);
        var data = JSON.parse(data);
        data.map(function(item, index){
            $('[name="city"]').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');

        });
    });
}
function loadDistrict(id){
    $.post('/region.php', { 'yn_region_id': id }, function(data) {
        var districtFirst = $('[name="district"]').children().first();
        $('[name="district"]').children().remove();
        $('[name="district"]').append(districtFirst);
        var data = JSON.parse(data);
        if( data.length == 0 ){
            var newInput = '<input name="district" value="" placeholder="{{ lang.district_input }}" />';
            $('select[name="district"]').before(newInput);
            $('select[name="district"]').remove();
        }else{
            var newInput = '<select name="district"></select>';
            $('input[name="district"]').before(newInput);
            $('input[name="district"]').remove();
            data.map(function(item, index){
                $('[name="district"]').append('<option value="'+item.name+'">'+item.name+'</option>');
            });
        }
    });
}
loadstate();
