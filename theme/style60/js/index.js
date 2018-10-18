TouchSlide({ slideCell:"#slider" });
var lilen = $('#slider').find('li').length;
if(lilen > 1){
    TouchSlide({
        slideCell:"#secMainImg",//（产生轮播效果的包裹元素）
        mainCell:"#slider ul",//（产生轮播效果的元素）
        autoPlay:true,//（自动分页）
        effect:"leftLoop" //（左循环滚动）
    });
}

// 计时器
var interval = 1000;
function ShowCountDown(year,month,day,divname) {
    var now = new Date();
    var endDate = new Date(year,month-1, day, now.getHours()+8);
    var leftTime=endDate.getTime()-now.getTime();
    var leftsecond = parseInt(leftTime/1000);
    var day1=Math.floor(leftsecond/(60*60*24));
    var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
    var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
    var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
    if (hour   <= 9) hour = "0" + hour;
    if (minute <= 9) minute = "0" + minute;
    if (second <= 9) second = "0" + second;
    
    $('.h').html(hour);
    $('.m').html(minute);
    $('.s').html(second);
}
window.setInterval(function(){ShowCountDown(2018,4,20,'timer');}, interval)

//
$(document).ready(function() {
    $('li[attrkey]').click(function(){
        $(this).siblings().removeClass('action');
        $(this).addClass('action');
    });

    $('.buyone').click(function(){
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
                alert($('#attr').attr('data-error'));
                return false;
            }
            url = url + "&proto="+prototype.join('|');
        }
        // 跳转
        window.location.href = url;
        return false;
    });
    $(window).scroll(function(event){
        var height = $(window).scrollTop();
        var top = $('.tip').offset().top;
        var screenHeight = window.screen.height;
        var screenScroll = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
        var alltop = $('.User_notes').offset().top;
        if(height >= top){
            $('.footer').fadeIn();
            if(alltop <= (screenHeight+screenScroll) ){
                $('.m-goToTop').fadeIn();
            }
        }else{
            $('.footer').fadeOut();
            $('.m-goToTop').fadeOut();
        }
    })
    $('.buyflex').click(function() {
        var top = $('.tip_small').offset().top;
        var url = "/checkout.php?";
        var count = parseInt($('input#num').val()) || 1;
        url = url + "count="+count;
        // 产品ID
        url = url + "&combo_id=" + 0;
        /* Act on the event */
        var prototype = [];
        if( $('.action[attrkey]').length > 0 ){
            $('.action[attrkey]').each(function(){
                var groupId = $(this).attr('data-number');
                if(groupId != ''){
                    prototype.push(groupId);
                }
            });
            if(prototype.length == $('.attrlist').length){
                url = url + "&proto="+prototype.join('|');
                window.location.href = url;
            }else{
                $(window).scrollTop(top);
                alert("กรุณาเลือกสินค้า");
            }
        }else{
            if($('input[name="attrs"]').val() == 0){
                window.location.href = url;
            }else{
                $(window).scrollTop(top);
                alert("กรุณาเลือกสินค้า");
            }
        }
    });
    $('.m-goToTop').click(function(){
        $(window).scrollTop(0);
    })
    addnumber = function(){
        $('#num').val(parseInt($('#num').val())+1);
        $(".less").css({color:'#707070'});
        refresh_price(); 
    }
    minnumber = function(){
        if($('#num').val() > 1){
            $('#num').val(parseInt($('#num').val())-1);
            $(".less").css({color:'#707070'});
            refresh_price();
        }else{
            $(".less").css({color:'#dddfe6'});
        }
    }
    inputnumber = function(){
        var number=parseInt($('#num').val());
        if(isNaN(number)||number < 1){
            $('#num').val('1');
            refresh_price();
        }else if(number > 1){
            $('#num').val(number);
        }
        //refresh_price();
    }
    // 刷新价格
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name="combo_id"],input[name=\'product_id\'],#act, input[name=\'num\']'),
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
})

require(['jquery'], function ($){
    // 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        var src = self.attr('data-img');
        if( src ){ $('#attrimg').attr('src', src); }
    });
});
    setCombPrototypeInit(1);
    var is_single = $("#comb .tab").eq(0).attr('data-single');
    if(is_single == 1){
        $('.numberbox').hide();
    }
    $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
    $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
    // 选择产品
    $("#comb .tab").click(function(event) {
        event.preventDefault();
        /* Act on the event */
        is_single = $(this).attr('data-single');
        if (is_single == 1) {
            $('.numberbox').hide();
        }else{
            $('.numberbox').show();
        }
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).find('input').attr("checked", 'true');
        $(this).siblings().find('input').attr("checked", false);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        $('[currentprice]').html($(this).attr('data-price'));

        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);    
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