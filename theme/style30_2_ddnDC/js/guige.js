require(['jquery'], function ($){
	//初始化选择
	setCombPrototypeInit(1);
	// $("#comb .tab").eq(0).addClass('tab-sel').find('input').attr("checked", 'true');
    singleCombo();
	$("#comb .tab").click(function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).find('input').attr("checked", 'true');
        $(this).siblings().find('input').attr("checked", false);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        $('[currentprice]').html($(this).attr('data-price'));
        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);
        refresh_price();
        singleCombo();
    });

    // $('.u-format.count_atrr').each(function(){
    //     var obj = $(this).find('.tab');
    //     var id = obj.attr('data-id');
    //     $(this).attr('data-select', id);
    // });
	// 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        var src = self.attr('data-img');
        if( src ){ $('#attrimg').attr('src', src); }
        var data_index = self.parents('section').attr('data-loopindex');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').find('input').attr("checked", 'true');
    });

})
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    section.find('li.protoLayer').each(function(){
        if($(this).find('.tab').length == 1){
            var first = $(this).find('.tab').removeClass('tab-sel').eq(0).addClass('tab-sel');
            var id = first.attr('data-id');
            $(this).find('.u-format.count_atrr').attr('data-select', id);
        }
        if(section.find('li.protoLayer').length == section.find('.tab-sel[data-name]').length){
            $('#comb .tab').eq(sectionIndex-1).addClass('tab-sel').find('input').attr("checked", 'true');
        }
        
    });
}
function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
        $('.textWrap .tt').html($('#num').val());
    refresh_price(); 
}

function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.textWrap .tt').html($('#num').val());
        refresh_price();
    }
}

function inputnumber(){
    var number=parseInt($('#num').val());
    if(isNaN(number)||number < 1){
        $('#num').val('1');
        $('.textWrap .tt').html(1);
        refresh_price();
    }else if(number > 1){
        $('#num').val(number);
        $('.textWrap .tt span').html(number);
    }
    refresh_price();
}

// 刷新价格
function refresh_price() {
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('#comb input[checked=checked],input[name=\'product_id\'], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret)
           {
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
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') ? $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') : $('input[name="combo_id"][checked]').parent('.tab').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.u-fornum').hide();
    }else{
        $('#num').parents('.u-fornum').show();
    }
}
// 提交表单
function postcheckGuige() {
    var url = "/checkout.php?";

    // 数量
    var count = parseInt($('input#num').val()) || 1;
    url = url + "count="+count;

    // 产品ID
    var comb_id = $("#comb .tab-sel").find('input').val();
    if(typeof(comb_id) == 'undefined'){
        alert($('#page-order').attr('data-error'));
        return false;
    };
    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comb_id + '&product_id=' + productId;
    
    /* Act on the event */
    var prototype = [];
    if( $('section[data-loopIndex]:visible .u-format.count_atrr').length > 0 ){
        $('section[data-loopIndex]:visible .u-format.count_atrr').each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).attr('data-select');
            console.log(prototypeId)
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if( prototype.length < $('section[data-loopIndex]:visible .u-format.count_atrr').length ){
            alert($('#page-order').attr('data-error'));
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }
                
    // 跳转
    window.location.href = url;
    return false;
}
$('.buy_now').on('click', function() {
    $('#page-order').show();
    $('#page-index').hide();
});
//隐藏属性层
$('.back').on('click',function(){
    $('#page-order').hide();
    $('#page-index').show();
})