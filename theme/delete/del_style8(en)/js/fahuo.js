
var marquee = new Array(
    "<p><span>[最新購買]：</span>張**（095***6831）在1分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>李**（093***1685）在3分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>趙**（091***8603）在5分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>劉**（093***3943）在2分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>張**（098***5500）在4分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>",
    "<p><span>[最新購買]：</span>王**（092***0214）在6分鐘前訂購了"+quotes[Math.floor((Math.random()*quotes.length))]+" <font color='#FF0000'>√</font></p>"
);
var wfgdaa = 0;
var wfgdbb = 1;
function marqueeL(){
	if(wfgdaa>(marquee.length-1))
	wfgdaa = 0;
	if(wfgdbb>(marquee.length-1))
	wfgdaa = 0;
	wfgdbb = wfgdaa +1;
	var marHTML = marquee[wfgdaa]+marquee[wfgdbb];
	document.getElementById("fahuo").innerHTML = marHTML;
	wfgdaa +=1;
	wfgdbb +=1;
}
window.setInterval("marqueeL()", 3000);