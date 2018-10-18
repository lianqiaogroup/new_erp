
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
    $(".small_bg .img_content img").click(function () {
        var dj = $(this).index()
        console.log(dj)
        $(".big_banner img").eq(dj).fadeIn()
        $(".big_banner").css({display:'block'})
    })
    $(".big_banner div").click(function () {
        $(".big_banner img").fadeOut()
        $(".big_banner").fadeOut()
    })
    $("#btn_buy").click(function () {
        window.location.href="checkout.php";
    })
    if($("._thumb_ img").length<=0){
        $(".seo").hide()
    }

    $(".buyinfo_hd").click(function () {
        $(".buyinfo_table").css({"display":"block"})
        $("#big-i").addClass("big-i")
    })
    $(".closeBtn").click(function () {
        $(".buyinfo_table").css({"display":"none"})
        $("#big-i").removeClass("big-i")

    })
})


//banner高度跟随图片高度变化
$(function () {
    var left = $(".banner_left").outerHeight(true);
    console.log(left)
    $(".banner_right").css({height:left-20+"px",marginTop:"13px"})
    $(".banner_big").css({height:left+10+"px"})
    $(".banner_big .img_aa img").css({height:left-18+"px",width:"30px"})
    $(".bititle").click(function () {

    })
})
$(".bTop").on("click",function () {
    $(".detail_con").show();
    $(".detail_con").animate({right:"0"})
    $(".inforContent").hide()
})
$(".black_cont").click(function () {
    $(".detail_con").animate({right:"-101%"});
    $(".detail_con").hide(100)
    $(".inforContent").show()

})
var $doc=$(document);
$("#back").hide();
//窗口加滚动触发
$(window).scroll(scrollfun);
function scrollfun(){
    var hei=$(window).height();
    //如果滚动高度>窗口的高度,隐藏
    if($doc.scrollTop()>hei){
        $("#back").slideDown();
    }else{$("#back").slideUp();}
}
$("#back").click(back);
function back() {
    $('html,body').scrollTop(0);
}
//判断轮播是否存在，修改为自适应高度
$(function () {
    if($(".pic").length<=0){
        $(".bTop").css({height:"auto"});
    }
    if($(".mqc").length<=0){
        $(".new_pinlun").hide();
    }else {
        $(".new_pinlun").show();
    }
})