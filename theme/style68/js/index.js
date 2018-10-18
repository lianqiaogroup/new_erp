require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var galleryTop = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight: true
    });
    //预计送达时间
    var myDate = new Date();
    myDate.setDate(myDate.getDate()+3);
    var date2 = new Date();
    date2.setDate(date2.getDate()+7);
    var arrival_time = (myDate.getMonth()+1) + '/' + myDate.getDate() + '-' + (date2.getMonth()+1) + '/' + date2.getDate();
    $('#timer').html(arrival_time);
    //倒计时
    widget.timeSet(2018,4,20,'times','tw');
    window.widget.repeatOrder.init();
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]').val();
        var product_id = $('input[name="product_id"]').val();
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex="'+ combo_id +'"]').find('[data-prototype-group]').each(function(){
                var a = $(this).find('select').val();
                if(a){
                    attrs.push(a);
                }
            });
        }else{
            var attrs = [];
            $('section[data-loopIndex="'+ combo_id +'"]').find('.item').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('[data-prototype-group]').each(function(i,e){
                    var that = this;
                    a.push($(that).find('select').val());
                });
                attrs[index].push(a);
            });
        }
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('button[type="submit"]').click(function(){
        attrval();
    });

    $(window).scroll(function(event) {
        /* Act on the event */
        var st = $(window).scrollTop();
        var h = $(window).height();
        var bst = $('#buyButton1').offset().top;
        if( st > bst ){
            $('.footer .submit').show();
        }else{
            $('.footer .submit').hide();
        }
    });

})

$('.tabbox').on('click','.item',function(){
    $(this).siblings().removeClass('action');
    $(this).addClass('action');
    var id = $(this).attr('rel');
    if(id == "2"){
        $('#tab2').addClass('open');
    }else{
        $('#tab2').removeClass('open');
    }
})

$('.dxbox').each(function(){
    $(this).find('label').eq(0).addClass('tab-sel');
});

refresh_price();
$('.dxbox label').on('click',function(){
    var allItem = $(this).parent().find('label');
    for(var i = 0;i<allItem.length;i++){
        allItem.eq(i).removeClass('tab-sel');
        $(this).addClass('tab-sel');
    }
})

var is_single = $("#combo_id li").eq(0).attr('data-single');
if(is_single == 1){
    $('.numdiv').hide();
}

//点击选中产品
if($('#combo_id .action').attr('rel') != 0){
    setCombPrototypeInit($('#combo_id .action').attr('rel'));
}

$('#combo_id li').click(function(){
    is_single = $(this).attr('data-single');
    if (is_single == 1) {
        $('.numdiv').hide();
    }else{
        $('.numdiv').show();
        }
    var index = $(this).attr('rel');
    $(this).siblings().removeClass('action');
    $(this).addClass('action');
    $('section[data-loopindex]').hide();
    $('section[data-loopindex="'+ index +'"]').show();
    $('input[name="combo_id"]').removeAttr("checked");
    $(this).find('input').prop('checked', true);
    refresh_price();
    if(parseInt(index) != 0){
        setCombPrototypeInit(index);
    }
})
$('.combosel').change(function(){
    var attrname = $(this).attr('data-id');
    var attrsid = $(this).val();
    $('#attr_div').find('input[name="'+ attrname +'"]').val(attrsid);
})
function setCombPrototypeInit(sectionIndex){
    var input = [];
    $('section[data-loopindex="'+ sectionIndex +'"]').find('select.dxbox').each(function(){
            var attrs = $(this).attr('data-id');
            var attrid = $(this).val();
            input += '<input type="hidden" name="'+ attrs +'" value="'+ attrid +'">';
    });
    $('#attr_div').html('').append(input);
}
//订单查询
function check_order(){
    var mob = $('input[name="inmob"]').val();
    var identity_tag = $('#identity_tag').val();
    window.widget.goto_checkOrder({
        phone: mob,
        identity_tag: identity_tag
    });
}

function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    var num = $('#num').val();
    $('.textWrap .tt span').html(num);
    refresh_price();
}
function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        var num = $('#num').val();
        $('.textWrap .tt span').html(num);
        refresh_price();
    }
}
function refresh_price(){
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name="combo_id"]:checked,input[name=\'product_id\'], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
            if(json.ret){
                $("#total").html(json.total);
                if($('#region_code').val() == 'SAU'){
                    if(parseInt(json.total) >= 900){
                        $('.cardshow').show();
                        $('input[name="id_card"]').attr('required','required');
                    }else{
                        $('.cardshow').hide();
                        $('input[name="id_card"]').removeAttr('required');
                    }
                }
            }else{
                alert(json.msg)
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });
}

window.submitTimeID = null;
function checkattrs(ev){
    if (prepostLock==true) return false;
    if (ga_btn_event_locked==true) return false;
    // 
    clearTimeout(submitTimeID);
    submitTimeID = setTimeout(function(){
        var loop = $('input[name="combo_id"]:checked').attr('data-loopindex');
        var attr = $('section[data-loopIndex="'+ loop +'"] ').find('select.dxbox');
        if( attr.length > 0 ){
            var prototype = [];
            attr.each(function(){
                var prototypeId = $(this).val();
                if(parseInt(prototypeId) != 0){
                    prototype.push(prototypeId);
                }
            });
            if(prototype.length < attr.length){
                alert($('#product_attr').attr('data-error'));
                $(window).scrollTop($('#form').offset().top);
            }else{
                widget.postintdata();
                $('a[data-cuckootag="confirm_order"]').trigger('click');
            }
        }else{
            widget.postintdata();
            $('a[data-cuckootag="confirm_order"]').trigger('click');
        }
    }, 300);
}