var State = {
    combo_id: 0
}

function showArrtibuteLayer(){
    $('#page-order').show();
    $("#page-index").hide();
    handleScrollTop();
}


//销售百分比
function percent(soldNum,percentNum,progress){
    var curhour= $('.percentBar').attr('data-value');
    var base=0,range=0;
    var percent   = document.getElementById("percentNum");
    var progress  = document.getElementById("progress");
    if(curhour<=10000){
        base=70;range=5;
    }else
    if(curhour<=20000){
        base=70;range=10;
    }else
    if(curhour<=40000){
        base=70;range=15;
    }else
    if(curhour<=80000){
        base=70;range=20;
    }else
    if(curhour<=130000){
        base=70;range=25;
    }else
    if(curhour<200000){
        base=70;range=28;
    }
    var opercent=Math.floor(range+base);
    try{
        progress.style.width = percent.innerHTML = opercent+"%";
    }catch(ex){
        
    }
}


$(function(){
    // 回到顶部
    var $doc=$(document);
    $(".m-goToTop").hide();
    //窗口加滚动触发
    $(window).scroll(function(){
        var hei = $(window).height();
        window.scrollY > hei ? $(".m-goToTop").show() : $(".m-goToTop").hide();
    });



    // 延时加载图文详情
    setTimeout(function(){
        var content = $('#ceontentTemplate').text();
            // content = content.replace(/poster=\"[^\"]*\"/g, '');
            // content = content.replace(/preload=/g, 'poster="/public/image/videoPlay.jpg" preload=');
        $('.m-img').html(content);
    }, 2000);
    

    // 
    $(".m-goToTop").click(handleScrollTop);


    $('.back_index').on('click', function(event) {
        event.preventDefault();
        $('#page-order').hide()
        $("#page-index").show();
    });
    $('#val-sel').on('click', function(event) {
        event.preventDefault();
        $('#page-order').show();
        $("#page-index").hide();
        handleScrollTop();
    });

    require(['swiper'], function(){
        var mySwiper1 = new Swiper('.swiper-container', {
            autoplay: 3000,
            loop: false,
            autoHeight:true,
            pagination: '.swiper-pagination',
            paginationType: 'fraction',
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
    });

    //销售百分比
    percent();

    $(".buyinfo_hd").click(function () {
        $(".buyinfo_table").css({"display":"block"})
        $("#big-i").addClass("big-i")
    })
    $(".closeBtn").click(function () {
        $(".buyinfo_table").css({"display":"none"})
        $("#big-i").removeClass("big-i")

    })

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
        var cc = document.getElementById(divname);
        cc.innerHTML ="<span id='h'>"+0+hour+"</span>"+"<span class='colon'>:</span>"+"<span id='m'>"+minute+"</span>"+"<span class='colon'>:</span>"+"<span id='s'>"+second+"</span>"+"<span class='colon'></span>";
    }
    window.setInterval(function(){ShowCountDown(2018,4,20,'timer');}, interval);

    // 初始化选择
    $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
    $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
    State.combo_id = $('#comb .tab').eq(0).attr('data-comboid');
    refresh_price();
    setCombPrototypeInit(1);
    // 选择产品
    $("#comb .tab").click(function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).find('input').prop("checked", true);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        $('[currentprice]').html($(this).attr('data-price'));
        State.combo_id = $(this).attr('data-comboid');

        var index = $(this).attr('data-loopIndex');
        setCombPrototypeInit(index);
        refresh_price();
        return false;
    });

    // 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
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
    var aa_1 = $("#comb .tab .text_this").eq(0).text()||'';
    $(".taocan").html(aa_1)
    $("#comb .tab").click(function () {
        var text_list = $(this).index();
        var aa = $("#comb .tab .text_this").eq(text_list).text()||'';
        $(".taocan").html(aa);
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
    });
    singleCombo();
}
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('label.tab-sel').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.combnum').hide();
    }else{
        $('#num').parents('.combnum').show();
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
    }else if(number > 1){
        $('#num').val(number);
    }
    refresh_price();
}

// 刷新价格
function refresh_price() {
    var posdata = {
        act: 'getAttrPrice'
        , combo_id: $('#comb input:checked').val()
        , product_id: $('input[name="product_id"]').val()
        , num: parseInt($('#num').val())
    }
    $.post('/checkout.php', posdata, function(data, textStatus, xhr) {
        var json = JSON.parse(data);
        if( json.ret==1 ){
            $("#price").html(json.total);
            $("input[name='price']").val(json.total);
       }
       else{
           console.warn(json.msg||'');
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
    var product_id = $("input[name='product_id']").val();
    url = url + "&combo_id="+comb_id + "&product_id="+product_id;
    /* Act on the event */
    var prototype = [];
    if( $('section[data-comboid="'+State.combo_id+'"] .u-format.count_atrr').length > 0 ){
        $('section[data-comboid="'+State.combo_id+'"] .u-format.count_atrr').each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).attr('data-select');
            
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if( prototype.length < $('section[data-comboid="'+State.combo_id+'"] .u-format.count_atrr').length ){
            alert($('#page-order').attr('data-error'));
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }        
    // 跳转
    window.location.href = url;
    return false;
}

// window scroll to top
function handleScrollTop(){
    window.scrollTo(0,0);
}

