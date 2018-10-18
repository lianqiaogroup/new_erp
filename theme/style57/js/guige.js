require(['jquery','widget'], function ($){
	//初始化选择
	setCombPrototypeInit(1);
	// $("#comb .tab").eq(0).addClass('tab-sel').find('input').prop("checked", 'true');
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
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).siblings().find('input').prop("checked", false);        
        $(this).find('input').prop("checked",true);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        $('input[name="combo_id"]').val($('input[name="combo"]:checked').val());
        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);
    });
	// 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.find('input').prop('checked',true);
        self.siblings().find('input').prop('checked',false);
        var data_index = self.parents('section').attr('data-loopindex');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').find('input').attr("checked", 'true');
        $('input[name="combo_id"]').val($('input[name="combo"]:checked').val());
    });
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo"]:checked').val() ? $('input[name="combo"]:checked').val() : $('input[name="combo"][checked]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo"]:checked').parent('label').attr('data-loopindex') ? $('input[name="combo"]:checked').parent('label').attr('data-loopIndex') : $('input[name="combo"][checked]').parent('label').attr('data-loopIndex');
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
                var a = $(this).find('.tab-sel').find('input[type="radio"]').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopindex]').eq(sectionIndex-1).find('.tc[data-goods]').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('[data-prototype-group]').each(function(i,e){
                    var that = this;
                    a.push($(that).find('.tab-sel').find('input[type="radio"]').val());
                });
                attrs[index].push(a);
            });
        }
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('button[type="submit"]').click(function(){
        attrval();
    })
    window.widget.repeatOrder.init();
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();
})
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    $('section[data-loopindex]').find('input').removeAttr("checked");
    section.find('li.protoLayer').each(function(){
        if($(this).find('.tab').length == 1){
            var first = $(this).find('.tab').removeClass('tab-sel').eq(0).addClass('tab-sel');
            $(this).find('.tab').eq(0).find('input').prop('checked',true);
        }
        if($(this).find('.tab-sel').length != 0){
            $(this).find('.tab-sel').find('input[type="radio"]').prop('checked',true);
        }
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

function checkattrs(ev){
    var oEvent = ev || event;
    var loop = $('#comb').find('.tab-sel').attr('data-loopindex');
    var attr = $('section[data-loopIndex="'+ loop +'"] ').find('.u-format.count_atrr');
    if( attr.length > 0 ){
        var prototype = [];
        attr.each(function(){
            var dom = $(this).find('.tab-sel');
            var prototypeId = dom.find('input[type="radio"]:checked').val();
            if(typeof(prototypeId) != 'undefined'){
                prototype.push(prototypeId);
            }
        });
        if(prototype.length < attr.length){
            alert($('#page-order').attr('data-error'));
            $(window).scrollTop($('#page-order').offset().top);
        }else{
            $('.buy_now[data-cuckootag="confirm_order"]').trigger('click');
        }
    }else{
        $('.buy_now[data-cuckootag="confirm_order"]').trigger('click');
    }
}

