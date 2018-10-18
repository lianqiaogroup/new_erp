var jsonData = JSON.parse(document.getElementById('JSONDATA').innerHTML);

console.log(jsonData);

var app = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: (function(){
        var swiperData = jsonData.photos ? jsonData.photos.map(function(item){ return item.thumb }) : [jsonData.thumb];
        // console.log(swiperData)
        jsonData.swiperData = swiperData;
        jsonData.loaded = false;
        jsonData.previewImg = "/public/image/product-preview.png";
        // jsonData.testhtml = '<p><img src="https://img.alicdn.com/imgextra/i1/31803897/TB2iHomlwxlpuFjSszgXXcJdpXa_!!31803897.jpg"/><img src="https://img.alicdn.com/imgextra/i2/31803897/TB279kElrplpuFjSspiXXcdfFXa_!!31803897.jpg"/><img src="https://img.alicdn.com/imgextra/i2/31803897/TB21TfQlCBjpuFjy1XdXXaooVXa_!!31803897.jpg"/><img src="https://img.alicdn.com/imgextra/i3/31803897/TB2s912mxtmpuFjSZFqXXbHFpXa_!!31803897.jpg"/></p>';
        console.log(jsonData.content);
        jsonData.content = jsonData.content.replace(/&lt;/g, "<");
        jsonData.content = jsonData.content.replace(/&gt;/g, ">");
        jsonData.content = jsonData.content.replace(/width="\w*"/g, "");
        jsonData.content = jsonData.content.replace(/height="\w*"/g, "");
        jsonData.content = jsonData.content.replace(/class=""/g, "");
        jsonData.content = jsonData.content.replace(/<img src=/g, '<img src="'+jsonData.previewImg+'" class="testPreload" data-origion=');
        return jsonData;
    })()
    , computed: {
        off: function(){
            return parseInt(((this.market_price-this.price)/this.market_price)*100);
        }
    }
    , updated: function(){
        // 
        TouchSlide({ slideCell:"#slider" });
        // 
        lazyload();
        // 
        window.setInterval(function(){ShowCountDown(2018,4,20,'timer');}, 1000);
    }
    , mounted: function(){
        this.loaded = !this.loaded;
    }
});






function ShowCountDown(year,month,day,divname){
    var now = new Date();
    var endDate = new Date(year,month-1, day, now.getHours()+8);
    var leftTime=endDate.getTime()-now.getTime();
    var leftsecond = parseInt(leftTime/1000);
    var day1=Math.floor(leftsecond/(60*60*24));
    var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
    var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
    var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
    var cc = document.getElementById(divname);
    cc.innerHTML ="<span id='h'>"+0+hour+"</span>"+"<span class='colon'>:</span>"+"<span id='m'>"+minute+"</span>"+"<span class='colon'>:</span>"+"<span id='s'>"+second+"</span>"+"<span class='colon'></span>";
}


// 懒加载
function lazyload(){

    var screenHeight = window.screen.height;

    // 第一次加载
    setTimeout(function(){
        showImg(screenHeight);
    },100);


    window.addEventListener('scroll', function(){
        var imgs = document.querySelectorAll('[data-origion]');
        if( imgs.length==0 ){ 
            window.removeEventListener('scroll',arguments.callee);
            return false;
        }else{
            var screenHeight = window.screen.height;
            var screenScroll = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;;
            showImg(screenScroll + screenHeight);
        }
    });

    function showImg(px){
        var imgs = document.querySelectorAll('[data-origion]');
        imgs.forEach(function(item, index){
            var offsetTop = item.offsetTop;
            if( offsetTop <= px ){
                var self = item;
                var origion = self.getAttribute('data-origion');
                setTimeout(function(){
                    self.setAttribute('src', origion);
                    self.removeAttribute('data-origion');
                    self.addEventListener('load', function(){
                        if( self.parentNode.getAttribute('class') == "testPreload" ){
                            self.parentNode.removeAttribute('class');
                        }
                        console.log(origion+" loaded");
                    });
                }, 100);
            }
        });
    }
}

