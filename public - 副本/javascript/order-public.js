require(['jquery','widget','cjs'],function($, Swiper){
$(document).ready(function(){
    //产品属性
    var count = Cjs.url.getParamByName('count');
    var combo_id = Cjs.url.getParamByName('combo_id');
    var product_id = Cjs.url.getParamByName('product_id');
    $('#goods_'+combo_id).show();
    $('input[name="combo_id"]').val(combo_id);
    $('input[name="num"]').val(count);
    $('.number').html(count);
    if(product_id){
        $('input[name="product_id"]').val(product_id);
    }
    var str = Cjs.url.getParamByName('proto') || "";
    var strAttr = str.split('|');
    var html = [];
    if(str){
        if(parseInt(combo_id) != 0){
            strAttr.map(function(elem, index) {
                var obj = elem.split('-');
                html.push('<input type="hidden" name="attr['+ obj[0]+'-'+ obj[1] +']" value="'+ obj[2] +'">');
                var data = elem;
                $('span[optionskey][data-id="'+ data +'"]').show();
                var imgattr = $('span[optionskey][data-id="'+ data +'"]').attr('attr_img');
                if(imgattr){
                    $('span[optionskey][data-id="'+ data +'"]').parents('.flexbox').find('.attrimg').attr('src',imgattr);
                    //$('.attrimg').eq(index).attr('src',imgattr);
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

            });
        }
        $('#form').append(html.join(''));
    }
    //支付方式
    $('.tab_sele').click(function(){
        $('.tab_sele').removeClass('action');
        $(this).addClass('action');
        var payt = $(this).attr('rel');
        $('input[name="payment_type"]').val(payt);
        switch(parseInt(payt)){
            case 0:
                $('.pay-type').hide();
                break;
            case 4:
                $('.pay-type').show();
                break;
        }
    });
    $('.tab_sele').eq(0).addClass('action');
    var payt = $('.tab_sele').eq(0).attr('rel');
    $('input[name="payment_type"]').val(payt);
    switch(parseInt(payt)){
        case 0:
            $('.pay-type').hide();
            break;
        case 4:
            $('.pay-type').show();
            break;
    }
    //日本邮编合并
    $('input[name="postal_1"],input[name="postal_2"]').change(function(){
        var left = $.trim($('input[name="postal_1"]').val());
        var right = $.trim($('input[name="postal_2"]').val());
        $('input[name="postal"]').val(left+right);
    })
    //查看与关闭
    $('#showComboProduct_triggle2').click(function(event) {
        var close = $(this).attr('rel');
        var show  = $(this).attr('rel_s');
        /* Act on the event */
        if($(this).hasClass('action')){
            $(this).removeClass('action');
            $('#showComboProduct_'+combo_id).slideDown();
            $('#lang').html(close);
        }else{
            $(this).addClass('action');
            $('#showComboProduct_'+combo_id).slideUp();
            $('#lang').html(show);
        }
    });
    //刷新价格
    refresh_price();
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name=combo_id], #act,input[name=\'product_id\'], input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
               if(json.ret){
                    if(json.new_price_format){
                        $("#payment_amount").html(json.new_price_format.price_format);
                        $('#total').html(json.new_price_format.price_format);
                    }else{
                        $("#payment_amount").html(json.total);
                        $('#total').html(json.total);
                    }
                    if($('#region_code').val() == 'SAU'){
                        if(parseInt(json.total) >= 900){
                            $('.cardshow').show();
                            $('input[name="id_card"]').attr('required','required');
                        }
                    }
               }
               else{
                   alert(json.msg)
               }
            },
            error: function(xhr, ajaxOptions, thrownError) {
            }
        });
    }

$('.close').on('click', function(event) {
    $('.fLogin').fadeOut();
})

    //泰国选择市区
    // 用语判断是否正在请求
    window.ajaxLocked = false;
    $('#tha_postal').change(function(){
        var id = $(this).val();
        ajaxLocked = true;
        $.ajax({
            url: 'region.php',
            type: 'post',
            data:{'postName':id},
            dataType: 'json',
            success: function(ret) {
                if(ret){
                    if(ret.length != 0){
                        var option = "";
                        for(var i in ret)
                        {
                            option += '<option value="'+ret[i].name+'" data-city="'+ret[i].parent_name+'">'+ret[i].name+'</option>';
                            $('.regions').html(ret[0].parent_name);
                            $('input[name="city"]').val(ret[0].parent_name);
                        }
                        $(".tha_district").html('').append(option);
                        ajaxLocked = false;
                    }else{
                        alert('รหัสไปรษณีย์ ผิด!');
                        $('#tha_postal').val('');
                        $('.tha_district').html('');
                        $('.regions').html('');
                        $('input[name="city"]').val('');
                        ajaxLocked = true;
                    }
                }else{
                    alert('รหัสไปรษณีย์ ผิด!');
                    $('#tha_postal').val('');
                    $('.tha_district').html('');
                    $('.regions').html('');
                    $('input[name="city"]').val('');
                    ajaxLocked = true;
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
            }
        });
    })
    $('.tha_district').change(function(event) {
        var city = $(this).children(':selected').attr('data-city');
        if( city != "" ){
            $('.regions').html(city);
            $('input[name="city"]').val(city);
        }
    });
    //越南选择市区
    setDistrict = function(){
        var cid = $("select[name='city']").find("option:selected").attr('cid');
        $.ajax({
            url: 'region.php?',
            type: 'post',
            data: {'yn_region_id':cid},
            dataType: 'json',
            success: function(ret) {
                if (ret){
                    var option ='<select name="district" style="">';
                    for(var i in ret)
                    {
                        option += '<option value="'+ret[i].name+'">'+ret[i].name+'</option>';
                    }
                    option +='</select>';
                    $(".district").html(option);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
            }
        });
    }
    window.widget.repeatOrder.init();
    window.widget.repeatOrder.getproattr();
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
    
})
})