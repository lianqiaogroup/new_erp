/**
  **************************************************************************************************
  **********  WFPHP在线订单系统2014官方正式版  *****  官方正版 *** 版权所有 *** 盗版必究  **********
  **********------------------------------------------------------------------------------**********
  **********  官方网站：http://www.wf1805.cn/  *****  官方店铺：http://889889.taobao.com/ **********
  **************************************************************************************************
  ** 声明：PCAS 版权所有:崔永祥
  */
SPT="选省份";
SCT="选城市";
SAT="选地区";
ShowT=1;
PCAD="台湾省$台北市,中正区,大同区,中山区,松山区,大安区,万华区,信义区,士林区,北投区,内湖区,南港区,文山区|高雄市,新兴区,前金区,芩雅区,盐埕区,鼓山区,旗津区,前镇区,三民区,左营区,楠梓区,小港区|基隆市,仁爱区,信义区,中正区,中山区,安乐区,暖暖区,七堵区|台中市,中区,东区,南区,西区,北区,北屯区,西屯区,南屯区|台南市,中西区,东区,南区,北区,安平区,安南区|新竹市,东区,北区,香山区|嘉义市,东区,西区|县,台北县(板桥市),宜兰县(宜兰市),新竹县(竹北市),桃园县(桃园市),苗栗县(苗栗市),台中县(丰原市),彰化县(彰化市),南投县(南投市),嘉义县(太保市),云林县(斗六市),台南县(新营市),高雄县(凤山市),屏东县(屏东市),台东县(台东市),花莲县(花莲市),澎湖县(马公市)";
if(ShowT)PCAD=SPT+"$"+SCT+","+SAT+"#"+PCAD;PCAArea=[];PCAP=[];PCAC=[];PCAA=[];PCAN=PCAD.split("#");for(i=0;i<PCAN.length;i++){PCAA[i]=[];TArea=PCAN[i].split("$")[1].split("|");for(j=0;j<TArea.length;j++){PCAA[i][j]=TArea[j].split(",");if(PCAA[i][j].length==1)PCAA[i][j][1]=SAT;TArea[j]=TArea[j].split(",")[0]}PCAArea[i]=PCAN[i].split("$")[0]+","+TArea.join(",");PCAP[i]=PCAArea[i].split(",")[0];PCAC[i]=PCAArea[i].split(',')}function PCAS(){this.SelP=document.getElementsByName(arguments[0])[0];this.SelC=document.getElementsByName(arguments[1])[0];this.SelA=document.getElementsByName(arguments[2])[0];this.DefP=this.SelA?arguments[3]:arguments[2];this.DefC=this.SelA?arguments[4]:arguments[3];this.DefA=this.SelA?arguments[5]:arguments[4];this.SelP.PCA=this;this.SelC.PCA=this;this.SelP.onchange=function(){PCAS.SetC(this.PCA)};if(this.SelA)this.SelC.onchange=function(){PCAS.SetA(this.PCA)};PCAS.SetP(this)};PCAS.SetP=function(PCA){for(i=0;i<PCAP.length;i++){PCAPT=PCAPV=PCAP[i];if(PCAPT==SPT)PCAPV="";PCA.SelP.options.add(new Option(PCAPT,PCAPV));if(PCA.DefP==PCAPV)PCA.SelP[i].selected=true}PCAS.SetC(PCA)};PCAS.SetC=function(PCA){PI=PCA.SelP.selectedIndex;PCA.SelC.length=0;for(i=1;i<PCAC[PI].length;i++){PCACT=PCACV=PCAC[PI][i];if(PCACT==SCT)PCACV="";PCA.SelC.options.add(new Option(PCACT,PCACV));if(PCA.DefC==PCACV)PCA.SelC[i-1].selected=true}if(PCA.SelA)PCAS.SetA(PCA)};PCAS.SetA=function(PCA){PI=PCA.SelP.selectedIndex;CI=PCA.SelC.selectedIndex;PCA.SelA.length=0;for(i=1;i<PCAA[PI][CI].length;i++){PCAAT=PCAAV=PCAA[PI][CI][i];if(PCAAT==SAT)PCAAV="";PCA.SelA.options.add(new Option(PCAAT,PCAAV));if(PCA.DefA==PCAAV)PCA.SelA[i-1].selected=true}}
/*///////////////////////////////////////// WFORDERJSEND /////////////////////////////////////////*/