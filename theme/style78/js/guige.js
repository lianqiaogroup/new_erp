require(['jquery','widget'], function ($){
	//初始化选择
	setCombPrototypeInit(1);
	$("#comb .tab").eq(0).addClass('tab-sel').find('input').prop("checked", 'true');
    $('input[name="payment_type"]').eq(0).prop('checked',true);
    $('input[name="combo_id"]').val($('input[name="combo"]:checked').val());
    var is_single = $("#comb .tab").eq(0).attr('data-single');
    if(is_single == 1){
        $('.u-fornum').hide();
    }
	$("#comb .tab").click(function(event) {
        event.preventDefault();
        /* Act on the event */
        is_single = $(this).attr('data-single');
        if (is_single == 1) {
            $('.u-fornum').hide();
        }else{
            $('.u-fornum').show();
        }
        price = $(this).attr('data-price');
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).siblings().find('input').prop("checked", false);        
        $(this).find('input').prop("checked",true);
        $('#comb').attr('data-price', price);
        $('input[name="combo_id"]').val($('input[name="combo"]:checked').val());
        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);
        refresh_price(num,price);
    });
	// 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.find('input').prop('checked',true);
        self.siblings().find('input').prop('checked',false);
    });
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('#comb .tab-sel').attr('data-loopindex');
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val() ? $(this).find('input[type="radio"]:checked').val() : $(this).find('input[type="radio"][checked]').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('[combproduct]').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('[data-prototype-group]').each(function(i,e){
                    var that = this;
                    a.push($(that).find('input[type="radio"]:checked').val());
                });
                attrs[index].push(a);
            });
        }
        console.log(attrs)
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('button[type="submit"]').click(function(){
        attrval();
    })
    window.widget.repeatOrder.init();
})
var price = parseInt($('#comb .tab').eq(0).attr('data-price'));
var num = 1;
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    $('section[data-loopindex]').find('input').removeAttr("checked");
    section.find('li.protoLayer').each(function(){
        var first = $(this).find('.tab').removeClass('tab-sel').eq(0).addClass('tab-sel');
        $(this).find('.tab').eq(0).find('input').prop('checked',true);
    });

}
function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    $('.textWrap .tt').html($('#num').val());
    num = $('#num').val();
    refresh_price(num,price);
}

function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.textWrap .tt').html($('#num').val());
        num = $('#num').val();
        refresh_price(num,price);
    }
}
function refresh_price(n,p){
    $('.total span').html(n*p);
}
refresh_price(num,price);