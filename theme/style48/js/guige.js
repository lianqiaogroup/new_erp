require(['jquery'], function ($){
    // 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        var src = self.attr('data-img');
        if( src ){ $('#attrimg').attr('src', src); }
        cur_chosen();
    });
});
    setCombPrototypeInit(1);
    $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
    $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
    singleCombo();
    // 选择产品
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
        cur_chosen();
        singleCombo();
    });
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
    });
}
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') ? $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') : $('input[name="combo_id"][checked]').parent('.tab').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.qty').hide();
    }else{
        $('#num').parents('.qty').show();
    }
}

function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    $('.textWrap .tt span').html($('#num').val()); 
}

function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.textWrap .tt span').html($('#num').val());
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
    var loop = $('#comb .tab-sel').attr('data-loopindex');
    var attr = $('section[data-loopIndex="'+ loop +'"] ').find('.u-format.count_atrr');
    if( attr.length > 0 ){
        attr.each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).attr('data-select');
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if( prototype.length < attr.length ){
            alert($('#page-order').attr('data-error'));
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }
    // 跳转
    window.location.href = url;
    return false;
}
function cur_chosen(){
    var chosen = '';
    var loop = parseInt($(".tab-sel").eq(0).attr('data-loopindex'))-1;
    // console.log($("package .tab-sel").length)
    var tab = $('section[data-loopindex]').eq(loop);
        for(var i =0; i < tab.length; i++){
            var attr_num = tab.eq(i).find('.tab-sel');
            if(attr_num.length){
                for (var j =0; j < attr_num.length-1; j++){
                    chosen += '<span>'+ attr_num.eq(j).find('span').html()+'</span>,'
                }
                chosen += '<span>'+ attr_num.eq(j).find('span').html()+'</span>;'
            }
        }
    $('.choose span').html(chosen);
    
}
if ($('.attr').is(':visible')) {
   cur_chosen();
}