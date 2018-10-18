function ShowCountDown(year,month,day,divname){
    var now = new Date();
    var endDate = new Date(year,month-1, day, now.getHours()+8);
    var leftTime=endDate.getTime()-now.getTime();
    var leftsecond = parseInt(leftTime/1000);
    var day1=Math.floor(leftsecond/(60*60*24));
    var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
    var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
    var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
    var cc = document.getElementById(divname);
    cc.innerHTML ="<span id='h'>"+0+hour+"</span>"+"<span class=''>時</span>"+"<span id='m'>"+minute+"</span>"+"<span class=''>分</span>"+"<span id='s'>"+second+"</span>"+"<span class=''>秒</span>";

}
window.setInterval(function(){ShowCountDown(2018,4,20,'timer');}, 1000);


    $(function() {
        $('.pinlun').click(function() {
            $(this).addClass('selecked');
            $('.bTitle1').removeClass('selecked');
            $('.detail_con').hide();
            $('.pinlun_content').show();
        })
        $('.bTitle1').click(function() {
            $(this).addClass('selecked');
            $('.pinlun').removeClass('selecked');
            $('.pinlun_content').hide();
            $('.detail_con').show();
        })
        if ($(".lab p").length <= 0) {
            $(".pinlun").hide();
            $(".bTitle.bTitle1").css({width: "100%"});
        }
    });
$(function () {
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

    //大图弹出
    $(".msKeimgBox img").click(function () {
        var dj = $(this).index()
        console.log(dj)
        $(this).parent().parent().find('.hidden').hide();
        $(this).parent().parent().find('.hidden').eq(dj).fadeIn()
    })
    $("#btn_buy").click(function () {
        window.location.href="checkout.php";
    })
})