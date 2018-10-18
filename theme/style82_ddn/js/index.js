require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    $(document).ready(function(){
        var galleryTop = new window.Swiper('.gallery-top', {
            spaceBetween: 10,
            autoHeight:true
        });
        var galleryThumbs = new window.Swiper('.gallery-thumbs', {
            spaceBetween: 10,
            centeredSlides: true,
            slidesPerView: 'auto',
            touchRatio: 0.2,
            slideToClickedSlide: true,
            height:80
        });
        galleryTop.params.control = galleryThumbs;
        galleryThumbs.params.control = galleryTop;
        $('.gallery-thumbs .swiper-wrapper').attr('style','transform: translate3d(16px, 0px, 0px);transition-duration: 0ms;');
        //评论
        var boxer = $('#mq1');
        if(boxer.length != 0){
            startFlip = function(){
                boxer.map(function(index, dom){
                    var list = $(dom).children().eq(0);
                    var clone = list.clone();
                    var len = $(dom).children().length;
                    if(parseInt(len%2) == 1){
                        $(dom).append(clone);
                    }
                    var speed = 5000;
                    var n = 0,h1 = 0,h2 = 0,h3 = 0,h4 = 0,w1 = 0,w2 = 0;
                    h1 = $(dom).children('.item').eq(0).height();
                    h2 = $(dom).children('.item').eq(1).height();
                    w1 = parseInt(h1+h2+20);
                    $('#mq1').css("height",w1+"px");
                    function Marquee(){
                        if( n >= parseInt(len-2) ){
                            h1 = $(dom).children('.item').eq(0).height();
                            h2 = $(dom).children('.item').eq(1).height();
                            w1 = parseInt(h1+h2+20);
                            w2 = 0;
                            $(dom).scrollTop(0);
                            n = 0;
                        }else{
                            h1 = $(dom).children('.item').eq(n).height();
                            h2 = $(dom).children('.item').eq(n+1).height();
                            h3 = $(dom).children('.item').eq(n+2).height();
                            h4 = $(dom).children('.item').eq(n+3).height();
                            w1 = parseInt(h3+h4+20);
                            w2 += parseInt(h1+h2+40);
                            $(dom).scrollTop(w2);
                            n = n+2;
                        }
                        $('#mq1').css("height",w1+"px");
                    }
                    rollingstart = setInterval(Marquee,speed);
                });
            }
            startFlip();
            $('#mq1').hover(function(){
                clearInterval(rollingstart);
            },function(){
                startFlip();
            });
            $('#mq1').on('click','img',function(){
                var len = $(this).parents('.msKeimgBox').find('li').length;
                var dom = $(this).parents('.msKeimgBox').find('li');
                $('body').addClass('overflow');
                $('.com_box').show();
                var html = "";
                for(var i = 0; i < len; i ++){
                    var img = $(dom).eq(i).attr('dataimg');
                    html += "<div class='swiper-slide'><img src='"+ img +"'></div>";
                }
                $('.com_box .swiper-wrapper').html('').append(html);
                var comimg = new window.Swiper('#com-swiper', {
                    loop:false,
                    onlyExternal:true,
                    prevButton:'.swiper-button-prev',
                    nextButton:'.swiper-button-next',
                });
            });
            $(".close-btn").click(function(){
                $('.com_box').hide();
                $('body').removeClass('overflow');
                $('.com_box .swiper-wrapper').attr('style','transform: translate3d(0px, 0px, 0px);transition-duration: 0ms;');
            });
        }
        // 初始化选择
        $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
        $('.combo_price b').html($("#comb .tab-sel").attr('data-price'))
        $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
        $('input[name="payment_type"]').eq(0).prop('checked',true);
        setCombPrototypeInit(1);
        var is_single = $("#comb .tab").eq(0).attr('data-single');
        if(is_single == 1){
            $('.numberbox').hide();
        }
        // 选择产品
        $("#comb .tab").click(function(event) {
            event.preventDefault();
            /* Act on the event */
            is_single = $(this).attr('data-single');
            if (is_single == 1) {
                $('.numberbox').hide();
            }else{
                $('.numberbox').show();
            }
            $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
            $(this).find('input').prop('checked',true);
            $('#comb').attr('data-price', $(this).attr('data-price'));
            $('[currentprice]').html($(this).attr('data-price'));
            $('.combo_price b').html($(this).attr('data-price'))
            var index = $(this).attr('data-loopIndex');
            setCombPrototypeInit(index);
        });

        // 选择事件
        $('.u-format.count_atrr').on('click', '.tab', function(){
            var self = $(this);
            var name = self.attr('data-name');
            self.addClass('tab-sel').siblings().removeClass('tab-sel');
            self.find('input').prop("checked", 'true');
            self.siblings().find('input').removeAttr("checked");
            self.parents('.u-format.count_atrr').find('.attrname').html(name);
        });

        addnumber = function(){
            $('#num').val(parseInt($('#num').val())+1);
            $(".less").css({color:'#252c41'}); 
        }
        minnumber = function(){
            if($('#num').val() > 1){
                $('#num').val(parseInt($('#num').val())-1);
                $(".less").css({color:'#252c41'});
            }else{
                $(".less").css({color:'#dddfe6'});
            }
        }
        
        function setCombPrototypeInit(sectionIndex){
            $('section[data-loopindex]').hide();
            $('section[data-loopindex]').find('input').removeAttr("checked");
            var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
            $('section[data-loopindex="'+ sectionIndex +'"]').find('li.protoLayer').each(function(){
                if($(this).find('.tab').length == 1){
                    var first = $(this).find('.tab').removeClass('tab-sel').eq(0).addClass('tab-sel');
                    var name = first.attr('data-name');
                    first.parents('.u-format.count_atrr').find('.attrname').html(name);
                    $(this).find('.tab').eq(0).find('input').prop('checked',true);
                }
                if($(this).find('.tab-sel').length != 0){
                    $(this).find('.tab-sel').find('input[type="radio"]').prop('checked',true);
                }
            });
        }

        $('.viewall').click(function(){
            $('#page-index').slideUp();
            $('#comment').slideDown();
        })        
        $(".closeBtn").click(function () {
            $('#comment').slideUp();
            $('#page-index').slideDown();
            
        })
        var minHeight;
        function throttle(func, wait, mustRun) {
            var timeout,
                startTime = new Date();
            return function() {
                var context = this,
                    args = arguments,
                    curTime = new Date();
                clearTimeout(timeout);
                // 如果达到了规定的触发时间间隔，触发 handler
                if(curTime - startTime >= mustRun){
                    func.apply(context,args);
                    startTime = curTime;
                // 没达到触发间隔，重新设定定时器
                }else{
                    timeout = setTimeout(func, wait);
                }
            };
        };
        // 实际想绑定在 scroll 事件上的 handler
        function realFunc(){
            minHeight = $('#paramselect').offset().top;
            var scroll = $(window).scrollTop() + window.screen.height;
            if (minHeight<scroll) {
                $('footer').hide();
            }else{
                $('footer').show();
            }
        }
        // 采用了节流函数
        window.addEventListener('scroll',throttle(realFunc,500,500));
        //评论

        
    });
    //验证重复订单
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]:checked').val() ? $('input[name="combo_id"]:checked').val() : $('input[name="combo_id"][checked]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo_id"]:checked').parent('label').attr('data-loopIndex') ? $('input[name="combo_id"]:checked').parent('label').attr('data-loopIndex') : $('input[name="combo_id"][checked]').parent('label').attr('data-loopIndex');
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('.protoLayer').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopindex]').eq(sectionIndex-1).find('.tc').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('.protoLayer').each(function(i,e){
                    var that = this;
                    a.push($(that).find('.tab-sel').attr('data-id'));
                });
                attrs[index].push(a);
            });
        }
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('input[type="submit"]').click(function(){
        attrval();
    })

    window.widget.repeatOrder.init();
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();
    $('[name="state"]').change(function(event) {
        var id = $(this).children().filter(':selected').attr('data-id');
        loadCity(id);
    });
    $('[name="city"]').change(function(event) {
        var id = $(this).children().filter(':selected').attr('data-id');
        loadDistrict(id);
    });
    function loadstate(){
        var region_id = $('select[name="province"]').val();
        $.post('/region.php', { 'region_id': region_id }, function(data) {
            var data = JSON.parse(data);
                data.map(function(item, index){
                    $('[name="state"]').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');
                });
            var id = $('[name="state"]').children().filter(':selected').attr('data-id');
        });
    }
    function loadCity(id, callback){
        $.post('/region.php', { 'yn_region_id': id }, function(data, textStatus, xhr) {
            $('[name="city"]').children().not(":eq(0)").remove();
            $('[name="district"]').children().not(":eq(0)").remove();
            var data = JSON.parse(data);
            data.map(function(item, index){
                $('[name="city"]').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');
            });
        });
    }
    function loadDistrict(id){
        $.post('/region.php', { 'yn_region_id': id }, function(data) {
            $('[name="district"]').children().not(":eq(0)").remove();
            var data = JSON.parse(data);
                data.map(function(item, index){
                    $('[name="district"]').append('<option value="'+item.name+'">'+item.name+'</option>');
                });
        });
    }
    loadstate();
    checkattrs = function(ev){
        var loop = $('#comb .tab-sel').attr('data-loopindex');
        var attr = $('section[data-loopIndex="'+ loop +'"] ').find('.item.protoLayer');
        if( attr.length > 0 ){
            var prototype = [];
            attr.each(function(){
                var dom = $(this).find('.tab-sel');
                var prototypeId = dom.find('input[type="radio"]:checked').val();
                if(typeof prototypeId != 'undefined'){
                    prototype.push(prototypeId);
                }
            });
            if(prototype.length < attr.length){
                alert($('#attrs').attr('data-error'));
                $(window).scrollTop($('#form').offset().top);
            }else{
                $('input[data-cuckootag="confirm_order"]').trigger('click');
            }
        }else{
            $('input[data-cuckootag="confirm_order"]').trigger('click');
        }
    };

    var fbqstatus = {
        AddToCart: 0,
        InitiateCheckout: 0,
        AddPaymentInfo: 0
    };
    var region_code = $("#region_code").val();
    //泰国及台湾地区加入fb三个事件；
    if (region_code == 'Rp') {
        //fb加入购物车事件
        $('#buy_now').on('click', function () {
            if (fbqstatus.AddToCart == 0) {
                fbq('track', 'AddToCart');
                fbqstatus.AddToCart++;
            };
        });
        //fb发起结账事件
        var list = $('.con .tab ');
        for (var i = 0; i < list.length; i++) {
            list[i].onclick = function () {
                if (fbqstatus.InitiateCheckout == 0) {
                    fbq('track', 'InitiateCheckout');
                    fbqstatus.InitiateCheckout++;
                };
                if (fbqstatus.AddToCart == 0) {
                    fbq('track', 'AddToCart');
                    fbqstatus.AddToCart++;
                };
            }
        }
        //fb添加支付信息
        $('input[name="name"]').on("keydown", function () {
            if (fbqstatus.AddPaymentInfo == 0) {
                fbq('track', 'AddPaymentInfo');
                fbqstatus.AddPaymentInfo++;
                if (fbqstatus.InitiateCheckout == 0) {
                    fbq('track', 'InitiateCheckout');
                    fbqstatus.InitiateCheckout++;
                };
                if (fbqstatus.AddToCart == 0) {
                    fbq('track', 'AddToCart');
                    fbqstatus.AddToCart++;
                };
            };
        });
    };
    // 

});