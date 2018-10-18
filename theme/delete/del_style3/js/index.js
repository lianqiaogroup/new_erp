    $(function(){

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

        // 回到顶部
        $("#div_toTop").click(function(event) {
            $(window).scrollTop(0);
        });

        // tab
        $('.tabs .hd span').click(function(event) {
            var x = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('.tabs .tabs-content').eq(x).show().siblings().hide();
            /* Act on the event */
        });

        // 轮播图
        var h = $(window).height();
        var mySwiper1 = new Swiper('.swiper-container', {
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
    });


    $(".buyinfo_hd").click(function () {
        $(".buyinfo_table").css({"display":"block"})
        $("#big-i").addClass("big-i")
    })
    $(".closeBtn").click(function () {
        $(".buyinfo_table").css({"display":"none"})
        $("#big-i").removeClass("big-i")

    })


        /*$(".tabs-content .lab").click(function () {
            $(".opt").css({opacity:".7",background:"black",display:'block'})
            $(this).addClass("inw").siblings().removeClass("inw")

            if(".inw"){
                $(".inw .big_banner").show()
            }else {
                $(".inw .big_banner").hide()
            }
        })
    $(".img_small img").bind('click',function () {
        var bigclick = $(this).index()
        console.log(bigclick)
        $(".inw .big_banner").eq(bigclick).show().siblings().hide()
    })
    $(".opt, .opt div").click(function () {
        $(".inw .big_banner").css("display","none")
        $(".opt").css({opacity:".0",display:'none'})

    })*/


