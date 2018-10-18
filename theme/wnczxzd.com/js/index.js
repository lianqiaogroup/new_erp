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
    cc.innerHTML ="<span id='h'>"+0+hour+"</span>"+"<span class='colon'>時</span>"+"<span id='m'>"+minute+"</span>"+"<span class='colon'>分</span>"+"<span id='s'>"+second+"</span>"+"<span class='colon'>秒</span>";
}
window.setInterval(function(){ShowCountDown(2018,4,20,'timer');}, 1000);

//销售百分比
function percent(){
    //获取时间点
    var curhour= $('.percentBar').attr('data-value');
    var base=0,range=0;
    var percent   = document.getElementById("percentNum");
    var progress  = document.getElementById("progress");
    var soldNum  = document.getElementById("soldNum");
    if(curhour<=1000){
        base=70;range=5;
    }else
    if(curhour<=2000){
        base=70;range=10;
    }else
    if(curhour<=4000){
        base=70;range=15;
    }else
    if(curhour<=6000){
        base=70;range=20;
    }else
    if(curhour<=8000){
        base=70;range=25;
    }else
    if(curhour<100000){
        base=70;range=28;
    }
    var opercent=Math.floor(range+base);
    progress.style.width = percent.innerHTML = opercent+"%";
}

$(function(){
    percent();
});


function gotoCheckout(){
    window.location.href="/checkout.php";
}