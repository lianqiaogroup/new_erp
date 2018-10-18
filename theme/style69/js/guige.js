require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    
    setCombPrototypeInit(1);
    var is_single = $('.package select').find("option:selected").attr('data-single');
    if(is_single == 1){
        $('.u-fornum').hide()
    }
    //属性选择框初始化
    height = parseInt($('#page-order').height())+80;
    $('#page-order').css('bottom',-height);
    
    $('.package select').on('change',function(){
        is_single = $(this).find("option:selected").attr('data-single');
        if(is_single == 1){
            $('.u-fornum').hide();
        }else{
            $('.u-fornum').show();
        }
        
        $('#comb').attr('data-price', $(this).find("option:selected").attr('data-price'));
        $('[currentprice]').html($(this).find("option:selected").attr('data-price'));
        var index = parseInt($(this).find("option:selected").attr('data-loopindex'));
        setCombPrototypeInit(index);
    })
})
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    $('#price_format').html($('.package select').find("option:selected").attr('data-price'));
    var comboid = $('section[data-loopindex]').eq(sectionIndex-1).attr('combo-id');
    var n = 0;
    section.find('select.count_atrr').each(function(){
        if( parseInt(section.find('select.count_atrr').val())>0 ){
            n ++;
        }
    });
    if(n == section.find('select.count_atrr').length){
        $('select[type="combo"]').find('option[data-id="'+ comboid +'"]').attr("selected", 'true');
    }
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

// 提交表单
function postcheckGuige() {
    var url = "/checkout.php?";

    // 数量
    var count = parseInt($('input#num').val()) || 1;
    url = url + "count="+count;

    // 产品ID
    var comb_id = $(".package select").val();
    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comb_id + '&product_id=' + productId;
    
    /* Act on the event */
    var prototype = [];
    var attr = $('section[data-loopIndex]:visible .count_atrr');
    var error = $('.dt-paramselect').attr('data-error');
    if($('select[type="combo"]').length != 0 && $('select[type="combo"]').val() == 0){
        alert(error);
        return false;
    }
    if( attr.length > 0 ){
        attr.each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).val();
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if( prototype.length < attr.length ){
            alert(error);
            window.location.href = '#sales';
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }
    // 跳转
    window.location.href = url;
    return true;
}
//select 展开事件
$('select').on('focus',function(){
    $(this).addClass('focus');
})
$('select').on('blur',function(){
    $(this).removeClass('focus');
})

var fbqstatus = {};
fbqstatus.AddToCart = 0;
fbqstatus.InitiateCheckout = 0;
//泰国及台湾地区加入fb三个事件；
var region_code = $("#region_code").val();
if (region_code == 'THA' || region_code == 'Rp') {
    //fb加入购物车事件
    $('.buy_now').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    });

    function judge(){
        if (fbqstatus.InitiateCheckout == 0) {
            fbq('track', 'InitiateCheckout');
            fbqstatus.InitiateCheckout++;
        };
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    }
    //fb发起结账事件
    $("#form select").click(function(){
       judge();
    })
    var list = $('.tc .count_atrr ');
    for (var i = 0; i < list.length; i++) {
        list[i].onclick = function () {
           judge();
        }
    }
    $(".less").click(function(){
        judge();
    })
    $(".more").click(function(){
        judge();
    })

};