$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("#mun").val(count);
    // 产品
    var combo_id = Cjs.url.getParamByName('combo_id');
    $("input[name=combo_id]").val(combo_id);
    var product_id = Cjs.url.getParamByName('product_id');
    $("input[name=product_id]").val(product_id);
    // 隐藏其他套餐的产品
    $('#selectedProducts li').filter('[data-comboId='+combo_id+']').show();
    $('.cnt .combosid_'+combo_id).show();
    // 支付方式
    $('input[name=payment_type]').eq(0).prop('checked', true);

    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto');
    if(shuxing){
        var shuxingArr = shuxing.split('|');
        if(parseInt(combo_id) == 0){
            shuxingArr.map(function(elem, index) {
                var obj = elem.split('-')
                var key = obj[0];
                var value = obj[1];
                $("input[name='attr["+key+"]']").val(value);
                var domgroup = $('[optionsGroup]').filter("[data-id='"+key+"']")
                    domgroup.find('[data-id='+value+']').show();
            });
        }else{
            shuxingArr.map(function(elem, index) {
                var obj = elem.split('-')
                var key = obj[0];
                var groud = obj[1]
                var value = obj[2];
                $("input[name='attr["+key+"-"+groud+"]']").val(value);
                var domgroup = $('[optionsGroup]').filter("[data-id='"+key+"-"+groud+"']")
                    domgroup.find('[data-id='+value+']').show();
                // 如果有套餐产品则显示下面
                $('#selectedProducts').find("[data-optionsGroup='"+key+"-"+groud+"'][data-id='"+value+"']").show();
            });
        }
    }
    // 删除没有选的属性
    $('.selectedPrototype input').filter('[value=""]').remove();
    // 如果属性有图则替换
    $('#selectedProducts li:visible .forAttrImg').map(function(index, item){
        var self = $(item);
        console.log(self)
        var next = self.next().find('span[attrimg]');
            next.map(function(index, item){
                if( $(item).attr("attrimg") != "" && $(item).is(":visible") ){
                    self.attr('src', $(item).attr('attrimg'));
                }
            });
    });
    // 刷新价格
    refresh_price();
    
    require(['jquery', 'widget'], function($){
        window.widget.repeatOrder.init();
        window.widget.repeatOrder.getproattr();
        // 短信验证
        window.widget.smsvalid && window.widget.smsvalid.init();
    });

    var is_single = $('#selectedProducts li:visible').eq(0).attr('data-single');
    if(is_single == 0){
        $('.u-format').parent().show()
    }
});
$('.combo').click(function () {
    refresh_price();
}) ;

function addnumber(){
    $('#mun').val(parseInt($('#mun').val())+1);
    refresh_price() ;
}
function minnumber(){
    if($('#mun').val()>1){
        $('#mun').val(parseInt($('#mun').val())-1);
        refresh_price() ;
    }
}
function inputnumber(){
    var number=parseInt($('#mun').val());
    if(isNaN(number)||number < 1){
        $('#mun').val('1');
        $('.textWrap .tt').html(1);
        refresh_price();
    }else if(number > 1){
        $('#mun').val(number);
        $('.textWrap .tt span').html(number);
    }
    refresh_price();
}
    
function refresh_price() {
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name=combo_id],input[name=\'product_id\'],#act, input[name=\'num\']'),
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
var marquee = new Array(
    "<p><span>[最新購買]：</span>張**（095***6831）在1分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>李**（093***1685）在3分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>趙**（091***8603）在5分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>劉**（093***3943）在2分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>張**（098***5500）在4分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>王**（092***0214）在6分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>"
);
var wfgdaa = 0;
var wfgdbb = 1;
function marqueeL(){
    if(wfgdaa>(marquee.length-1))
    wfgdaa = 0;
    if(wfgdbb>(marquee.length-1))
    wfgdaa = 0;
    wfgdbb = wfgdaa +1;
    var marHTML = marquee[wfgdaa]+marquee[wfgdbb];
    document.getElementById("fahuo").innerHTML = marHTML;
    wfgdaa +=1;
    wfgdbb +=1;
}
window.setInterval("marqueeL()", 3000);


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

var region_code = $('#region_code').val();
if (region_code == 'MYS') {
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


