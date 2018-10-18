function showLayer(){
    $('#page-order').show();
    $("#page-index").hide();
    $(window).scrollTop(0);
}
require(['jquery'], function ($){
    // 回到顶部
    $(".m-goToTop").click(function(event) {
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
        //销售百分比
        widget.percent();
    });
    $('.bTitle').on('click',function(){
        $('.bTitle').removeClass('active');
        $(this).addClass('active');
        $('.tab-bar').hide();
        $('.tab-bar').eq($(this).index()).show();
    })
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
    //
    var inputElement = document.getElementById("file");
    if(inputElement){
        inputElement.addEventListener("change", handleFiles, false);
        function handleFiles(){
            var fileList = this.files;
            for( var i = 0 ; i < fileList.length ; i++ ){
                $('.file_imgs').append("<div>"+fileList[i].name+"</div>");
            }

        }
    };
    var fbqstatus = {
        AddToCart: 0,
        InitiateCheckout: 0
    };
    var region_code = $("#region_code").val();
    //泰国地区加入fb三个事件；
    if (region_code == 'Rp') {
        //fb加入购物车事件
        $('[data-cuckootag="buy_now"]').on('click', function () {
            if (fbqstatus.AddToCart == 0) {
                fbq('track', 'AddToCart');
                fbqstatus.AddToCart++;
            };
        });
        $('#val-sel').on('click', function () {
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
});
