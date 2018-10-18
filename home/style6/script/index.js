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
        $('body').addClass('with-panel-left-reveal');
        $('#panelview').show();
        $('#icon').removeClass('up').addClass('down');
        $('.class_layer').hide();
        $('body').removeClass('overhidden');
    });
    $('#menuclose,.panel-user').click(function(){
        $('body').removeClass('with-panel-left-reveal');
        $('#panelview').hide();
    });
    $('.vertical-view').click(function(){
        $('.vertical-view').removeClass('check');
        $(this).addClass('check')
    })
    var cat_id = Cjs.url.getParamByName('category_id');
    if(cat_id){
        $('#carousel-example-generic').hide();
        $.get('/?act=getCategoryGoods&category_id='+cat_id, function(data) {
            var datajson = JSON.parse(data);
            var html = getdatatitle(datajson.ModuleGoods);
            $('#content').show().find('.row').html('').append(html);
            imgwh();
        })
    }else{
        $.get('/?act=getAjaxGoods', function(data) {
            var datajson = JSON.parse(data);
            var html = getdatatitle(datajson.ModuleGoods);
            $('#content').show().find('.row').append(html);
            imgwh();
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
        $('.imgthumb').css({'width':width,'height':width});
        window.onresize = function(){
            var width = $('.caption').width() + "px";
            $('.imgthumb').css({'width':width,'height':width});
        }
    }
});
