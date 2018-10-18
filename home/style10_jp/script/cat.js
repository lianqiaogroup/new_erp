$(function(){
	var cat_id = $('#cat_id').val();
    var p = 1;
    getData(1);
    var winHeight = parseInt($(window).height());

    $(window).on('scroll',function(){
        var domHeight = $(document).height();
        var totalHeight = winHeight+parseInt($(window).scrollTop());
        if(domHeight<=totalHeight){
            p++;
            getData(p)
        }
    })

    function getData(p){
        $.get('/?act=getCategoryGoods&category_id='+cat_id+'&p='+p, function(data) {
            var datajson = JSON.parse(data);
            if(datajson.ModuleGoods != null){
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
            //谷歌再营销统计
            googlefun(datajson.ModuleGoods);
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
                newstr = newstr.replace(/\{thumb\}/g, item[i].thumb);
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
        var width = $('.caption').width() + "px";
        $('.thumbnail').find('img').css({'width':width,'height':width});
        window.onresize = function(){
            var width = $('.caption').width() + "px";
            $('.thumbnail').find('img').css({'width':width,'height':width});
        }
    }
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
    var width = $(window).width();
    if(parseInt(width) <= 1024){
        // window.setInterval(function(){
        //     CountDown();
        // },1000);
        CountDown();
    }
    function CountDown(){
        var len = $('.usp-header ul').find('li').length;
        var dom = $('.usp-header ul').find('li');
        var i = 0;

        setInterval(function(){
            dom.eq(i).css({'display':'none','position':'relative'});
            dom.eq(i).animate({'opacity':'0'});
            i = ++i == len ? 0 : i;
            dom.eq(i).css({'display':'block','position':'relative'});
            dom.eq(i).animate({'opacity':'1'});
        },2000);
    }
})