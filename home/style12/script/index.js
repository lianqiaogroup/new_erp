~(function(){
    if( window.Cjs ){ console.error('命名空间冲突, window.Cjs'); return false; }
    var Cjs = {}
    window.Cjs = Cjs;
})();
// url extend
Cjs.url = function(){
    var that = this;
    this.getParamByName = function(name){
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    this.getParams = function(names){
        if( !names.isArray() ){ return null; }
        var value = {};
        names.map(function(key, idx){
            value[key] = that.getParamByName(names[idx]);
        });
        return value;
    }
    return this;
}();
$(function(){
    //首页
    var mySwiper = new Swiper('#imgScroller', {
        autoplay: 3000,
        loop: false,
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next',
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
    $.get('/?act=getAjaxGoods', function(data) {
        var datajson = JSON.parse(data);
        for(item in datajson){
            var titleHtml = '<div class="cat_title"><span class="cat_name">' + datajson[item].title + '</span></div><div class="more"><a href="./?category_id='+ item +'&show=1">MORE &gt;&gt;</a></div>'
            var row = datajson[item].goods;
            var end = row.length<4?row.length:4;
            $('#content').append(titleHtml);
            var module = $('#module_dome').clone().html();             
            var html = ''
            for(var i=0;i<end;i++){
                var newstr = module;
                newstr = newstr.replace(/\{url\}/g,row[i].identity_tag);
                newstr = newstr.replace(/\{thumb\}/g,row[i].thumb);
                newstr = newstr.replace(/\{title\}/g,row[i].title);
                if(row[i].currency_prefix == "1"){
                    newstr = newstr.replace(/\{shop_price\}/g,row[i].currency_code+row[i].price+'<sup>.00</sup>');
                }else{
                    newstr = newstr.replace(/\{shop_price\}/g,row[i].price+'<sup>.00</sup>'+row[i].currency_code);
                };
                html = html +newstr;
            }
            $('#content').append('<div class="row wcolor clearfix">'+html+'</div>');
        }
        // var html = getdatatitle(datajson.ModuleGoods);
        // $('#content').show().find('.row').append(html);
        imgwh();
    })
    function getCateData(){

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

    function imgwh(){
        var width = $('.caption').width() + "px";
        $('.imgthumb').css({'width':width,'height':width});
        window.onresize = function(){
            var width = $('.caption').width() + "px";
            $('.imgthumb').css({'width':width,'height':width});
        }
    }

    $('.parent_category').on('click',function(){
        if($(this).hasClass('show')){
            window.location.href = $(this).data('link');
        }else{
            $(this).parent().siblings().find('.parent_category').removeClass('show').next().slideUp();
            $(this).next().slideDown();
            $(this).addClass('show')
        };
    })
});
