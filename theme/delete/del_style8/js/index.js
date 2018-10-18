require(['jquery', 'swiper','widget','commentsScroll','gallery'],function($, Swiper){

    // 计时器
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
    //销售百分比
    //widget.percent();

    // 回到顶部
    $(".m-goToTop").click(function(event) {
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
    // 显示属性层
    $('#val-sel').on('click', function(event) {
        if ($('.arrow_d').hasClass('up')) {
            $('.option_detail').hide();
            $('.arrow_d').removeClass('up');
        }else{
            var top = parseInt($(this).offset().top,10);
            window.scrollTo(0,top);
            $('.arrow_d').addClass('up');
            $('.option_detail').show();
            $('#add').addClass('ok');
        }
        
    });
    $(".buyinfo_hd").click(function () {
        $(".buyinfo_table").css({"display":"block"})
        $("#big-i").addClass("big-i")
    })
    $(".closeBtn").click(function () {
        $(".buyinfo_table").css({"display":"none"})
        $("#big-i").removeClass("big-i")

    })
    //显示图文详情
    $('#detail_link').click(function(){
        $('.product_info').show();
        window.scrollTo(0,0)
    });
    $('.goback').click(function(){
        $('.product_info').hide();

    })

    $('.top').click(function(){
        window.scrollTo(0,0);
    })
    //评论
    $('#review_area').click(function(){
        if($('.arrow_r').hasClass('up')){
            $('.review_info').hide();
            $('.arrow_r').removeClass('up');
        }else{
            $('.review_info').show();
            $('.arrow_r').addClass('up');
            var user = $('li[star_li]').length;
            if(user){
                var html = [];
                for(var i = 0;i < user;i++){
                    var stars =  parseInt($('li[star_li]').eq(i).attr('rel'),10);
                    for(var j = 0 ;j < stars;j++){
                        $('.stars').eq(i).append('<span class="red"></span>');
                    }
                } 
            } 
        }
        
    });
    
    var isrun = true;

});
//订单查询
$('.inquiry').on('click',function(){
    var url = '/order_quality.php';
    window.location.href = url;
})

