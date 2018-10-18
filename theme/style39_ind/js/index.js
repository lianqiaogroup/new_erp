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
        $('.gallery-thumbs .swiper-wrapper').attr('style','transform: translate3d(16px, 0px, 0px);transition-duration: 0ms;')
        var myDate = new Date();
        myDate.setDate(myDate.getDate()+5);
        var date2 = new Date();
        date2.setDate(date2.getDate()+8);
        var arrival_time = (myDate.getMonth()+1) + '/' + myDate.getDate() + '-' + (date2.getMonth()+1) + '/' + date2.getDate();
        $('#timer').html(arrival_time);
        var width = window.screen.width;
        $('#big-i').css('right',-width);
        // 初始化选择
        // $("#comb .tab").eq(0).find('input').attr("checked", 'true');
        $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
        $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
        setCombPrototypeInit(1);
        singleCombo();
        // 选择产品
        $("#comb .tab").click(function(event) {
            event.preventDefault();
            /* Act on the event */
            $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
            $(this).find('input').attr("checked", 'true');
            $(this).siblings().find('input').attr("checked", false);
            $('#comb').attr('data-price', $(this).attr('data-price'));
            $('[currentprice]').html($(this).attr('data-price'));

            var index = $(this).attr('data-loopIndex');
            setCombPrototypeInit(index);
            refresh_price();
            singleCombo();
        });
        $(window).scroll(scrollfun);
        function scrollfun(){
            var hei=$(window).height();
            if($(document).scrollTop()>=800){
                $('#addToCart').addClass('btn_fixed');
            }else{
                $('#addToCart').removeClass('btn_fixed');
            }
        }
        // 选择事件
        $('.u-format.count_atrr').on('click', '.tab', function(){
            var self = $(this);
            var id = self.attr('data-id');
            var name = self.attr('data-name');
            self.addClass('tab-sel').siblings().removeClass('tab-sel');
            self.parents('.u-format.count_atrr').find('.attrname').html(name);
            var src = self.attr('data-img');
            if( src ){ $('#attrimg').attr('src', src); }
            var data_index = self.parents('section').attr('data-loopindex');
            $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
            $('#comb').find('.tab[data-loopindex="'+ data_index +'"]').find('input').attr("checked", 'true');
        });
        //套餐显示在主页及数量按钮变化
        var comob = $("#comb .tab-sel").find('input').val();
        var aa_1 = $("#comb .tab .text_this").eq(0).text();
        if(comob != 0){
            $(".taocan").html(aa_1);
        }
        $("#comb .tab").click(function () {
            var text_list = $(this).index();
            var aa = $("#comb .tab .text_this").eq(text_list).text();
        });
        $('.seleattr').on('click', function(event) {
            event.preventDefault();
            $('#attrs').show();
            $("#main").hide();
            $(window).scrollTop(0);
            refresh_price();
        });
        $('.btnattr').on('click', function(event) {
            event.preventDefault();
            $('#attrs').show();
            $("#main").hide();
            $(window).scrollTop(0);
            refresh_price();
        });
        $('.back_index').on('click', function(event) {
            event.preventDefault();
            $('#attrs').hide()
            $("#main").show();
            var comob = $("#comb .tab-sel").find('input').val();
            var len = $('.attrname').length;
            var html = [];
            for(var i = 0 ;i < len; i ++){
                if(comob == 0){
                    var name = $('.attrname').eq(i).html();
                }else{
                    var name = $('section[comobid="'+comob+'"]').find('.attrname').eq(i).html();
                }  
                if(name){
                    html.push(name + " ");
                }
            }
            $('.attrs').html(html);
        });
        addnumber = function(){
            $('#num').val(parseInt($('#num').val())+1);
            $(".less").css({color:'#252c41'});
            refresh_price(); 
        }
        minnumber = function(){
            if($('#num').val() > 1){
                $('#num').val(parseInt($('#num').val())-1);
                $(".less").css({color:'#252c41'});
                refresh_price();
            }else{
                $(".less").css({color:'#dddfe6'});
            }
        }
        inputnumber = function(){
            var number=parseInt($('#num').val());
            if(isNaN(number)||number < 1){
                $('#num').val('1');
                refresh_price();
            }else if(number > 1){
                $('#num').val(number);
            }
            refresh_price();
        }
        // 刷新价格
        function refresh_price() {
            $.ajax({
                url: '/checkout.php?',
                type: 'post',
                data: $('#comb input[checked=checked],input[name=\'product_id\'], #act, input[name=\'num\']'),
                dataType: 'json',
                success: function(json) {
                if(json.ret)
                {
                    if(json.new_price_format){
                        $("#price").html(json.new_price_format.price_format);
                        $("input[name='price']").html(json.new_price_format.price_format);
                    }else{
                        $("#price").html(json.total);
                        $("input[name='price']").html(json.total);
                    }
                }
                else{
                    alert(json.msg)
                }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                }
            });
        }
        function setCombPrototypeInit(sectionIndex){
            $('section[data-loopindex]').hide();
            var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
            section.find('li.protoLayer').each(function(){
                if($(this).find('.tab').length == 1){
                    $(this).find('.tab').eq(0).addClass('tab-sel');
                }
                if(section.find('li.protoLayer').length == section.find('.tab-sel[data-name]').length){
                    $('#comb .tab').eq(sectionIndex-1).addClass('tab-sel').find('input').attr("checked", 'true');
                }
            });
        }
        //套餐是否可选数量
        function singleCombo(){
            var single_c =  $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') ? $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') : $('input[name="combo_id"][checked]').parent('.tab').attr('single_c');
            if(parseInt(single_c) == 1){
                $('#num').val(1);
                $('#num').parents('.numberbox').hide();
            }else{
                $('#num').parents('.numberbox').show();
            }
        }
        postcheckGuige = function() {
            var url = "/checkout.php?";
            // 数量
            var count = parseInt($('input#num').val()) || 1;
            url = url + "count="+count;
            // 产品ID
            var comb_id = $("#comb .tab-sel").find('input').val();
            if(typeof(comb_id) == 'undefined'){
                alert($('#attrs').attr('data-error'));
                return false;
            };
            var productId = $('input[name="product_id"]').val();
            var count_atrr = $('section[data-loopIndex]:visible .u-format.count_atrr');

            url = url + "&combo_id="+comb_id + '&product_id=' + productId;
            
            /* Act on the event */
            var prototype = [];
            if( count_atrr.length > 0 ){
                count_atrr.each(function(){
                    var groupId = $(this).attr('data-group');
                    var prototypeId = $(this).find('.tab.tab-sel').attr('data-id');
                    if( parseInt(prototypeId)>0 ){
                        prototype.push(groupId+"-"+prototypeId);
                    }
                });
                if( prototype.length < count_atrr.length ){
                    alert($('#attrs').attr('data-error'));
                    return false;
                }
                url = url + "&proto="+prototype.join('|');
            }        
            // 跳转
            window.location.href = url;
            return false;
        }
        //
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
        $('.viewall').click(function(){
            $('#main').slideUp();
            $('#comment').slideDown();
        })
        $("#forcom").click(function () {
            $('#big-i').animate({right:0});
            $(this).addClass('action');
            $('#list').removeClass('action');
            $('#comment').css('overflow','hidden')
        });
        $('#list').click(function(){
            $('#big-i').animate({right:-width});
            $(this).addClass('action');
            $('#forcom').removeClass('action');
            $('#comment').css('overflow','visible');
        })
        $(".closeBtn").click(function () {
            $('#comment').slideUp();
            $('#main').slideDown();
            
        })
    })
require(['commentsScroll', 'gallery']);  
})