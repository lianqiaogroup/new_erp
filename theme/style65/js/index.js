require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var galleryTop = new window.Swiper('.gallery-top', {
        spaceBetween: 10,
        autoHeight:true
    });
    var galleryThumbs = new window.Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
        height:60
    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;

})
$('input[name="combo_id"]').val($('#combo_id').val());
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
var is_single = $('#combo_id').find("option:selected").attr('data-single');
if(is_single == 1){
    $('.numdiv').hide()
}
//显示套餐内产品属性
$('#combo_id').change(function(){
    is_single = $(this).find("option:selected").attr('data-single');
        if(is_single == 1){
            $('.numdiv').hide();
        }else{
            $('.numdiv').show();
        }
    var index = $(this).val();
    $('section[data-loopindex]').hide();
    $('section[data-loopindex="'+ index +'"]').show();
    $('input[name="combo_id"]').val(index);
    refresh_price();
})

//订单查询
$('.inquiry').click(function(){
    var mob = $('input[name="inmob"]').val();
    var url = '/order_quality.php?phone='+mob;
    window.location.href = url;
})
//返回顶部
$('.top').on('click',function(){
    $('body,html').animate({ scrollTop: 0 }, 500);
})

function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    var num = $('#num').val();
    $('.textWrap .tt span').html(num);
    refresh_price();
}
function minnumber(){
    
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        var num = $('#num').val();
        $('.textWrap .tt span').html(num);
        refresh_price();
    }
}
function refresh_price(){
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name="combo_id"],input[name=\'product_id\'],#act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
        if(json.ret)
        {
            //$("#price").html(json.total);
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
//产品属性

$('#buynow').click(function(){
    var url = "/checkout.php?";
    var count = parseInt($('input#num').val());
    url = url + "count="+count;
    var comboid = $('input[name="combo_id"]').val();
    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comboid + '&product_id=' + productId;
    
    var len = $('section[data-loopindex="'+ comboid +'"]').find('.prodiv').length;
    var dom = $('section[data-loopindex="'+ comboid +'"]').find('.prodiv');

    var attr = [];
    dom.map(function(elem,item){
        var goudid = dom.eq(elem).find('.dxbox .tab-sel').attr('attr-pro');
        var attrid = dom.eq(elem).find('.dxbox .tab-sel').attr('attr_id');
        attr.push(goudid +'-'+ attrid);
    })
    url = url + "&proto="+attr.join('|');
    window.location.href = url;
})