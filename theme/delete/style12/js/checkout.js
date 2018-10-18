require(['jquery', 'widget'],function($, Swiper){
    window.widget.repeatOrder.init();
    window.widget.repeatOrder.getproattr();
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();

    $(document).ready(function(){
        var count = Cjs.url.getParamByName('count');
        $('input[name="num"]').val(count);
        $('span.num').html('X'+count);
        var combo_id = Cjs.url.getParamByName('combo_id');
        $('input[name="combo_id"]').val(combo_id);
        $('#combo_' + combo_id).show();
        var str = Cjs.url.getParamByName('proto') || "";
        if( str != '' ){
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
                    var img = $('span[optionskey][data-id="'+ data +'"]').attr('data-img');
                    if(img){
                        $('span[optionskey][data-id="'+ data +'"]').parents('.guild').find('.forAttrImg').attr('src',img);
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
                    var img = $('span[optionskey][data-id="'+ value +'"]').attr('data-img');
                    if(img){
                        $('span[optionskey][data-id="'+ value +'"]').parents('.guild').find('.forAttrImg').attr('src',img);
                    }
                });
            }
            $('#form').append(html.join(''));
        }
        refresh_price();
    })
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name=combo_id], #act, input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
               if(json.ret){
                    //$('combprice').html(json.price);
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
});