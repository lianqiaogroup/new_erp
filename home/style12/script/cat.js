$(function(){
	var cat_id = $('#cat_id').val();
    var datajson;
    var page_num;
    getData(1)
    function getData(p){
        $.get('/?act=getCategoryGoods&category_id='+cat_id+'&p='+p, function(data) {
            datajson = JSON.parse(data);
            page_num = Math.ceil(datajson.count/20);
            if(p==1){
                $('.page_num').html('').append('<button id="prev" data-id="'+ 1 +'">←</button>');
                for(var i=1;i<=page_num;i++){
                    $('.page_num').append('<button data-id="'+ i +'">'+ i +'</button>');
                }
                if (page_num > 1) {
                    $('.page_num').append('<button id="next" data-id="'+ 2 +'">→</button>');
                }else{
                    $('.page_num').append('<button id="next" data-id="'+ 1 +'">→</button>');
                }
            }else{
                
            }
            if(datajson.ModuleGoods != null){
                var html = getdatatitle(datajson.ModuleGoods,1);
                $('#content').show().find('.row').html('').append(html);
                imgwh();
            }else{
                var html = $('#emptydiv').clone().html();
                $('#content').show().find('.row').html('').append(html);
            }
            //谷歌再营销统计
            googlefun(datajson.ModuleGoods);
        })
    }
    	
	function getdatatitle(item){
        if(item){
            // $('.next_page').show();
            var module = $('#module_dome').clone().html();
            var html = "";
            for(var i =  0; i < item.length;i++){
                var newstr = module;
                newstr = newstr.replace(/\{url\}/g, item[i].type);
                newstr = newstr.replace(/\{thumb\}/g, item[i].thumb);
                newstr = newstr.replace(/\{title\}/g, item[i].title);
                if(item[i].currency_prefix == "1"){
                    newstr = newstr.replace(/\{shop_price\}/g, item[i].currency_code + item[i].price+'<sup>.00</sup>');
                }else{
                    newstr = newstr.replace(/\{shop_price\}/g, item[i].price+'<sup>.00</sup>'+item[i].currency_code);
                }
                html = html + newstr;
            }
            return html;
        }
    }
    //分页
    $('.page_num').on('click','button',function(){
        var page = parseInt($(this).attr('data-id'))
        getData(page)
        // var html = getdatatitle(datajson.ModuleGoods,page)
        // $('#content').show().find('.row').html('').append(html);
        var prev = page<=1?1:(page-1);
        var next = page>=page_num?page_num:(page+1);
        $('#prev').attr('data-id',prev)
        $('#next').attr('data-id',next)
    })
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
        if ($('.navtypeview').hasClass('show')) {
            $('.navtypeview').animate({'top':'100vh'},400);
            $('.navtypeview').delay(300).hide(0);
            $('.navtypeview').removeClass('show');
        }else{
            $('.navtypeview').show();
            $('.navtypeview').animate({'top':'0'},400);
            $('.navtypeview').addClass('show')
        }
        
    });
    $('.parent_category').on('click',function(){
        if($(this).hasClass('show')){
            window.location.href = $(this).data('link');
        }else{
            $(this).parent().siblings().find('.parent_category').removeClass('show').next().slideUp();
            $(this).next().slideDown();
            $(this).addClass('show')
        };
    })
})