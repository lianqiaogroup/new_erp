
require(['jquery', 'widget'], function($){
    window.widget.repeatOrder.init();
    window.widget.repeatOrder.getproattr();
    //短信验证
    window.widget.smsvalid && window.widget.smsvalid.init();
    // 
    $(document).ready(function(){
        // 赋值数量
        var count = Cjs.url.getParamByName('count');
        $("#mun").val(count);
        // 产品
        var combo_id = Cjs.url.getParamByName('combo_id');
        $("input[name=combo_id]").val(combo_id);
        // 隐藏其他套餐的产品
        $('#selectedProducts li').filter('[data-comboId='+combo_id+']').show();
        $('.cnt .combosid_'+combo_id).show();
        // 支付方式
        $('input[name=payment_type]').eq(0).prop('checked', true);

        // 获取属性
        var shuxing = Cjs.url.getParamByName('proto') || "";
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
                var groud = obj[1];
                var value = obj[2];
                $("input[name='attr["+key+"-"+groud+"]']").val(value);
                // 如果有套餐产品则显示下面
                $('#selectedProducts').find("[data-optionsGroup='"+key+"-"+groud+"'][data-id='"+value+"']").show();
            });
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
        
        $('.combo').click(function(){
            refresh_price();
        });

    });
    $('[name="state"]').change(function(event) {
        var id = $(this).children().filter(':selected').attr('data-id');
        loadCity(id);
    });
    $('[name="city"]').change(function(event) {
        var id = $(this).children().filter(':selected').attr('data-id');
        loadDistrict(id);
    });
    function loadstate(){
        var region_id = $('select[name="province"]').val();
        $.post('/region.php', { 'region_id': region_id }, function(data) {
            var data = JSON.parse(data);
                data.map(function(item, index){
                    $('[name="state"]').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');
                });
            var id = $('[name="state"]').children().filter(':selected').attr('data-id');
        });
    }
    function loadCity(id, callback){
        $.post('/region.php', { 'yn_region_id': id }, function(data, textStatus, xhr) {
            $('[name="city"]').children().not(":eq(0)").remove();
            $('[name="district"]').children().not(":eq(0)").remove();
            var data = JSON.parse(data);
            data.map(function(item, index){
                $('[name="city"]').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');
            });
        });
    }
    function loadDistrict(id){
        $.post('/region.php', { 'yn_region_id': id }, function(data) {
            $('[name="district"]').children().not(":eq(0)").remove();
            var data = JSON.parse(data);
                data.map(function(item, index){
                    $('[name="district"]').append('<option value="'+item.name+'">'+item.name+'</option>');
                });
        });
    }
    loadstate();
});
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
        data: $('input[name=combo_id], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
            if(json.ret){
                var _total = json.total;
                if( json.new_price_format ) _total=json.new_price_format.price_format;
                $("#price").html(_total);
                $("input[name='price']").val(json.total);
            }
        }
    });
};
var region_code = $("#region_code").val();
if (region_code == 'Rp') {
    var payInfo = true;
    $('input[name="name"]').on("keydown", function () {
        if (payInfo) {
            fbq('track', 'AddPaymentInfo');
            payInfo = false;
        };
    });

}
