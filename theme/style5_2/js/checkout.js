require(['jquery', 'widget'], function($){
    window.widget.repeatOrder.init();
    window.widget.repeatOrder.getproattr();
    //短信验证
    window.widget.smsvalid && window.widget.smsvalid.init();
    // 
    $(document).ready(function(){
        // 赋值数量
        var count = Cjs.url.getParamByName('count');
        var product_id = Cjs.url.getParamByName('product_id');
        $("input[name=product_id]").val(product_id);
        
        var combo_id = Cjs.url.getParamByName('combo_id');
        $("input[name=combo_id]").val(combo_id);
        var is_single = Cjs.url.getParamByName('is_single');
        if(parseInt(is_single) == 1){
            $('#mun').val(1);
            $('#mun').parents('.item').hide();
        }else{
            $("#mun").val(count);
            $('#mun').parents('.item').show();
        }
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