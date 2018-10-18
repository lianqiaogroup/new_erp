require(['jquery', 'quality','widget'], function ($, Quality){
    
    // 初始化数量插件
    Quality.init({
        minBtn: $('[data-quality="min"]')
        , addBtn: $('[data-quality="add"]')
        , countIpt: $('[data-quality="value"]')
        , callback: refresh_price
    });

    // 初始化选择
    $("input[name='payment_type']").eq(0).attr("checked", true);
    // 初始化属性选择
    setCombPrototypeInit(1);

    // 刷新价格
    refresh_price();

    $("#comb label").click(function(event) {
        $("#comb").find('label').removeClass('checked');
        $(this).addClass('checked');
        /* Act on the event */
        refresh_price();
    });

    $('.protoLayer .con label').click(function(event) {
        /* Act on the event */
        $(this).addClass('active').siblings().removeClass('active');
        if( $(this).find('img').length >0 ){
            var src = $(this).find('img').attr('src');
            $('.store-goods .i-img img').attr('src', src);
        }
    });

function refresh_price() {
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
    
var _region = $("#_region").val();
var is_single = $("input[name='combo_id']").eq(0).attr('data-single');
if(is_single == 1){
    $('.u-fornum').hide();
}
// mike：增加套餐切换
$(document).ready(function(){
    $("input[name='combo_id']").each(function(){
        $(this).click(function(){
            is_single = $(this).attr('data-single');
            if (is_single == 1) {
                $('.u-fornum').hide();
            }else{
                $('.u-fornum').show();
            }
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
            $(this).find('.active').find('input').prop("checked", true);
        }
    });
}
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
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
    $('button[type="submit"]').click(function(){
        attrval();
    })

    window.widget.repeatOrder.init();


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

});
function checkattrs(ev){
    var oEvent = ev || event;
    var loop = $('input[name="combo_id"]:checked').attr('data-loopindex') ? $('input[name="combo_id"]:checked').attr('data-loopindex') : $('input[name="combo_id"][checked]').attr('data-loopindex');
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

var region_code = $('#region_code').val();
if(region_code == 'MYS'){
    $("[name='state']").change(function (event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        loadCity(id);
    });
    $('[name="city"]').change(function (event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        loadDistrict(id);
    });
    $('[name="district"]').change(function (event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        loadStreet(id);
    });
    $('[name="street"]').change(function (event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-postal');
        if (id) {
            $('[name="postal"]').val(id)
        } else {
            $('[name="postal"]').val("")
        }
    });


    function loadstate() {
        var region_id = $("#region_code").attr('data-id');
        $.post('/region.php', { 'region_id': region_id }, function (data) {
            var data = JSON.parse(data);
            data.map(function (item, index) {
                $('[name="state"]').append('<option value="' + item.name + '" data-id="' + item.id_region + '">' + item.name + '</option>');
            });
            var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        });
    }
    function loadCity(id, callback) {
        $.post('/region.php', { 'yn_region_id': id }, function (data, textStatus, xhr) {
            var first = $('[name="city"]').children().first();
            $('[name="city"]').children().remove();
            $('[name="city"]').append(first);
            var districtFirst = $('[name="district"]').children().first();
            $('[name="district"]').children().remove();
            $('[name="district"]').append(districtFirst);
            var postalFirst = $('[name="street"]').children().first();
            $('[name="street"]').children().remove();
            $('[name="street"]').append(postalFirst);
            $('[name="postal"]').val("");
            var data = JSON.parse(data);
            data.map(function (item, index) {
                $('[name="city"]').append('<option value="' + item.name + '" data-id="' + item.id_region + '">' + item.name + '</option>');

            });
        });
    }
    function loadDistrict(id) {
        $.post('/region.php', { 'yn_region_id': id }, function (data) {
            var districtFirst = $('[name="district"]').children().first();
            $('[name="district"]').children().remove();
            $('[name="district"]').append(districtFirst);
            var postalFirst = $('[name="street"]').children().first();
            $('[name="street"]').children().remove();
            $('[name="street"]').append(postalFirst);
            $('[name="postal"]').val("");
            var data = JSON.parse(data);

            var newInput = '<select name="district"></select>';
            $('input[name="district"]').before(newInput);
            $('input[name="district"]').remove();
            data.map(function (item, index) {
                $('[name="district"]').append('<option data-id="' + item.id_region + '" value="' + item.name + '">' + item.name + '</option>');
            });

        });
    }
    function loadStreet(id) {
        $.post('/region.php', { 'yn_region_id': id }, function (data) {
            var first = $('[name="street"]').children().first();
            $('[name="street"]').children().remove();
            $('[name="street"]').append(first);
            var data = JSON.parse(data);
            data.map(function (item, index) {
                $('[name="street"]').append('<option data-postal="' + item.post_code + '" value="' + item.name + '">' + item.name + '</option>');
            });
        });
    };
    loadstate();
};


