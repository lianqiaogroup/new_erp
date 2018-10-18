$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("#mun").val(count);
    $('.product_numtext').html("   ×"+count);
    // 产品
    var combo_id = Cjs.url.getParamByName('combo_id');
    $("input[name=combo_id]").val(combo_id);
    //获取套餐
    var combokey = '.combosid_'+combo_id.toString();
    //console.log(combokey);
    $(combokey).show();
    //$(combokey).show();
    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto') || "";
    var shuxingArr = shuxing.split('|');
    var str = [];
    //console.log(combo_id);
    if(parseInt(combo_id) != 0){
        shuxingArr.map(function(elem, index) {
            var obj = elem.split('-');
            var goodsid = obj[0]
            var group = obj[1];
            var value = obj[2]; 
            str.push('<input type="hidden" name="attr['+ obj[0]+'-'+ obj[1] +']" value="'+ obj[2] +'">');
            $('[optionsGroup]').siblings().children().children("[goodid='"+goodsid+"'][group='"+group+"'][attrid='"+value+"']").show();
                //domgroup.find('[data-id='+value+']').show();
        });
    }else{
        shuxingArr.map(function(elem, index) {
            var obj = elem.split('-');
            //var goodsid = obj[0]
            var group = obj[0];
            var value = obj[1];
            str.push('<input type="hidden" name="attr['+obj[0] +']" value="'+ obj[1] +'">');
            $('[optionsKey][data-id="'+ value +'"]').show();
            //var domgroup = $('[optionsGroup]').siblings("[goodid='"+goodsid+"'][group='"+group+"'][attrid='"+value+"']").show();
                //domgroup.find('[data-id='+value+']').show();

        });
    }
    // 如果属性有图则替换
    $('.attr span[optionskey]:visible').map(function(index, item){
        var self = $(item);
        if( $(item).attr("attrimg") != "" && $(item).is(":visible") ){
            $(item).parents('.single').find('.imgWrap img').attr('src', $(item).attr('attrimg'));
        }
    });

    // 
    $('#form').append(str.join(''));

    // 
    refresh_price();

    // init paymethod 
    init_paymethod({
        onChange: function(value){
            $('.cell label[for="'+value+'"]').addClass('check').siblings().removeClass('check');
        }
    });

});


// init paymethod 
function init_paymethod(param){
    var elem = $('[name="payment_type"]');
    function addEvents(){
        elem.change(function(){
            var value = elem.filter(":checked").val();
            onChange(value);
        });
    }addEvents();
    function onChange(value){
        if( !value ){
            elem.eq(0).prop('checked', true);
            value = elem.filter(":checked").val();
        }else{
            elem.filter('[value="'+value+'"]').prop('checked', true);
        }
        value == 4 ? $('#ocean-div').fadeIn() : $('#ocean-div').fadeOut();
        param.onChange && param.onChange.call(elem, value);
    }onChange();
}

// 
function refresh_price(){
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name=combo_id], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret){
                $('combprice').html(json.total);
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

// 
function postcheck(){
    // paymethod
    var pay_type = $("input[name='payment_type']:checked").val();
    if(pay_type ==4)
    {
        if(!document.getElementById("card_number").value||!document.getElementById("card_month").value||!document.getElementById("card_year").value||!document.getElementById("card_secureCode").value){
            var error =  document.getElementById("error").value
            alert(error);
            return false;
        }
        var code  =  document.getElementById("code").value ;
        var opcseForm = opcse.encryptForm("form", code);
            opcseForm.handleSubmit();
    }
    return true;
}



if(($('select[name="province"]').val()) == 15){
    $('#province').css('width','45%');

}
$('.back').on('click',function(){
    history.go(-1);
})