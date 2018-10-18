/**
  *******************************************************************
  ************* ─────────────────── **************
  *************     BDPHP在线订单系统V10.0官方正式版   **************
  ************* ─────────────────── **************
  ************* 官方网站：http://www.97235.com/        **************
  ************* 程序开发：缘梦龙                       **************
  ************* 客户服务：[淘宝旺旺] 缘梦龙            **************
  ************* 技术支持：[腾讯QQ] 344285856           **************
  *******************************************************************
  *************   官方正版 *** 版权所有 *** 盗版必究   **************
  ******************************************************************* 
 */

window.onerror = function(){return true;} 
///////////////////////////////////////// price 后续支付宝开发专用 /////////////////////////////////////////
function pricea(){
	var bdproduct = document.bdform.bdproduct.alt;
	for(var i=0;i<document.bdform.bdproduct.length;i++){
		if(document.bdform.bdproduct[i].checked==true){
			var bdproduct = document.bdform.bdproduct[i].alt;
			break;
		}
	}
    if(document.bdform.num.value=="" || document.bdform.num.value==0){	
		var num=1;
	}
	else{
		var num=document.bdform.num.value;
	}	
	var bdprice=bdproduct*num;
	document.bdform.bdprice.value=bdprice;
	document.getElementById("showprice").innerHTML=bdprice;
}
function priceb(){
    var bdcpxljg = document.getElementById("bdproduct");
    var bdproduct = bdcpxljg.options[document.getElementById("bdproduct").options.selectedIndex].title; 
    if(document.bdform.num.value=="" || document.bdform.num.value==0){	
		var num=1;
	}
	else{
		var num=document.bdform.num.value;
	}	
	var bdprice=bdproduct*num;
	document.bdform.bdprice.value=bdprice;
	document.getElementById("showprice").innerHTML=bdprice;
}

///////////////////////////////////////// pay /////////////////////////////////////////
function changeItem(i){
    var k = 3;
	for(var j = 0;j < k;j++){
	    if(j == i){
		    document.getElementById("paydiv" + j).style.display = "block";
		}
		else{		
		    document.getElementById("paydiv" + j).style.display = "none";
		}
	}
}
function opay(){
	document.getElementById("bdform").target="_parent";
}
function opay2(){
    document.getElementById("bdform").target="_blank";
}

///////////////////////////////////////// ref /////////////////////////////////////////
var bdllref = '';
if (document.referrer.length > 0){
	bdllref = document.referrer;
}
try{
	if (bdllref.length == 0 && opener.location.href.length > 0){
    bdllref = opener.location.href;
	}
}
catch (e){}
document.cookie="BDLLURL=" + bdllref + ";path=/";
document.getElementById("bdddll").value = window.top.document.referrer;
pricea();

// BDPHPORDER