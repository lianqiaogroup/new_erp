require(['jquery','swiper','widget'], function ($,swiper){
    // 回到顶部
    var $doc=$(document);
    $(".m-goToTop").hide();
    //窗口加滚动触发
    $(window).scroll(scrollfun);
    function scrollfun(){
        var hei=$(window).height();
        if($doc.scrollTop()>=1000){
            $(".m-goToTop").slideDown();

        }else{
            $(".m-goToTop").slideUp();
        }
    }
    $(".m-goToTop").click(back);
    function back(){
        //全兼容各浏览器
        $('html,body').scrollTop(0);
    }
    //
    var myDate = new Date();
    myDate.setDate(myDate.getDate()+15);
    var date2 = new Date();
    date2.setDate(date2.getDate()+20);
    var arrival_time = (myDate.getMonth()+1) + '/' + myDate.getDate() + '-' + (date2.getMonth()+1) + '/' + date2.getDate();
    $('#timer').html(arrival_time);

    $('.back_index').on('click', function(event) {
        event.preventDefault();
        $('#page-order').hide()
        $("#page-index").show();
        var comob = $("#comb .tab-sel").find('input').val()
            , comob_title = $("#comb .tab-sel").find('span').html();
        var len = $('.attrname').length;
        var html = [];
        if( len == 0 ){
            html.push(comob_title);
            html = html.join(' ');
        }else{
            for(var i = 0 ;i < len; i ++){
                if(comob == 0){
                    var name = $('.attrname').eq(i).html();
                }else{
                    var name = $('section[comobid="'+comob+'"]').find('.attrname').eq(i).html();
                }  
                if(name){
                    html.push(name + " ");
                }
            }
        }
        $('.taocan').html(html);
    });
    $('#val-sel').on('click', function(event) {
        event.preventDefault();
        $('#page-order').show();
        $("#page-index").hide();
        refresh_price();
        $(window).scrollTop(0);
    });

    // 轮播图
    var h = $(window).height();
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'fraction',
    });

    // 初始化选择
    $("#comb .tab").eq(0).addClass('tab-sel').find('input').prop("checked", true);
    $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
    $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
    setCombPrototypeInit(1);
    
    var is_single = $("#comb .tab").eq(0).attr('data-single');
    if(is_single == 1){
        $('.numberbox').hide();
    }
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
        $(this).find('input').prop("checked", true);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        var singlePrice = $(this).attr('data-price');
        var count = $('#num').val();
        $('[currentprice]').html(singlePrice*count);
        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);
        refresh_price();
    });

    // 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        var name = self.attr('data-name');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        self.parents('.u-format.count_atrr').find('.attrname').html(name);
        self.find('input').prop('checked', true);
        var src = self.attr('data-img');
        if( src ){ $('#attrimg').attr('src', src); }
        //$(".arrt_name_this").html(self.text());
    });
    //套餐显示在主页及数量按钮变化
        $(".more").css({color:'#252C41'});
        $(".less").click(function () {
            $(".less").css({color:'#252C41'});
            $(".more").css({border:'2px solid #dddfe6',color:'#dddfe6'});

        })
        $(".more").click(function () {
            $(".more").css({color:'#252C41'});
            $(".less").css({border:'2px solid #dddfe6',color:'#dddfe6'});
        });
        var comob = $("#comb .tab-sel").find('input').val();
        var aa_1 = $("#comb .tab .text_this").eq(0).text();
        if(comob != 0){
            //$(".taocan").html(aa_1);
        }
        $("#comb .tab").click(function () {
            var text_list = $(this).index();
            var aa = $("#comb .tab .text_this").eq(text_list).text();
        });
        $('.inquiry').click(function(){
            var url = '/order_quality.php';
            window.location.href = url;
        });
    window.widget.repeatOrder.init();
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]:checked').val() ? $('input[name="combo_id"]:checked').val() : $('input[name="combo_id"][checked]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo_id"]:checked').parent('label').attr('data-loopIndex') ? $('input[name="combo_id"]:checked').parent('label').attr('data-loopIndex') : $('input[name="combo_id"][checked]').parent('label').attr('data-loopIndex');
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('li.protoLayer').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopindex]').eq(sectionIndex-1).find('[comboproduc]').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('li.protoLayer').each(function(i,e){
                    var that = this;
                    a.push($(that).find('input[type="radio"]:checked').val());
                });
                attrs[index].push(a);
            });
        }
        console.log(attrs);
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('button[type="submit"]').click(function(){
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
            window.location.hash = "#ui-paramselect";
            return false;
        }
        attrval();
    })
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
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
function loadstate(){
    var region_id = $('input[name=\"province\"]').val();
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
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
}

function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    refresh_price(); 
}

function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        refresh_price();
    }
}

function inputnumber(){
    var number=parseInt($('#num').val());
    if(isNaN(number)||number < 1){
        $('#num').val('1');
        refresh_price();
    }else if(number > 1){
        $('#num').val(number);
    }
    refresh_price();
}

// 刷新价格
function refresh_price() {
    var combo_id = $('#comb input:checked').val();
    var act = $('#act').val();
    var num = $('#num').val();
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: {
            combo_id: combo_id
            , act: act
            , num: num
        }
        , dataType: 'json',
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
function gohome(){
    window.location.href = '/';
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
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if( prototype.length == 0 ){
            alert('請選擇屬性');
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }        
    // 跳转
    window.location.href = url;
    return false;
}
$('.btn-addToCart').click(function(event) {
    /* Act on the event */
    $("html, body").animate({
        scrollTop: $("#page-order").offset().top
        , duration: 500,easing: "swing"
    });
});
