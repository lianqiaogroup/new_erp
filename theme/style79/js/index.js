require(['jquery','widget'], function ($){
    // 回到顶部
    $(".m-goToTop").click(function(event) {
        $(window).scrollTop(0);
    });
    // 显示属性层
    $('.btn-addToCart').on('click', function(event) {
        event.preventDefault();
        $('#page-order').show();
        $("#page-index").hide();
        $(window).scrollTop(0);
        cur_chosen();
    });
    $('.detailback').on('click', function(event) {
        event.preventDefault();
        $('#page-order').hide();
        $("#page-index").show();
    });
    $('#val-sel').on('click', function(event) {
        event.preventDefault();
        $('#page-order').show();
        $("#page-index").hide();
        $(window).scrollTop(0);
        cur_chosen();
    });
    $('.comment_title span').on('click', function(event) {
        event.preventDefault();
        $(window).scrollTop(0);
        $("#page-comment").show();
        $("#page-index").hide();

    });
    $('.comment-top .back').on('click',function(event){
        $("#page-comment").hide();
        $("#page-index").show();
    })
    var commentHeight = $('.picList').eq(0).height();
    if (commentHeight < 250) {
        $('#mq').css('height',(commentHeight-5)+'px');
    }
    require(['commentsScroll', 'gallery']);
    // 轮播图
    require(['swiper-3.4.0.jquery.min'], function(Swiper){
        var h = $(window).height();
        var mySwiper1 = new window.Swiper('.swiper-container', {
            autoplay: 3000,
            loop: false,
            autoHeight:true,
            pagination: '.swiper-pagination',
            paginationType: 'custom',
            paginationCustomRender: function(swiper, current, total) {
                var text = "";
                text = '<span class="swiper-pagination-current">' + current + '/<span class="swiper-pagination-total">'+ total +'</span>';
                return text;
            }
        });
        //倒计时
        widget.timeSet(2018,4,20);
    });
    $(".buyinfo_hd").click(function () {
        $(".buyinfo_table").css({"display":"block"})
        $("#big-i").addClass("big-i")
    })
    $(".closeBtn").click(function () {
        $(".buyinfo_table").css({"display":"none"})
        $("#big-i").removeClass("big-i")

    });
    //
    var inputElement = document.getElementById("file");
    if(inputElement){
        inputElement.addEventListener("change", handleFiles, false);
        function handleFiles(){
            var fileList = this.files;
            for( var i = 0 ; i < fileList.length ; i++ ){
                //console.log(fileList[i]);
                $('.file_imgs').append("<div>"+fileList[i].name+"</div>");
            }

        }
    }
    // 初始化选择
    // $("#comb .tab").eq(0).addClass('tab-sel').find('input').attr("checked", 'true');
    $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
    $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
    setCombPrototypeInit(1);
    var is_single = $("#comb .tab").eq(0).attr('data-single');
    if(is_single == 1){
        $('.u-fornum').hide();
    }
    // 选择产品
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
        cur_chosen();
    });

    // $('.u-format.count_atrr').each(function(){
    //     var obj = $(this).find('.tab');
    //         //obj.eq(0).addClass('tab-sel');
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
        cur_chosen();
        var data_index = self.parents('section').attr('data-loopindex');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').find('input').attr("checked", 'true');
    });
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
        if(section.find('li.protoLayer').length == section.find('.tab-sel[data-name]').length){
            $('#comb .tab').eq(sectionIndex-1).addClass('tab-sel').find('input').attr("checked", 'true');
        }
    });
}

function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    refresh_price();
    var itnum = parseInt($('#num').val())-1;
    cur_chosen();
}

function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        refresh_price();
        cur_chosen();
    }
}

function inputnumber(){
    var number=parseInt($('#num').val());
    if(isNaN(number)||number < 1){
        $('#num').val('1');
    }else if(number > 1){
        $('#num').val(number);
    }
    refresh_price();
    cur_chosen();
}

// 刷新价格
function refresh_price() {
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('#comb input[checked=checked], #act, input[name=\'num\']'),
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
function cur_chosen(){
    var chosen = '';
    var loop = parseInt($(".tab-sel").eq(0).attr('data-loopindex'))-1;
    var tab = $('section[data-loopindex]').eq(loop);
        for(var i =0; i < tab.length; i++){
            var attr_num = tab.eq(i).find('.tab-sel');
            var num = $('#num').val();
            if(attr_num.length){
                for (var j =0; j < attr_num.length; j++){
                    chosen +=  attr_num.eq(j).html();
                }
                // chosen += '<span>'+ attr_num.eq(j).html()+'</span>;'
            }else{
                $('.sku').remove();
            }
        }
        chosen += '<span id="itnum">' + '×'+num + '</span>';
    $('.sku .it').html(chosen);
    $('.m-listItem .inner .it').html('已選擇：' + chosen);
}
var domain = window.location.href;
if (domain == 'http://www.lidzw.com/twsst'){
    $('footer a.left').removeAttr('data-cuckootag');
    $('footer a.left').attr({'href':'https://www.messenger.com/t/1911116319105362','target':'_blank'});
}else if(domain == 'http://www.nlqfo.com/Gopro.tw'){
    $('footer a.left').removeAttr('data-cuckootag');
    $('footer a.left').attr({'href':'https://www.messenger.com/t/699021123615033','target':'_blank'});
}

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#regionCode").val();
//泰国地区加入fb三个事件；
if (region_code == 'TW' || region_code == 'HK') {
    //fb加入购物车事件
    $('[data-cuckootag="buy_now"]').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    });
    //fb发起结账事件
    $('[data-cuckootag="confirm_arrtibute"]').click(function () {
        if (fbqstatus.InitiateCheckout == 0) {
            fbq('track', 'InitiateCheckout');
            fbqstatus.InitiateCheckout++;
        };
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    })
};