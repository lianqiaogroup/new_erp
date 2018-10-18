$(function(){
    //首页
    var mySwiper = new Swiper('#imgScroller', {
        autoplay: 3000,
        loop: false
    });
    //分类
    var category = new Swiper('#category', {
        scrollbar: '.swiper-scrollbar',
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween:8,
        mousewheelControl: false,
        freeMode: true,
        freeModeMomentum:false,
        centeredSlides:false,
        roundLengths : true, //防止文字模糊
    });
    //侧边栏
    $('#menu').click(function(){
        if($('body').hasClass('with-panel-left-reveal')){
            $('body').removeClass('with-panel-left-reveal');
            $('#panelview').hide();
        }else{
            $('body').addClass('with-panel-left-reveal');
            $('#panelview').show();
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
    $.get('/?act=getAjaxGoods', function(data) {
        var datajson = JSON.parse(data);
        var html = getdatatitle(datajson.ModuleGoods);
        $('#content').show().find('.row').append(html);
        imgwh();
    })
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
                if(item[i].currency_prefix == "1"){
                    newstr = newstr.replace(/\{shop_price\}/g, item[i].currency_code + item[i].price);
                }else{
                    newstr = newstr.replace(/\{shop_price\}/g, item[i].price+item[i].currency_code);
                }
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
    // 计时器
    function rnd(n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    }
    var times = rnd(60, 3600);
    var maxtime = parseInt(times);
    CountDown = function(){
        if(maxtime>=0){ 
            minutes = Math.floor(maxtime/60); 
            seconds = Math.floor(maxtime%60); 
            if (minutes <= 9) minutes = "0" + minutes;
            if (seconds <= 9) seconds = "0" + seconds;
            $('#h').html("00 : "+ minutes +" : "+ seconds);
            --maxtime; 
        } 
        else{ 
            clearInterval(timer); 
            console.log("时间到，结束!");
        } 
    } 
    timer = setInterval("CountDown()",1000);
});
