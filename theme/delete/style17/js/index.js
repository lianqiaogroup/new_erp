require(['jquery'], function ($){


    // 回到顶部
    $(".m-goToTop").click(function(event) {
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
    //套餐值显示第一个
    $(function () {
        $(".package .tab").eq(0).show().siblings().hide();
    })
    // 评论区域模块
    require(['commentsScroll', 'gallery']);

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
        var domstr = "<span class='num'>"+0+hour+"</span>|";
            domstr = domstr + "<span class='num'>"+minute+"</span>|";
            domstr = domstr + "<span class='num'>"+second+"</span>|";
            domstr = domstr + "<span class='num' id='caclcon'></span>";
        domstr = domstr.replace(/\|/g, '<span class="dot">:</span>');  
        cc.innerHTML = domstr;
    }
    window.setInterval(function(){ShowCountDown(2018,4,20,'timer');}, interval);
    var countdown2 = 10;
    window.setInterval(function(){
        countdown2 = countdown2 - 1;
        if( countdown2<=0 ){ countdown2 = 9; }
        $('#caclcon').html("0"+countdown2);
    }, 100);

    $('#J_Tabs li').click(function(event) {
        /* Act on the event */
        var x = $(this).index();
        $(this).addClass('stab-current').siblings().removeClass('stab-current');
        $('.tabs-content > div').eq(x).show().siblings().hide();
    });
        

});

