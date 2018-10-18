$(function(){
	var cat_id = $('#cat_id').val();
    getData(1)
    function getData(p){
        $.get('/?act=getCategoryGoods&category_id='+cat_id+'&p='+p, function(data) {
            var datajson = JSON.parse(data);
            if(datajson.ModuleGoods != null){
                var html = getdatatitle(datajson.ModuleGoods);
                $('#content').show().find('.row').html('').append(html);
                imgwh();
                if(datajson.ModuleGoods.length < 20){
                    $('.next_page button').eq(1).addClass('unable');
                }
            }else{
                $('.next_page button').eq(1).addClass('unable');
                if(p==1){
                    var html = $('#emptydiv').clone().html();
                    $('#content').show().find('.row').html('').append(html);
                    $('.next_page').hide();
                }else{
                    $('#content').show().find('.row').html($('.next_page').data('error'));
                }  
            }
            //谷歌再营销统计
            googlefun(datajson.ModuleGoods);
        })
    }
    	
	function getdatatitle(item){
        if(item){
            var module = $('#module_dome').clone().html();
            var html = "";
            for(var i =  0; i < item.length;i++){
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
    //翻頁
    $('.next_page').on('click','button:not(".unable")',function(){
        $(this).siblings().removeClass('unable');
        var nowPage = $('.next_page').data('now');
        if($(this).index()){
            //下一頁
            var pageNum = parseInt(nowPage)+1;
        }else{
            //上一頁
            var pageNum = parseInt(nowPage)-1;
            if(pageNum<=1){
                pageNum == 1;
                $('.next_page button').eq(0).addClass('unable');
            }
        }
        $('.next_page').data('now',pageNum);
        getData(pageNum);
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
        if($(this).hasClass('show')){
            $('.navtypeview').slideUp();
            $(this).removeClass('show');
        }else{
            $('.navtypeview').slideDown();
            $(this).addClass('show');
        }
    });
})