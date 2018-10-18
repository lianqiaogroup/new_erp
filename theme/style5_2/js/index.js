require(['jquery','swiper','widget','commentsScroll', 'gallery'], function ($,Swiper){
    //销售百分比
    widget.percent();
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
    });
    // 轮播图
    var h = $(window).height();
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            for (var i = 1; i <= total; i++) {
                if (current == i) {
                    text += "<span class='redicon'></span>";
                } else {
                    text += "<span class='whiteicon'></span>";
                }
            }
            return text;
        }
    });
    // 初始化选择
    // $("#comb .tab").eq(0).addClass('tab-sel').find('input').attr("checked", 'true');
    $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
    $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
    setCombPrototypeInit(1);
    refresh_price();
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
        refresh_price();
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
        var data_index = self.parents('section').attr('data-loopindex');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').find('input').attr("checked", 'true');
    });
    // 评论区域模块
    $(".buyinfo_hd").click(function () {
        $(".buyinfo_table").css({"display":"block"})
        $("#big-i").addClass("big-i")
    })
    $(".closeBtn").click(function () {
        $(".buyinfo_table").css({"display":"none"})
        $("#big-i").removeClass("big-i")

    })

    // 倒计时模块
    +(function(){
        var interval = 1000;
        var deadline_date = $('#timer').attr('data-value');
        var time_step = $('#timer').attr('data-step') || '8';
        // reset
        function resetDate(){
            var _currentTime = new Date().getTime()+28800000+(parseInt(time_step)*3600*1000);
            var _currentDate = new Date();
                _currentDate.setTime(_currentTime);
                _currentDate = _currentDate.toISOString().replace('T',' ');
                _currentDate = _currentDate.replace(/\.[0-9a-zA-Z]*/g,'');
            deadline_date = _currentDate;
            $('#timer').attr('data-value', deadline_date);
        }
        // module core
        function ShowCountDown() {
            var deadline = Date.parse(deadline_date);
            var now = new Date().getTime();
            if( deadline <= now ){
                resetDate();
                deadline = Date.parse(deadline_date);
            }
            var leftTime = deadline - now;
            var leftsecond = parseInt(leftTime/1000);
            var day1=Math.floor(leftsecond/(60*60*24));
            var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
            var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
            var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
            $('#timer').html("<span id='h'>"+0+hour+"</span>"+"<span class='colon'>時</span>"+"<span id='m'>"+minute+"</span>"+"<span class='colon'>分</span>"+"<span id='s'>"+second+"</span>"+"<span class='colon'>秒</span>");
        }
        deadline_date=='' && resetDate();
        ShowCountDown();
        window.setInterval(function(){ ShowCountDown(); }, interval);
    })();

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
        if(section.find('li.protoLayer').length == section.find('.tab-sel').length){
            $('#comb .tab').eq(sectionIndex-1).addClass('tab-sel').find('input').attr("checked", 'true');
        }
    });
    singleCombo();
}
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('input[name="combo_id"]:checked').parent('label').attr('single_c') ? $('input[name="combo_id"]:checked').parent('label').attr('single_c') : $('input[name="combo_id"][checked]').parent('label').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.u-fornum').hide();
    }else{
        $('#num').parents('.u-fornum').show();
    }
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
    var is_single = $("#comb .tab-sel").attr('single_c');
    url = url + "&is_single=" + is_single;
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