require(['jquery','swiper','widget'], function ($,swiper){
    // 回到顶部
    var $doc=$(document);
    $(".m-goToTop").hide();
    //窗口加滚动触发
    $(window).scroll(scrollfun);
    function scrollfun(){
        var hei=$(window).height();
        if($doc.scrollTop()>=800){
            $(".m-goToTop").slideDown();
            $('#addToCart').addClass('btn_fixed');
        }else{
            $(".m-goToTop").slideUp();
            $('#addToCart').removeClass('btn_fixed');
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

    // 显示属性层
    $('.btn-addToCart').on('click', function(event) {
        event.preventDefault();
        $('#page-order').show();
        $("#page-index").hide();
        $(window).scrollTop(0);
        var localPrice = $('#comb .tab.tab-sel').attr('data-price');
        $('#price').html(localPrice);
        refresh_price();
    });

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
    var video = document.getElementById("video");
    if(video){
        video.addEventListener("play", function () {
            mySwiper1.stopAutoplay();
        }, false);
        $(".swiper-container").on("touchmove", function () {
            video.pause();
        });
    }
 
    $(document).ready(function(){
        if($('#pinlun_content').length != 0){
            change();
            window.onload=function(){
                change();
            }
            window.onresize=function(){
                change();
            }
        }
    })
    // 初始化选择
    setCombPrototypeInit(1);
    singleCombo();
    // 选择产品
    $("#comb .tab").click(function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).find('input').attr("checked", 'true');
        $(this).siblings().find('input').attr("checked", false);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);
        refresh_price();
        singleCombo();
    });
    

    // 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        var name = self.attr('data-name');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        self.parents('.u-format.count_atrr').find('.attrname').html(name);
        var src = self.attr('data-img');
        if( src ){ $('#attrimg').attr('src', src); }
        //$(".arrt_name_this").html(self.text());
        var data_index = self.parents('section').attr('data-loopindex');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
        $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').find('input').attr("checked", 'true');
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
        $('.comment_viewall').click(function(){
            if($('#pinlun_tt').length != 0){
                var h = $('#pinlun_tt').offset().top;
                $('html,body').scrollTop(h);
            }
        });
        $(".cover").click(function(){
            var that = $(this).clone();
            $('.layer-main').html('').append(that);
            $('.layer_com').show();
            $('body').addClass('overflow');
        });
        $(".close-btn").click(function(){
            $('.layer_com').hide();
            $('body').removeClass('overflow');
        });
        $('#loadMore').click(function(){
            var dom = $('li[datashowid]').length;
            if(parseInt(dom) > 6){
                for(var l = 0 ; l < 6;l++){
                    $('li[datashowid]').eq(l).show();
                }
                for(var l = 0 ; l < 6;l++){
                    $('li[datashowid]').eq(0).removeAttr('datashowid');
                }
            }else{
                if(parseInt(dom) != 0){
                    for(var l = 0 ; l < dom;l++){
                        $('li[datashowid]').eq(l).show();
                    }
                    $('#loadMore').hide();
                }
            }
            change();
        })
});

// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    section.find('li.protoLayer').each(function(){
        if($(this).find('.tab').length == 1){
            $(this).find('.tab').eq(0).addClass('tab-sel');
            var id = $(this).find('.tab').eq(0).attr('data-id');
            $(this).find('.u-format.count_atrr').attr('data-select', id);
            $(this).find('.tt .attrname').html($(this).find('.tab').eq(0).attr('data-name'));
        }
        if(section.find('li.protoLayer').length == section.find('.tab-sel[data-name]').length){
            $('#comb .tab').eq(sectionIndex-1).addClass('tab-sel').find('input').attr("checked", 'true');
            $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
        }
    });
}
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') ? $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') : $('input[name="combo_id"][checked]').parent('.tab').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.numberbox').hide();
    }else{
        $('#num').parents('.numberbox').show();
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
            if(json.ret){
                var total = json.total;
                if( json.new_price_format ){ total = json.new_price_format.price_format }
                $("[currentprice]").html(total);
                $("input[name='price']").val(json.total);
            }
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
    var count_atrr = $('section[data-loopIndex]:visible .u-format.count_atrr');
    url = url + "&combo_id="+comb_id + '&product_id=' + productId;
    /* Act on the event */
    var prototype = [];
    if( count_atrr.length > 0 ){
        count_atrr.each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).attr('data-select');
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if( prototype.length < count_atrr.length ){
            alert($('#page-order').attr('data-error'));
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }     
    // 跳转
    window.location.href = url;
    return false;
}
//瀑布流评论
var fall=document.getElementById("pinlun_content");
if(fall){
    function change(){
        var lis=fall.getElementsByTagName("li");
        var lis_W=lis[0].offsetWidth;
        var windowCW = document.getElementById("pinlun_content").offsetWidth;
        var n = Math.round(windowCW/lis_W); 

        var center = (windowCW - n*lis_W-(n-1)*10)/2;
        var arrH = [];
        for(var i=0;i<lis.length;i++){
            var j=i%n;
            console.log(j,n)
            if (arrH.length==n) {  
                var min = findMin(arrH);
                lis[i].style.left = min*(lis_W) +"px";  
                lis[i].style.top = arrH[min]+10 + "px";
                arrH[min] += lis[i].offsetHeight + 10;                
            }else{
                arrH[j] = lis[i].offsetHeight;        
                lis[i].style.left = lis_W*j+j + "px";
                lis[i].style.top = 0;

            }
            var k=0;
            for(var b=0;b<n;b++){
                k=Math.max(arrH[k],arrH[b])==arrH[k] ? k : b;
            } 
            fall.style.height= arrH[k]+'px';
        }

        function findMin(arr) {
            var m = 0;
            for (var i = 0; i < arr.length; i++) {
                m = Math.min(arr[m], arr[i]) == arr[m] ? m : i;
            }
            return m;
        }
    }
}