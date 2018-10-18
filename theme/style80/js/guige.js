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
    });
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
    window.widget.repeatOrder.init();
    loadstate();
    $('select[name="state"]').change(function(){
        var id = $(this).children().filter(':selected').attr('data-id');
        loadCity(id);
    });
    $('select[name="city"]').change(function(){
        var id = $(this).children().filter(':selected').attr('data-id');
        loadDistrict(id);
    });
});
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
function loadstate(){
    var region_id = $('[name=\"province\"]').val();
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
        if( data.length == 0 ){
            var newInput = $('[name="district"]').children().first();
            $('select[name="district"]').children().remove();
            $('select[name="district"]').append(newInput);
        }else{
            var newInput = '<select name="district"></select>';
            $('input[name="district"]').before(newInput);
            $('input[name="district"]').remove();
            data.map(function(item, index){
                $('[name="district"]').append('<option value="'+item.name+'">'+item.name+'</option>');
            });
        }
    });
}
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide().eq(sectionIndex-1).show();
    $('section[data-loopindex]').find('input').removeAttr("checked");
    
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

// 
window.submitTimeID = null;
function checkAttrs() {
    if (prepostLock==true) return false;
    if (ga_btn_event_locked==true) return false;
    clearTimeout(submitTimeID);
    submitTimeID = setTimeout(function(){
        var count_atrr = $('section[data-loopindex]:visible .count_atrr').length;
        var attr_empty = false;
        $('section[data-loopindex]:visible .count_atrr').each(function(){
            if(!$(this).find('input:checked').val()){
                alert($('.dt-paramselect').attr('data-error'));
                attr_empty = true;
                return false;
            }
        })
        if(attr_empty){
            $(window).scrollTop($('#ui-paramselect').offset().top);
            return false;
        }
        attrval();
        widget.postintdata();
        $('a[data-cuckootag="confirm_order"]').trigger('click');
    }, 200);
}