require(['jquery', 'widget'],function($){
    window.widget.repeatOrder.init();
    window.widget.repeatOrder.getproattr();
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();

    $(document).ready(function(){
        var count = Cjs.url.getParamByName('count');
        $("#num").val(count);
        var combo_id = Cjs.url.getParamByName('combo_id');
        $("input[name=combo_id]").val(combo_id);
        var product_id = Cjs.url.getParamByName('product_id');
        $("input[name=product_id]").val(product_id);
        $('[data-comboId="'+combo_id+'"]').show();
        $('.gdnum').map(function(){
            var pronum = count*parseInt($(this).attr('rel'));
            $(this).html(pronum);
        })
        var str = Cjs.url.getParamByName('proto') || "";
        if(str){
            var strAttr = str.split('|');
            var html = [];
            if(parseInt(combo_id) != 0){
                strAttr.map(function(elem, index) {
                    var obj = elem.split('-');
                    var goodsid = obj[0]
                    var group = obj[1];
                    var value = obj[2]; 
                    html.push('<input type="hidden" name="attr['+ obj[0]+'-'+ obj[1] +']" value="'+ obj[2] +'">');
                    var data = elem;
                    $('span[optionskey][data-id="'+ data +'"]').show();
                    $('span[optionskey][data-id="'+ data +'"]').siblings('span').remove();
                    var imgattr = $('span[optionskey][data-id="'+ data +'"]').attr('attrimg');
                    if(imgattr){
                        $('span[optionskey][data-id="'+ data +'"]').parents('.proitem').find('.forAttrImg').attr('src',imgattr);
                    }
                });
            }else{
                strAttr.map(function(elem, index) {
                    var obj = elem.split('-');
                    //var goodsid = obj[0]
                    var group = obj[0];
                    var value = obj[1];
                    html.push('<input type="hidden" name="attr['+obj[0] +']" value="'+ obj[1] +'">');
                    $('[optionsKey][data-id="'+ value +'"]').show();
                    var imgattr = $('span[optionskey][data-id="'+ value +'"]').attr('attrimg');
                    if(imgattr){
                        $('span[optionskey][data-id="'+ value +'"]').parents('.proitem').find('.forAttrImg').attr('src',imgattr);
                    }
                });
            }
            $('#form').append(html.join(''));
        }
        refresh_price();
        $('.ifpay').click(function(){
            $(this).siblings('label').removeClass('check');
            $(this).addClass('check');
            var payid = $(this).attr('rel');
            $('input[name="payment_type"]').val(payid);
        })
    }) ;
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name=combo_id], input[name=\'product_id\'],#act, input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
               if(json.ret){
                    $("#price").html(json.total);
               }
               else{
                   alert(json.msg)
               }
            },
            error: function(xhr, ajaxOptions, thrownError) {
            }
        });
    }

})
