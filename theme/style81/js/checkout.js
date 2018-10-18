$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("#mun").val(count);
    $(".num_coun").html(count)
    // 产品
    var combo_id = Cjs.url.getParamByName('comb_id');
    $("input[name=combo_id]").val(combo_id);
    // 隐藏其他套餐的产品
    // $('#selectedProducts li').not('[data-comboId='+combo_id+']').hide();
    $('#selectedProducts li').filter('[data-comboId='+combo_id+']').show();
//获取套餐
    var combokey = '.combosid_'+combo_id.toString();
    $(combokey).show();
    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto') || "";
    var shuxingArr = shuxing.split('|');
    shuxingArr.map(function(elem, index) {
        var obj = elem.split('-')
        var key = obj[0];
        var value = obj[1];
        $("input[name='attr["+key.replace('*','-')+"]']").val(value);
        var domgroup = $('[optionsGroup]').filter("[data-id='"+key+"']")
            domgroup.find('[data-id='+value+']').show();
        
        // 如果有套餐产品则显示下面
        $('#selectedProducts').find("[data-optionsGroup='"+key+"'][data-id='"+value+"']").show();
        var dom = $("[data-optionsGroup='"+key+"'][data-id='"+value+"']").parents(".shuxing_tc").find(".thumb_shuxing");
        var thumbimg = $("[data-optionsGroup='"+key+"'][data-id='"+value+"']").attr("attr-img") ? $("[data-optionsGroup='"+key+"'][data-id='"+value+"']").attr("attr-img") : $('[data-id='+value+']').attr('attr-img');
        if(thumbimg){
            dom.attr('src',thumbimg);
            if(combo_id == 0){
                $('[data-id='+value+']').parents(".m-goodItem").find('.attrimg').attr('src',thumbimg);
            }
        }
    });
    //运费显示
    var text_e = $(".shipping_1").text();
    if (text_e =="" || text_e == 0 || text_e == 0.00){
        $(".rre").html("免郵配送")
    }
    // 删除没有选的属性
    $('.selectedPrototype input').filter('[value=""]').remove();
    // 刷新价格
    refresh_price();
}) ;

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
    
function refresh_price() {
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name=combo_id],input[name=\'product_id\'], #act, input[name=\'num\']'),
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
function postcheck(){

    return true;
}