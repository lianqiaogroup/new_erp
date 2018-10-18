require(['jquery'], function ($){
	//初始化选择
	
    var is_single = $("#comb .tab").eq(0).attr('data-single');
    if(is_single == 1){
        $('.u-fornum').hide();
    }
	$("#comb .tab").eq(0).addClass('tab-sel').find('input').attr("checked", 'true');
    setCombPrototypeInit(1);
    
	$("#comb .tab").click(function(event) {
        event.preventDefault();
        /* Act on the event */
        is_single = $(this).attr('data-single');
        if (is_single == 1) {
            $('.u-fornum').hide();
        }else{
            $('.u-fornum').show();
        }
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).find('input').attr("checked", 'true');
        $(this).siblings().find('input').attr("checked", false);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        $('[currentprice]').html($(this).attr('data-price'));

        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);
    });

    $('.u-format.count_atrr').each(function(){
        var obj = $(this).find('.tab');
        var id = obj.attr('data-id');
        $(this).attr('data-select', id);
        $(this).find('.tt span').html($(this).find('.tab').eq(0).attr('data-name'));
    });
	// 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        self.parents('.u-format.count_atrr').find('.tt span').html(self.attr('data-name'));
    });

})
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    $('#price').html($('#comb').find("label.tab-sel").attr('data-price'));
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    section.find('li.protoLayer').each(function(){
        var first = $(this).find('.tab').removeClass('tab-sel').eq(0).addClass('tab-sel');
        var id = first.attr('data-id');
        $(this).attr('data-select', id);
    });
}
function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
        $('.textWrap .tt').html($('#num').val()); 
}

function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.textWrap .tt').html($('#num').val());
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
        if( prototype.length == 0 ){
            alert('请选择属性');
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }
                
    // 跳转
    window.location.href = url;
    return false;
}
$('.buy_now').on('click', function() {
        postcheckGuige();
});