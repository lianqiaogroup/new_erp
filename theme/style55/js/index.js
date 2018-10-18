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
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]').val();
        var product_id = $('input[name="product_id"]').val();
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex="'+ combo_id +'"]').find('[data-prototype-group]').each(function(){
                var a = $(this).find('.tab-sel').attr('attr_id');
                if(a){
                    attrs.push(a);
                }
            });
        }else{
            var attrs = [];
            $('section[data-loopIndex="'+ combo_id +'"]').find('.item').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('[data-prototype-group]').each(function(i,e){
                    var that = this;
                    a.push($(that).find('.tab-sel').attr('attr_id'));
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
})
var combo_id = $('#combo_id').val();
$('input[name="combo_id"]').val(combo_id);
//点击选中产品
$('.dxbox').each(function(){
    $(this).find('input[type="radio"]').eq(0).prop('checked',true);
    $(this).find('label').eq(0).addClass('tab-sel');
})
attrcheck();
$('.dxbox label').on('click',function(){
    var allItem = $(this).parent().find('label');
    for(var i = 0;i<allItem.length;i++){
        allItem.eq(i).removeClass('tab-sel');
        $(this).addClass('tab-sel');
    }
    attrcheck();
})
var is_single =$('#combo_id').find("option:selected").attr('data-single');
console.log(is_single)
if(is_single == 1){
    $('.numdiv').hide()
}
//显示套餐内产品属性
$('#combo_id').change(function(){
    is_single = $(this).find("option:selected").attr('data-single');
    console.log(is_single)
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
    attrcheck();
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
function attrcheck(){
    var comboid = $('input[name="combo_id"]').val();
    var len = $('section[data-loopindex="'+ comboid +'"]').find('.prodiv').length;
    var dom = $('section[data-loopindex="'+ comboid +'"]').find('.prodiv');

    var attr = [];
    dom.map(function(elem,item){
        var goudid = dom.eq(elem).find('.dxbox .tab-sel').attr('attr-pro');
        var attrid = dom.eq(elem).find('.dxbox .tab-sel').attr('attr_id');
        attr.push('<input type="hidden" name="attr['+ goudid +']" value="'+ attrid +'">')
    })
    $('#attr_div').html('').append(attr.join(''));
};