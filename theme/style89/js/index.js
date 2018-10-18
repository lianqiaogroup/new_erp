require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
	var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'bullets'
    });
    //倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
})
// JavaScript Document
//全局
   $(function(){
	   var optH=420;
	   var opt=0;
	   var tab=$(".tab");
	   var winW=document.documentElement.clientWidth;
	   if($(window).scrollTop()>=optH){
		   tab.css("opacity","1");
	   }
	   //滚动事件
	   $(window).scroll(function(){
		   var sctop=$(window).scrollTop();
		   if(sctop>=200){
			   if(!$(".totop").hasClass("flyon")){
				   $(".totop").addClass("flyon");
			   }
		   }else{
			   if($(".totop").hasClass("flyon")){
				   $(".totop").removeClass("flyon");
			   }
		   }
	   });
	   
	   //关闭大图查看
	   $(".bigview i").click(function(){
		   closeview();
	   });
	   $(".bigview").click(function(){
		   closeview();
	   });
	   // //查看评论图片
	   // $(".pjbox .note ul li .content img").click(function(){
		  //  showpic($(this));
	   // });
	   // //关闭图片
	   // $(".outpj .newpjbox .ttl i").click(function(){
		  //  $(".outpj").removeClass("pjon");
	   // });
	   // //打开评论
	   // $(".pjbox .note .clearpj").click(function(){
		  //  $(".outpj").addClass("pjon");
	   // });
	   //星级评价
		$(".star i").click(function(){
			var starnum=$(this).index();
			$(".star i").removeClass("staron");
			for(var i=5;i>starnum;i--){
				$(".star i").eq(i).addClass("staron");
			}
		})
		//控制最新购买信息显示隐藏
	    setTimeout("newbuy()",6000);
	    setTimeout("newbuy()",11000);
	    setTimeout("newbuy()",30000);
	    setTimeout("newbuy()",180000);
	    setTimeout("newbuy()",186000);
		
   })
//方法
    //送达时间
    function getDeliveryTime(){
    	var date1 =new Date();
	    date1.setDate(date1.getDate()+7);
	    var date2 = new Date();
	    date2.setDate(date2.getDate()+14);
	    var deliveryTime = $('.deliveryTime').html().replace(/{mon1}/,(date1.getMonth()+1));
	    deliveryTime = deliveryTime.replace(/{mon2}/,(date2.getMonth()+1));
	    deliveryTime = deliveryTime.replace(/{day1}/,(date1.getDate()));
	    deliveryTime = deliveryTime.replace(/{day2}/,(date2.getDate()));
	    return deliveryTime;
    };	    
    $('.deliveryTime').html(getDeliveryTime());
	//控制最新购买信息
   function newbuy(){
	   var data=$(".nbdata").find("span");
	   var pos=Math.floor(Math.random()*data.length);
	   if(pos<0){
		   pos=0;
	   }
	   $(".newbuy").find("p").html(data.eq(pos).html());
	   $(".newbuy").addClass("nbon").delay(3000).queue(function(){
	   		$(this).removeClass("nbon");
	   		$(this).clearQueue()
	   })
   }
   //大图展示
   function showpic(me){
	   var imgsrc="";
	   if(me.attr("src")){
		   imgsrc=me.attr("src");
		   $(".bigview").find("img").attr("src",imgsrc);
		   $(".bigview").show();
	   }
	   if(me.find("img").attr("src")){
		   imgsrc=me.find("img").attr("src");
		   $(".bigview").find("img").attr("src",imgsrc);
		   $(".bigview").show();
	   }
   }
   //返回顶部
   function backtop(){
	   $('body,html').animate({"scrollTop":0},1200);
   }
   //关闭大图查看
   function closeview(){
	   $(".bigview").hide();
   }
