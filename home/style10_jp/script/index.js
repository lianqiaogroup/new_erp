$(function(){
    //首页
    var mySwiper = new Swiper('#imgScroller', {
        autoplay: 3000,
        loop: false,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            for (var i = 1; i <= total; i++) {
                if (current == i) {
                    text += "<span class='carousel-indicators on'></span>";
                } else {
                    text += "<span class='carousel-indicators'></span>";
                }
            }
            return text;
        }
    });
    
    //侧边栏
    $('#menu').click(function(){
        if($('body').hasClass('with-panel-left-reveal')){
            $('body').removeClass('with-panel-left-reveal');
            $('#panelview').animate({'left':'-100%'});
        }else{
            $('body').addClass('with-panel-left-reveal');
            $('#panelview').animate({'left':'0px'});
            $('#icon').removeClass('up').addClass('down');
            $('body').removeClass('overhidden');
        }
    });
    $('#menuclose,.panel-user').click(function(){
        $('body').removeClass('with-panel-left-reveal');
        $('#panelview').hide();
    });
    $('.searchs').click(function(){
        $('#search_nav').show();
    })
    var p = 1,bool=true;
    getData(1);
    var winHeight = parseInt($(window).height());

    $(window).on('scroll',function(){
        if (bool) {
            setTimeout(function(){
                var domHeight = $(document).height();
                var totalHeight = winHeight+parseInt($(window).scrollTop());
                if(domHeight<=totalHeight){
                    p++;
                    getData(p)
                }
                bool=true;
            },1000)
            bool=false;

        }
            
    })
    function getData(p){
        $.get('/?act=getAjaxGoods&p='+p, function(data) {
            var datajson = JSON.parse(data);
            if(data != '[]'){
                var html = getdatatitle(datajson.ModuleGoods);
                $('#content').show().find('.row').append(html);
                imgwh();
            }else{
                if(p==1){
                    var html = $('#emptydiv').clone().html();
                    $('#content').show().find('.row').html('').append(html);
                }else{
                    $(window).off('scroll');
                }
                $('.preload').html($('.preload').data('error'));
                setTimeout(function(){
                    $('.preload').hide();
                },3000);
                return false;
                
            }
        })
    }
        
    function getdatatitle(item){
        if(item){
            var datas = item.length;
            var module = $('#module_dome').clone().html();
            var html = "";
            for(var i =  0; i < datas;i++){
                var newstr = module;
                newstr = newstr.replace(/\{url\}/g, item[i].type);
                if(item[i].thumb != null){
                    newstr = newstr.replace(/\{thumb\}/g, item[i].thumb);
                }else{

                }
                newstr = newstr.replace(/\{title\}/g, item[i].title);
                // if(item[i].currency_prefix == "1"){
                //     newstr = newstr.replace(/\{shop_price\}/g, item[i].currency_code + item[i].price);
                // }else{
                //     newstr = newstr.replace(/\{shop_price\}/g, item[i].price+item[i].currency_code);
                // }
                html = html + newstr;
            }
            return html;
        }
    }
    function imgwh(){
        var width = $('.tagWraper').width() + "px";
        $('.imgthumb').css({'width':width,'height':width});
        window.onresize = function(){
            var width = $('.tagWraper').width() + "px";
            $('.imgthumb').css({'width':width,'height':width});
        }
    }
});
