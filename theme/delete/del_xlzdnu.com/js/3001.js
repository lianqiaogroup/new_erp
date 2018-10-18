var fromurl=document.referrer;
var nowurl=location.href;

document.writeln('<div align=center><iframe src=\"3001.html?f='+escape(fromurl)+'&n='+escape(nowurl)+'\" frameborder=\"0\" scrolling=\"no\" width=\"100%\" height=\"1060\"><\/iframe><\/div>')
