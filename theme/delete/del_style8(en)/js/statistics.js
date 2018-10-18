/**
 * Created by Administrator on 2017/3/28 0028.
 */

var domain = window.location.host;
var style = document.getElementById("style").value;
var time = new Date();
var url = 'http://www.static.com/domainStyle.php?';
//console.log(url)
//var url = url+"domain="+domain+'&style='+style+"&key="+"buguniao";
console.log(url)
//var arr = [domain,style]
//console.log(arr[0])

//定时缓存上传
var MyLocalStorage ={
    Cache : {

        put : function(key,stringVal,time){
            try{
                if(!localStorage){return false;}
                if(!time || isNaN(time)){time=60;}
                var cacheExpireDate = (new Date()-1)+time*1000;
                var cacheVal = {val:stringVal,exp:cacheExpireDate};
                localStorage.setItem(key,JSON.stringify(cacheVal));//存入缓存值
                //console.log(key+":存入缓存，"+new Date(cacheExpireDate)+"到期");
            }catch(e){}
        },
        /**获取缓存*/
        get : function (key){
            try{
                if(!localStorage){return false;}
                var cacheVal = localStorage.getItem(key);
                var result = JSON.parse(cacheVal);
                var now = new Date()-1;
                if(!result){return null;}//缓存不存在
                if(now>result.exp){//缓存过期
                    this.remove(key);
                    return "";
                }
                //console.log("get cache:"+key);
                return result.val;
            }catch(e){
                this.remove(key);
                return null;
            }
        },
        remove : function(key){
            if(!localStorage){return false;}
            localStorage.removeItem(key);
        },/**清空所有缓存*/
        clear : function(){
            if(!localStorage){return false;}
            localStorage.clear();
        }
    }//end Cache
}
//存入信息10天,并取出
//var user = {domain:window.location.host,nickName:document.getElementById("style").value}
MyLocalStorage.Cache.put("cookieKey",url,10*24*60*60);//存储十天
MyLocalStorage.Cache.get("cookieKey");//得到的是Object {}，如果过期，此处取到的是空字符串
//得到KEY后再传值到统计页面
localStorage.setItem("cookieKey", url+"domain="+domain+'&style='+style+"&key="+"buguniao");
console.log(localStorage.getItem("cookieKey"))
// 创建script标签，设置其属性
var script = document.createElement('script');
script.setAttribute('src', url);
// 把script标签加入head，此时调用开始
document.getElementsByTagName('head')[0].appendChild(script);
