require(['jquery'], function ($){


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


    require(['widget'], function(){
        // 计时器
        // widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
        //销售百分比
        widget.percent();
    });


    // 评论区域模块
    require(['commentsScroll', 'gallery']);

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
        cc.innerHTML ="<span id='h'>"+0+hour+"</span>"+"<span class='colon'>時</span>"+"<span id='m'>"+minute+"</span>"+"<span class='colon'>分</span>"+"<span id='s'>"+second+"</span>"+"<span class='colon'>秒</span>";
    }
    window.setInterval(function(){ShowCountDown(2018,4,20,'timer');}, interval)

        
        

});

