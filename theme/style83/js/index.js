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
            
        var re = new RegExp("^[0-9]{7,11}$");
        var phone = $('input[name="mob"]').val();
        if (!re.test(phone)) {
            alert('請輸入正確的電話號碼');
            $('input[name="mob"]').focus();
            return false;
        }
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
var is_single = $(".combo").eq(0).attr('data-single');
console.log(is_single)
if(is_single == 1){
    $('.u-fornum').hide();
}
// 显示套餐内产品属性
$('.combo').on('click',function(){
    is_single = $(this).attr('data-single');
    if (is_single == 1) {
        $('.u-fornum').hide();
    }else{
        $('.u-fornum').show();
    }
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

//region_code
$('select[name="province"]').on('change',function(){
    var code = $(this).children('option:selected').attr('data-code');
    $('#region_code').val(code);
    if(code == "TW"){
        loadstate();
        $('#address_library').show();
    }else{
        $('#address_library').hide();
        $('#city').val('');
        $('#district').val('');
    }
})
$('#city').change(function(event) {
    var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
    loadCity(id);
});
function loadstate(){
    var region_id = $('select[name="province"]').val();
    $.post('/region.php', { 'region_id': region_id }, function(data) {
        var data = JSON.parse(data);
            data.map(function(item, index){
                $('#city').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');
            });
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
    });

}
function loadCity(id, callback){
    $.post('/region.php', { 'yn_region_id': id }, function(data, textStatus, xhr) {
        var districtFirst = $('[name="district"]').children().first();
        $('[name="district"]').children().remove();
        $('[name="district"]').append(districtFirst);
        $('#district').val('');
        var data = JSON.parse(data);
        data.map(function(item, index){
            $('#district').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');
        });
    });
}