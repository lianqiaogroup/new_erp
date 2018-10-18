   
$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("[jsrender='count']").html(count);
    $("#num").val(count);
    // 产品
    var combo_id = Cjs.url.getParamByName('comb_id');
    $("input[name=combo_id]").val(combo_id);
    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto') || "";
    var shuxingArr = shuxing.split('|');
    shuxingArr.map(function(elem, index) {
        var obj = elem.split('-')
        var key = obj[0];
        var value = obj[1];
        $("input[name='attr["+key.replace('*','-')+"]']").val(value);
    });
    // 删除没有选的属性
    $('.selectedPrototype input').filter('[value=""]').remove();
    // 刷新价格
    refresh_price();

    // 回到顶部
    $("#div_toTop").click(function(event) {
        $(window).scrollTop(0);
    });


    // 付款方式
    $('input[name=payment_type]').eq(0).attr('checked', true);
    $('input[name=payment_type]').eq(0).parent().addClass('active');
    $('.paymethod .boxer').click(function(event) {
        event.preventDefault();
        $(this).addClass('active').parent().siblings().children().removeClass('active');
        $(this).children('input').attr('checked', true);
        $(this).parent().siblings().find('input').attr('checked', false);
    });

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
            data: $('input[name=combo_id], #act, input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
               if(json.ret)
               {
                    $("#price").html(json.total);
                    $("currentprice").html(json.price);
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
    
    function  postcheck() {
         //FIXME: js验证数据 balabala
         $('#div_buyMask').show();
         $('#div_buyMask_info').show();
         return true;
    }
