require(['jquery', 'quality', 'widget'], function ($, Quality){
    window.widget.repeatOrder.init();
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();


    // 初始化数量插件
    Quality.init({
        minBtn: $('[data-quality="min"]')
        , addBtn: $('[data-quality="add"]')
        , countIpt: $('[data-quality="value"]')
        , callback: refresh_price
    });

    var addCheckout = 0;//发起结账记录；
    var addPay = 0;//添加支付信息记录；
    // 初始化选择
    // $("#comb label").eq(0).children('input').attr("checked", 'true');
    $("input[name='payment_type']").eq(0).attr("checked", true);
    // 初始化属性选择
    setCombPrototypeInit(1);

    // 刷新价格
    refresh_price();

    $("#comb label input").click(function(event) {
        /* Act on the event */
        refresh_price();
    });

    $('.protoLayer .con label').click(function(event) {
        /* Act on the event */
        addCheckout += 1;
        if (addCheckout == 1) {
            fbq('track', 'InitiateCheckout');
        };
        $(this).addClass('active').siblings().removeClass('active');
        if( $(this).find('img').length >0 ){
            var src = $(this).find('img').attr('src');
            $('.store-goods .i-img img').attr('src', src);
        }
        var sectionIndex = $(this).parents('section').attr('data-loopindex');
        $('input[name="combo_id"]').eq(sectionIndex-1).prop("checked", 'true');
    });

    // 输入名字埋点
    $("input[name='name']").change(function () {
        if (addCheckout == 0) {
            addCheckout = 1;
            fbq('track', 'InitiateCheckout');
        };
        addPay += 1;
        if (addPay == 1) {
            fbq('track', 'AddPaymentInfo');
        }
    });

    function refresh_price() {
        $('[data-render="count"]').html($('#mun').val());
        $.ajax({
            url: 'checkout.php?',
            type: 'post',
            data: $('input[name=combo_id]:checked,input[name=\'product_id\'], #act, input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
               if(json.ret)
               {
                    $('combprice').html(json.price);
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
    
    // mike：增加套餐切换
    $(document).ready(function(){
        $("input[name='combo_id']").each(function(){
            $(this).click(function(){
                var index = $(this).attr('data-loopIndex');
                $('section[data-loopIndex]').hide();
                $('section[data-loopIndex]').eq(index-1).show();
                setCombPrototypeInit(index);
            });
        })
    });

    // 根据套餐初始化
    function setCombPrototypeInit(sectionIndex){
        // 先要清除选中状态
        $('section').find('input').removeAttr("checked");
        $('section[data-loopindex]').eq(sectionIndex-1).find('li.protoLayer').each(function(){
            if($(this).find('label').length == 1){
                $(this).find('label').removeClass('active').eq(0).addClass('active').find('input').prop("checked", true);
            }
            if($(this).find('.active').length != 0){
                $(this).find('.active').find('input[type="radio"]').prop('checked',true);
            }
        });
        singleCombo(sectionIndex);
    }
    //套餐是否可选数量
    function singleCombo(sectionIndex){
        var single_c =  $('input[name="combo_id"]').eq(sectionIndex-1).parent('label').attr('single_c');
        if(parseInt(single_c) == 1){
            $('#mun').val(1);
            $('#mun').parents('.item').hide();
        }else{
            $('#mun').parents('.item').show();
        }
    }
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]:checked').val() ? $('input[name="combo_id"]:checked').val() : $('input[name="combo_id"][checked]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo_id"]:checked').attr('data-loopIndex') ? $('input[name="combo_id"]:checked').attr('data-loopIndex') : $('input[name="combo_id"][checked]').attr('data-loopIndex');
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('li.protoLayer').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopindex]').eq(sectionIndex-1).find('[comboproduc]').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('li.protoLayer').each(function(i,e){
                    var that = this;
                    a.push($(that).find('input[type="radio"]:checked').val());
                });
                attrs[index].push(a);
            });
        }
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('button[type="submit"]').click(function(ev){
        attrval();
    })
});
function checkattrs(ev){
    // var oEvent = ev || event;
    var oEvent = ev;
    var loop = $('input[name="combo_id"]:checked').attr('data-loopindex');
    var attr = $('section[data-loopIndex="'+ loop +'"] ').find('.protoLayer');
    if( attr.length > 0 ){
        var prototype = [];
        attr.each(function(){
            var dom = $(this).find('.active');
            var prototypeId = dom.find('input[type="radio"]:checked').val();
            if(typeof prototypeId != 'undefined'){
                prototype.push(prototypeId);
            }
        });
        if(prototype.length < attr.length){
            alert($('#order').attr('data-error'));
        }else{
            $('[data-cuckootag="confirm_order"]').trigger('click');
        }
    }else{
        $('[data-cuckootag="confirm_order"]').trigger('click');
    }
}
