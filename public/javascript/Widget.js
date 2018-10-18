define(['jquery'],function($){

    var widget = {
        // 计时器 //divnames:倒计时的id，lang:地区语言
        timeSet:function(years,months,days){        
            var year = years,month = months,day = days;
            function ShowCountDown(){
                var now = new Date();
                var endDate = new Date(year,month-1, day, now.getHours()+8);
                var leftTime=endDate.getTime()-now.getTime();
                var leftsecond = parseInt(leftTime/1000);
                var day1= Math.floor(leftsecond/(60*60*24));
                var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
                var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
                var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
                //if (day   <= 9) day = "0" + day;
                if (hour   <= 9) hour = "0" + hour;
                if (minute <= 9) minute = "0" + minute;
                if (second <= 9) second = "0" + second;
                //document.getElementById("d").innerHTML = day;
                if( document.getElementById("h") ){
                    document.getElementById("h").innerHTML = hour;
                    document.getElementById("m").innerHTML = minute;
                    document.getElementById("s").innerHTML = second;
                }
                //cc.innerHTML = hour+"時"+minute+"分"+second+"秒";
            }
            window.setInterval(function(){
                ShowCountDown();
            }, 1000);
        }
        //销售百分比
        , percent:function(soldNum,percentNum,progress){
            var curhour= $('.percentBar').attr('data-value');
            var base=0,range=0;
            var percent   = document.getElementById("percentNum");
            var progress  = document.getElementById("progress");
            if(curhour<=10000){
                base=70;range=5;
            }else
            if(curhour<=20000){
                base=70;range=10;
            }else
            if(curhour<=40000){
                base=70;range=15;
            }else
            if(curhour<=80000){
                base=70;range=20;
            }else
            if(curhour<=130000){
                base=70;range=25;
            }else
            if(curhour<200000){
                base=70;range=28;
            }
            var opercent=Math.floor(range+base);
            try{
                progress.style.width = percent.innerHTML = opercent+"%";
            }catch(ex){
                
            }
        }
        // 金额格式化
        , fmoney:function(s, n){
            n = n > 0 && n <= 20 ? n : 2;   
           s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
           var l = s.split(".")[0].split("").reverse(),      
           t = "";   
           for(i = 0; i < l.length; i ++ )   
           {   
              t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
           }   
           return t.split("").reverse().join("");  
        }
        // smsvalid
        , smsvalid: {
            api: {
                checkOpen: '/api_sms_send.php?do=is_open_sms'
                , sendO:"/api_sms_send.php?do=order"
                , send: "/api_sms_send.php?do=send"
                , verify: "/api_sms_send.php?do=verify"
                , resend: "/api_sms_send.php?do=resend"
            }
            , orderResponse: ""
            , sms_token:""
            , sendLock: false
            , sendTimestamp: null
            , lockTime: 120
            , init: function(){
                var self = this;
                var theme = $('#theme').val() || '';
                if (theme == "style83") {
                    window.smsAuth = false;
                    console.log('smsAuth='+window.smsAuth);
                }else{
                    var product_id = $('[name="product_id"]').val() || '';
                    $.post( self.api.checkOpen, {
                        "product_id": product_id
                    }, function(data) {
                        var res = JSON.parse(data);
                        if( res.is_open_sms == 1 ){
                            window.smsAuth = true;
                            self.render();
                        }else{
                            window.smsAuth = false;
                        }
                    });
                }
            }
            // 添加html节点
            , render: function(){
                var self = this;
                var region_code = $('#region_code').val() || 'TW';
                var lang = {
                    'THA': {
                        'title': 'กรุณากรอกรหัสยืนยัน'
                        , 'sendto': 'รหัสยืนยันส่งไปโทรศัพท์'
                        , 'take': 'กรุณาเช็คดูค่ะ'
                        , 'if_no': 'ถ้าไม่ได้รับรหัสยืนยัน'
                        , 'click': 'กรุณากด'
                        , 'resend': 'ส่งรหัสยืนยันใหม่ค่ะ '
                        , 'wait': 'วินาทีส่งใหม่ได้ค่ะ'
                        , 'wait_before':''
                    }
                    , 'TW': {
                        'title': '請輸入簡訊驗證碼'
                        , 'sendto': '驗證碼已發送到手機'
                        , 'take': '，請注意查收。'
                        , 'if_no': '如果收不到驗證碼，'
                        , 'click': '點擊'
                        , 'resend': '重新發送驗證碼'
                        , 'wait': '秒后可重新發送'
                        , 'wait_before':''
                    }
                    , 'VNM': {
                        'title': 'Làm ơn nhắn nhập CAPTCHA'
                        , 'sendto': 'CAPTCHA đã gửi đến điện thoại di động'
                        , 'take': ' Xin hãy chú ý kiểm tra và nhận. '
                        , 'if_no': 'Nếu không nhận được xác nhận.'
                        , 'click': 'Nhấn vào'
                        , 'resend': 'Gửi lại mã xác thực'
                        , 'wait': 'giây để gửi lại'
                        , 'wait_before': ''
                    }
                    , 'SAU': {
                        'title': 'الرجاء إدخال  رمز التحقق من  الرسائل '
                        , 'sendto': 'رمز التحقق  تم إرسالها إلى  الهاتف المحمول '
                        , 'take': ' يرجى التحقق من ذلك  . '
                        , 'if_no': ' إذا كنت  لا تتلقى  رمز التحقق '
                        , 'click': 'انقر على '
                        , 'resend': ' إعادة إرسال  كود التحقق '
                        , 'wait': 'بعد  ثوان  إعادة إرسال '
                        , 'wait_before': ''
                    }
                    , 'PHL':{
                        'title': 'Please enter your message verification code '
                        , 'sendto': 'Verification code sent to your phone '
                        , 'take': '. Please note that check '
                        , 'if_no': '. If not received,'
                        , 'click': 'click here '
                        , 'resend': 'to send the code again.'
                        , 'wait': 's later the verification code can be resent.'
                        , 'wait_before':''
                    }
                    , 'HK': {
                        'title': '請輸入簡訊驗證碼'
                        , 'sendto': '驗證碼已發送到手機'
                        , 'take': '，請注意查收。'
                        , 'if_no': '如果收不到驗證碼，'
                        , 'click': '點擊'
                        , 'resend': '重新發送驗證碼'
                        , 'wait': '秒后可重新發送'
                        , 'wait_before':''
                    }
                    , 'KHM': {
                        'title': 'សូមបញ្ចូលលេខកូដសម្ងាត់'
                        , 'sendto': 'លេខកូដសម្ងាត់បានផ្ញើទៅទូរស័ព្ទ'
                        , 'take': ',សូមទទួលត្រួតពិនិត្យមើល'
                        , 'if_no': 'ប្រសិនបើមិនទទួលបានលេខកូដសម្ងាត់,'
                        , 'click': 'សូមចុច'
                        , 'resend': 'ផ្ញើលេខកូដសម្ងាត់សារជាថ'
                        , 'wait': 'មួយភ្លេតទៀតនឹងធ្វើការផ្ញើសារជាថ្ម'
                        , 'wait_before':''
                    }
                    , 'IND':{
                        'title': 'Please enter your message verification code '
                        , 'sendto': 'Verification code sent to your phone '
                        , 'take': '. Please note that check '
                        , 'if_no': '. If not received,'
                        , 'click': 'click here '
                        , 'resend': 'to send the code again.'
                        , 'wait': 's later the verification code can be resent.'
                        , 'wait_before':''
                    }
                    , 'TUR': {
                        'title': 'lütfen SMS doğrulama kodunu giriniz'
                        , 'sendto': 'doğrulama kodu telefona gönderildi '
                        , 'take': ',lütfen kontrol ediniz'
                        , 'if_no': 'eğer doğrulama kodu alınmadıysa,'
                        , 'click': 'tıklayın'
                        , 'resend': 'doğrulama kodunu tekrar göndere.'
                        , 'wait': ' saniye sonra tekrar gönderilir.'
                        , 'wait_before':''
                    }
                    , 'PAK': {
                        'title': 'Please enter your message verification code '
                        , 'sendto': 'Verification code sent to your phone '
                        , 'take': '. Please note that check '
                        , 'if_no': '. If not received,'
                        , 'click': 'click here '
                        , 'resend': 'to send the code again.'
                        , 'wait': 's later the verification code can be resent.'
                        , 'wait_before': ''
                    }
                }
                if (region_code == 'Rp'||region_code == 'MYS') {
                    lang = window.SMSlang;
                }
                var html = '<div class="verify-popup"></div> <div class="verify-code" style="display: none;"> <div class="backdrop"></div> <div class="content"> <div class="title"> <div class="close">&times;</div> <div class="text">|title|</div> </div> <div class="message"> <div class="text"> <div class="resend">|sendto|<div class="mobile-content"></div>|take||if_no||click|<a href="javascript:void(0);" class="resendCode">|resend|</a> </div> <div class="wait">|sendto|<div class="mobile-content"></div>|take||if_no||wait_before|<div class="time-content"></div>|wait|</div> </div> </div> <div class="number"> <input data-index="1" readonly> <input data-index="2" readonly> <input data-index="3" readonly> <input data-index="4" readonly data-last="true"> <input class="actual-input" maxlength="4" type="text" style="z-index: -100; opacity: 0;"> </div> </div> </div> </div>'
                for( key in lang[region_code] ){
                    html = html.replace("|"+key+"|", lang[region_code][key] );
                    html = html.replace("|"+key+"|", lang[region_code][key] );
                }
                var hidden = '<input type="hidden" name="orderId" value="">';
                $('body').append(html).find('#form').prepend(hidden);
                // 
                $(".verify-code .close").click(this.vcodeClose);
                $(".verify-code .resendCode").click(function(){
                    self.sendCode();
                });
                // input code
                $(".actual-input").on('input', function(){
                    var v = $(this).val();
                        v = v.replace(/\D/g,'');
                        $(this).val(v);
                $(".verify-code input[data-index='1']").val(v[0]||'');
                $(".verify-code input[data-index='2']").val(v[1]||'');
                $(".verify-code input[data-index='3']").val(v[2]||'');
                $(".verify-code input[data-index='4']").val(v[3]||'');
                    if(v.length >= 4){
                        self.performVerify(v);
                    }
                });
                $('.verify-code .number input').click(function(event) {
                    $(".actual-input").focus();
                });
            }
            // 显示短信验证码输入框
            , start: function(formdata){
                if(typeof(ajaxLocked) != "undefined" && ajaxLocked == true ){
                    return false;
                }else{
                    this.sendOrder();
                }
            }
            , vcodeShow: function(){
                $(".verify-code").show();
                var x = $("[name='mob']").val();
                    x = x.slice(0, 2) + "****" + x.slice(6);
                $(".verify-code .mobile-content").text(x);
                $(".actual-input").val('').focus();
            }
            , vcodeClose: function(){
                $(".verify-code").css('display', 'none');
                $(".verify-code input[data-index]").each(function(i, e){
                    e.value = "";
                });
            }
            , sendCode:function(ret){
                var self = window.widget.smsvalid;
                if( self.sendLock ){ return false; }
                self.sendLock = true;
                var _api = self.api.send;
                if( typeof(ret)=="undefined" ){
                    ret = self.orderResponse;
                    _api = self.api.resend;
                }
                var mobile = $("[name='mob']").val();
                var product_id = $('[name="product_id"]').val();
                $(".verify-code").addClass("verifying");
                $.ajax({
                    url: _api,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        do: "send"
                        , "mobile": mobile
                        , "orderId": ret.orderId
                        , "token": ret.token
                        , "product_id": product_id
                    }
                    , success: function(ret){
                        self.verifyPopup(ret.ret_msg);
                    }
                });
                sendTimestamp = setInterval(function(){
                    self.lockTime = self.lockTime-1;
                    $(".verify-code .time-content").text(self.lockTime);
                    if( self.lockTime <= 0 ){
                        clearInterval(sendTimestamp);
                        $(".verify-code").removeClass("verifying");
                        self.sendLock = false;
                        self.lockTime = 120;
                    }
                },1000);
            }
            , sendOrder: function(){
                var self = window.widget.smsvalid;
                var formdata = $('#form').serialize();
                var theme = $('#theme').val();
                $.ajax({
                    url: self.api.sendO,
                    type: 'post',
                    dataType: 'json',
                    data: formdata,
                    success: function(ret){
                        // 新版本短信验证码
                        if (ret.ret_code==200 && theme=='style32_3') {
                            var newSmsParam = {
                                product_id: $("[name='product_id']").val()
                                , mobile: $("[name='mob']").val()
                                , token: ret.token
                                , orderId: ret.orderId
                            }
                            self.gotoSmsPage(newSmsParam);
                            return false;
                        }
                        // 老版本短信
                        if( ret.ret_code==200 ){
                            // 显示短信框
                            self.vcodeShow();
                            //
                            try{
                                ret.fb_px.map(function(i){
                                    fbq('trackSingle', i, 'Purchase', {value: "30", currency:"USD", No: ret.orderId });
                                });
                            }catch(e){
                                // fbq('track', 'Purchase', {value: '30', currency:'USD'});
                            }
                            // 
                            try{
                                ret.ga.map(function(row){
                                    ga('ec:addProduct', {'id': row.id, 'name': row.name, 'variant': row.variant, 'price': row.price, 'quantity': row.quantity });
                                    ga('googleDepartment.ec:addProduct', {'id': row.id, 'name': row.name, 'variant': row.variant, 'price': row.price, 'quantity': row.quantity });
                                });
                                ga('ec:setAction', 'purchase', {'id': ret.orderid , 'revenue': ret.total , 'shipping': '0', 'option': ret.pay_method });
                                ga('send', {hitType: 'event', eventCategory: 'Checkout', eventAction: 'Order Paid Success', eventLabel: ret.pay_method+"&"+ret.orderid+"&"+ret.total , nonInteraction: true });
                                ga('googleDepartment.ec:setAction', 'purchase', {'id': ret.orderid , 'revenue': ret.total , 'shipping': '0', 'option': ret.pay_method });
                                ga('googleDepartment.send', {hitType: 'event', eventCategory: 'Checkout', eventAction: 'Order Paid Success', eventLabel: ret.pay_method+"&"+ret.orderid+"&"+ret.total , nonInteraction: true });
                            }catch(e){}
                            // 
                            var _orderId = ret.orderId;
                            var _mobile = $("[name='mob']").val();
                            var _website = ret.website;
                            // 监控fb
                            $.post('/api_facebook.php', {
                                'orderId': _orderId
                                , 'website': _mobile
                                , 'mobile': _website
                            }, function(res) {
                                // console.log(res);
                            });
                        
                            $("#form [name='orderId']").val(ret.orderId);
                            var orderInfo = {
                                tag: ret.tag
                                , orderId: ret.orderId
                            }
                            sessionStorage.orderInfo = JSON.stringify(orderInfo);
                            self.sms_token = ret.token;
                            self.orderResponse = ret;
                            self.sendCode(ret);
                            // 关闭弹窗跳转到订单成功页面
                            $('.verify-code .close').on('click', function(event) {
                                event.preventDefault();
                                window.location = "/api_order.php?orderId=" + ret.orderId + "&verify=1";
                            });
                        }else if(ret.ret_code == 500){
                            if( ret.ret_msg ){
                                alert(ret.ret_msg);
                            }else{
                                alert('fail');
                            }
                            window.location.href = "http://"+ret.website;
                        }
                    }
                });
            }
            , verifyPopup: function(text){
                $(".verify-popup").text(text).addClass("animation");
                $(".verify-popup.animation").css({'opacity':'1','z-index':'1001'})
                setTimeout(function(){
                    $(".verify-popup.animation").css({'opacity':'0','z-index':'-1000'})
                }, 5000);
            }
            , performVerify: function(vcode){
                var self = this;
                var mobile = $("[name='mob']").val();
                var code = vcode ? vcode : $(".actual-input").val();
                var orderId = $("form [name=orderId]").val();
                var product_id = $('[name="product_id"]').val();
                $.ajax({
                    url: self.api.verify
                    , type: 'post'
                    , data: {
                        "mobile": mobile,
                        "vercode":code,
                        "orderId":orderId,
                        "token":self.sms_token,
                        "product_id": product_id,
                    }
                    , dataType: 'json'
                    , success: function(response){
                        var ret = response;
                        if(ret.ret_code == 200){
                            self.verifyPopup(ret.ret_msg);
                            window.location = "/api_order.php?orderId=" + orderId;
                        }else{
                            self.verifyPopup(ret.ret_msg);
                            $(".number input").val('');
                        }
                    }
                });
            }
            // 跳到新短信验证码模块
            , gotoSmsPage: function(param) {
                var urlParam = [];
                for (key in param) {
                    urlParam.push(key + '=' + param[key]);
                }
                var url = '/sms.php?' + urlParam.join('&');
                window.location.href = url;
            }
        }
        // credit card 验证
        , checkCreditCard: function(){
            // credit card
            var pay_type = $("input[name='payment_type']").val();
            if(pay_type ==4)
            {
                if(!document.getElementById("card_number").value||!document.getElementById("card_month").value||!document.getElementById("card_year").value||!document.getElementById("card_secureCode").value){
                    var error =  document.getElementById("error").value
                    alert(error);
                    return false;
                }
                var code  =  document.getElementById("code").value ;
                var opcseForm = opcse.encryptForm("form", code);
                opcseForm.handleSubmit();
            }
            return true;
        }
        , getCookie: function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
            else
            return null;
        }
        // 统一表单提交函数
        , prepost: function(){
            var ret = (function(){
                var self = this;

                //泰国邮编地区
                try {
                    if (ajaxLocked==true) {
                        return false;
                    }
                } catch (ex) {

                }

                // 异步锁
                if (prepostLock==true) return false;

                prepostLock = true;

                // 验证表单字段
                var region_code = $('#region_code').val() || '';
                var theme = $('#theme').val() || '';
                var noaddress = $("#noaddress").val();
                if ((theme == "style57" || theme == "style87" || theme == "style73" || theme == "style27_2" || theme == "style88" || theme == "style85" || theme == "style79" || theme == "style39") && $('[name="address"]').val()==""){
                    $('[name="address"]').val("**" + noaddress);
                }
                // 实例
               

                var validForm = new ValidForm(region_code, theme);
                if (validForm.check()==false) {
                    self.postintdata('hide');
                    // 开异步锁
                    prepostLock = false;
                    // 跳出
                    return false;
                }else{
                    
                }
                    
                // 验证payment & credit card
                try {
                    if( !this.checkCreditCard() ){
                        self.postintdata('hide');
                        // 开异步锁
                        prepostLock = false;
                        // 跳出
                        return false;
                    }
                } catch(e) {
                    console.error(e);
                }
                
                // 验证fb登录
                if(this.getCookie('need_login') == 1){
                    if(!$('.fLogin a').attr('href')){
                    //获取faceBook登录URL
                        $.get('/login.php',{referer:encodeURI(document.URL)},function(res){
                            $('.fLogin a').prop('href',res.data.fb_login_url)
                        })
                    }
                    if($('.fLogin').length != 0){
                        $('.fLogin').show();
                        self.postintdata('hide');
                        // 开异步锁
                        prepostLock = false;
                        // 跳出
                        return false;
                    }
                }
               

                // 判断重复订单
                try {
                    if(!window.repeatagain){
                        // 显示
                        this.repeatOrder.showrepeat();
                        if(window.repeat_order == true){
                            // 关闭加载涂层
                            self.postintdata('hide');
                            // 跳出
                            return false;
                        }
                    }
                }catch(ex){

                }
               
                if (region_code == 'MYS') {
                    var area = $('[name="street"]').val();
                    var address = $('[name="address"]').val();
                    if (area && address && address.indexOf(area) == -1) {
                        $('[name="address"]').val(area + ' ' + address);
                    };
                }

                try {
                    // 验证sms valid
                    if (window.smsAuth==true) {
                        // 关闭加载涂层
                        self.postintdata('hide');
                        // 开始短信流程
                        var formdata = $('#form').serialize();
                        this.smsvalid.start(formdata);
                        // 跳出
                        return false;
                    }
                }catch(ex){

                }
                
                // 验证信用卡
                var pay_type = $("input[name='payment_type']:checked").val();
                if(pay_type ==4){
                    if(!document.getElementById("card_number").value||!document.getElementById("card_month").value||!document.getElementById("card_year").value||!document.getElementById("card_secureCode").value){
                        var error =  document.getElementById("error").value
                        alert(error);
                        // 开异步锁
                        prepostLock = false;
                        // 跳出
                        return false;
                    }
                    var code = document.getElementById("code").value ;
                    var opcseForm = opcse.encryptForm("form", code);
                    opcseForm.handleSubmit();
                }

                // 关闭加载涂层
                self.postintdata('hide');
                var product_md_ddn09182 = $("input#product_md_ddn0918").val();
                console.log(product_md_ddn09182);
                if(typeof(product_md_ddn09182) != "undefined" && product_md_ddn09182 != "")
                {
                    console.log("md:"+product_md_ddn09182);
                    fbq('track', 'Purchase', {value: "30", currency:"USD", tags:product_md_ddn09182});
                }
                else
                {
                    console.log("nomd");
                    fbq('track', 'Purchase', {value: "30", currency:"USD"});
                }
                
                return true;
            }).call(window.widget);
            return ret;
        }
        , repeatOrder:{
            repeatparem:{
                "mobile":'',
                "product_id":'',
                "product_attr":[],
                "combo":''
            },
            init:function(){
                var region_code = $('#region_code').val();
                if(region_code == "TW" || region_code == "HK" || region_code == "MOP"){
                    var lang = {
                        title:"溫馨提示",
                        // prompt:"尊敬的用戶，您{juest}{time}已下了{protitle}的商品，請確認是否再次下單。",
                        prompt:"尊敬的用戶，您剛剛已經購買過該商品。請查看訂單詳情。",
                        prompt_out:"尊敬的用戶，您在{time}購買了該商品，請確認是否再次下單。",
                        confirm_order:"確認下單",
                        query_details:"查詢訂單詳請",
                        time_d:"天前",
                        time_h:"小時前",
                        time_m:"分鐘前",
                        time_just:"剛剛"
                    };
                    window.repeatlang = lang;
                }
                var cssrepeat = '<style>.dis-none{display:none;}.layer_repeat{display:none;position: fixed;width: 100%;height: 100%;overflow: hidden;background: rgba(0, 0, 0, 0.65);top: 0;left:0; z-index:2;}.r_btn .ccc{color:#666;}.repeat{border-radius:6px;display:none;width: 86%;position: fixed;top: 50%;left: 50%;background: #fff;color: #222;z-index:3;transform: translateX(-50%) translateY(-50%);}.tips_text{border-bottom:1px solid #E5E5E5;padding:8%;font-size: 15px;}.r_order{border-right:1px solid #E5E5E5;}.r_title{color:#333;padding-top:4%;font-size: 18px;text-align: center;}.r_btn{display: flex;display: -webkit-flex;}.r_order,.r_inquiry{flex: 1;-webkit-flex:1;text-align: center;color:#5E9BF2;font-size: 18px;padding:10px 0;cursor: pointer;}@media screen and (min-width: 640px){.repeat{width:30%;}}.repeatshow .layer_repeat,.repeatshow .repeat{display:block;}</style>';
                var htmlrepeat = '<div class="layer_repeat"></div><div class="repeat"><div class="r_title">'+ repeatlang.title +'</div><div id="prompt" class="tips_text">'+ repeatlang.prompt +'</div><div class="r_btn"><div class="r_order" onclick="btnorder()">'+repeatlang.confirm_order+'</div><div class="r_inquiry">'+repeatlang.query_details+'</div></div></div>';
                $('body').append(cssrepeat).append(htmlrepeat);
            },
            getproattr:function(product_ids,attrss,combo_ids){

                var that = this;
                if(attrss){
                    that.repeatparem.product_id = product_ids;
                    that.repeatparem.combo = combo_ids;
                    that.repeatparem.product_attr = attrss
                }else{
                    var count = Cjs.url.getParamByName('count') ? Cjs.url.getParamByName('count'):$('input[name="num"]').val();
                    var combo_id = Cjs.url.getParamByName('combo_id');
                    var product_id = Cjs.url.getParamByName('product_id');
                    that.repeatparem.product_id = product_id;
                    that.repeatparem.combo = combo_id;

                    var str = Cjs.url.getParamByName('proto');
                    if(str){
                        var strAttr = str.split('|');
                        var repeatprpattr = [],repeatpro = [],product_attr = [];
                        if(parseInt(combo_id) != 0){
                            strAttr.map(function(elem, index) {
                                var obj = elem.split('-');
                                repeatprpattr[obj[0]] = [];
                                repeatprpattr[obj[0]].push(product_id);
                                repeatprpattr[obj[0]].push(count);
                                repeatpro.push(obj);
                            });
                            repeatprpattr.map(function(elem,index){
                                var a = [];
                                repeatpro.map(function(e,i){
                                    if(index == e[0]){
                                        a.push(e[2])
                                    }
                                })
                                repeatprpattr[index].push(a);
                                product_attr.push(repeatprpattr[index]);
                            });
                            that.repeatparem.product_attr = product_attr;
                        }else{
                            var a = [];
                            strAttr.map(function(elem, index) {
                                var obj = elem.split('-');
                                var group = obj[0];
                                var value = obj[1];
                                a.push(obj[1]);
                            });
                            that.repeatparem.product_attr = a;
                        }
                    }else{
                        that.repeatparem.product_attr = "";
                    }
                }
            },
            showrepeat:function(){
                var that = this;
                that.repeatparem.mobile = $('input[name="mob"]').val();
                window.repeat_order = true;
                // console.log(that.repeatparem);
                $.ajax({
                    url: "/api_sms.php?do=is_same_buy",
                    type:'post',
                    async: false,
                    data:that.repeatparem,
                    success:function(response){
                        var datas = JSON.parse(response);
                        if(datas.ret == 0){
                            window.repeat_order = false;
                        }else if(datas.ret == 1){
                            var text = $('#prompt').html();
                                text = text.replace(/\{protitle\}/g,datas.name);
                            var time = parseInt(datas.interval_time);//秒
                                d = parseInt(time/3600/24);
                                h = parseInt(time/3600);
                                m = parseInt(time/60);
                                s = parseInt(datas.interval_time);
                            var btnHtml = $(".r_btn").html();
                            if(m>=0 && m<=5){
                                btnHtml = btnHtml.replace(/r_order/g, 'r_order dis-none');
                                $(".r_btn").html(btnHtml);
                                var total = 5;
                                var str = repeatlang.query_details;
                                $(".r_inquiry").html(str+'('+total+'s)');
                                var clock = setInterval(function () {
                                    total--; 
                                    $(".r_inquiry").html(str + '(' + total + 's)');
                                    if (total == 0) {
                                        clearInterval(clock);
                                        $(".r_inquiry").trigger("click");
                                    };
                                }, 1000);
                            }else{
                                $(".r_order").addClass('ccc');
                                // if (s < 60) {
                                //     var thatjust = '{juest}';
                                //     if (thatjust.indexOf(text) != -1) {
                                //         text = text.replace(/\{juest\}/g, repeatlang.time_just);
                                //         text = text.replace(/\{time\}/g, '');
                                //         text = text.replace(/sebelum/g, '');
                                //         text = text.replace(/nas/g, '');
                                //     } else {
                                //         text = text.replace(/\{juest\}/g, '');
                                //         text = text.replace(/\{time\}/g, repeatlang.time_just);
                                //     }
                                // }
                                var prompt_out = repeatlang.prompt_out;
                                if (s >= 60 && m < 60) {
                                    // prompt_out = prompt_out.replace(/\{juest\}/g, '');
                                    prompt_out = prompt_out.replace(/\{time\}/g, m + repeatlang.time_m);
                                }
                                if (h >= 1 && h < 24) {
                                    // prompt_out = prompt_out.replace(/\{juest\}/g, '');
                                    prompt_out = prompt_out.replace(/\{time\}/g, h + repeatlang.time_h);
                                }
                                if (h >= 24 && h <= 72) {
                                    // prompt_out = prompt_out.replace(/\{juest\}/g, '');
                                    prompt_out = prompt_out.replace(/\{time\}/g, d + repeatlang.time_d);
                                }
                                $('#prompt').html(prompt_out);
                            }
                        
                            
                            window.repeat_order =  true;
                            if(d >= 3){
                                if( window.smsAuth == true ){
                                    $('body').removeClass('repeatshow');
                                    var formdata = $('#form').serialize();
                                    window.widget.smsvalid.start(formdata);
                                }else{
                                    // 如果已经验证过就没必要再请求
                                    if (window.repeatagain==true) return false;
                                    // 
                                    window.repeatagain = true;
                                    // 关闭异步锁
                                    window.prepostLock = false;
                                    // 开启遮罩
                                    window.widget.postintdata('show');
                                    // 提交订单
                                    $('#form').submit();
                                }
                            }else{
                                $('body').addClass('repeatshow');
                            }
                        }
                    }
                });
                btnorder = function(){
                    var theme = $('#theme').val();
                    var region_code = $('#region_code').val() || '';
                    if (region_code == 'MYS') {
                        var area = $('[name="street"]').val();
                        var address = $('[name="address"]').val();
                        if (area && address && address.indexOf(area) == -1) {
                            $('[name="address"]').val(area + ' ' + address);
                        };
                    }
                    if(typeof(theme) != "undefined" && theme == "style83"){
                        window.smsAuth = false;
                    }
                    if( window.smsAuth == true ){
                        $('body').removeClass('repeatshow');
                        // 开启遮罩
                        window.widget.postintdata('show');
                        // 
                        var formdata = $('#form').serialize();
                        window.widget.smsvalid.start(formdata);
                    }else{
                        // 如果已经验证过就没必要再请求
                        if (window.repeatagain==true) return false;
                        // 
                        window.repeatagain = true;
                        // 关闭异步锁
                        window.prepostLock = false;
                        // 开启遮罩
                        window.widget.postintdata('show');
                        // 提交订单
                        $('#form').submit();
                    }
                }
                $('body').off().on('click','.r_inquiry',function(){
                    var mob = $('input[name="mob"]').val();
                    var identity_tag = $('#identity_tag').val() || '';
                    window.widget.goto_checkOrder({
                        mob: mob,
                        identity_tag: identity_tag
                    });
                });
                return window.repeat_order;
            }
        }
        , autoFill: function(){
            var hostname = document.domain;
            var domainList = ['www.dzpas.com','www.ouoho.com','www.jhyia.com'];
            var isInArray = $.inArray(hostname,domainList);
            var style='<style>.autoFill{font-size:13px;position:fixed;right: 0;z-index: 10;top:60%;background:#fafafa;padding:10px 16px 20px;}.autoFill >div{margin-bottom:12px;}.autoFill .close{text-align:center}.autoFill >div label{display:block;width:60px;margin:0 auto;}.autoFill input[type="checkbox"]{-webkit-appearance:checkbox;margin-right:8px;width:auto;height:auto;}.autoFill a{border-radius:6px;padding:8px 16px;background:#169bd5;color:#fff;}</style>';
            var inputList = $('input[type="text"],input[type="number"],input[type="tel"],input[type="email"]');
            var inputJson = {'name':['姓名','测试'],'mob':['电话','0911111111'],'email':['邮箱','test@stosz.com'],'address':['地址','测试地址详细'],'postal':['邮编','000000'],'area':['地区','测试地区'],'last_name':['姓氏','测'],'postal_1':['邮编1','000'],'postal_2':['邮编2','000']};
            if (isInArray >= 0) {
                $('input[name="name"]').parents('#form').prepend('<div class="autoFill"><div class="close">展开/隐藏</div><div><label class="check_all"><input type="checkbox" name="check_all" value ="">全部</label></div><a>自动填充</a></div>');
                $('body').append(style);
                for(var i = 0;i<inputList.length;i++){
                    if(inputList.eq(i).attr('name') in inputJson){
                        $('.autoFill >div').eq(1).prepend('<label><input type="checkbox" name="fill_form" value="'+ inputList.eq(i).attr('name') +'">'+ inputJson[inputList.eq(i).attr('name')][0] +'</label>');
                    }
                }                
                $('.autoFill .check_all').on('click',function(){
                    $('[name="fill_form"],[name="check_all"]').prop('checked','checked'); 
                })
                $('.autoFill .close').on('click',function(){
                    $(this).next().toggle();
                })
                //填充表单
                $('.autoFill a').on('click',function(){
                    var obj=$('[name="fill_form"]');
                    for(var i=0; i<obj.length; i++){ 
                        if(obj[i].checked){
                            $('[name="'+ obj.eq(i).val() +'"]').val(inputJson[obj.eq(i).val()][1]);
                        }
                    }
                })

            }
        }
        , goto_checkOrder: function(param){
            var urls = '';
            var _arr = [];
            if( param ){
                for( key in param ){
                    _arr.push(key+"="+param[key]);
                }
                urls = '?'+_arr.join('&');
            }
            window.location.href = "/order_quality.php"+urls;
        }
        , handleActiceService: function(id){
            if( typeof(P8)!='undefined' ){
                P8.startGroupChat(id ,1);
            }
        }
        , postintdata: function(action){
            if( action == 1 ){
                var html = '<div class="ajaxLoading" style="display:none;"></div>';
                var style = '<style type="text/css"> .ajaxLoading {display: block; position: fixed; z-index: 1; background-color: rgba(255,255,255,0.5); width: 100%; height: 100%; left: 0px; top: 0px; bottom: 0px; right: 0px; } .ajaxLoading:after {display: block; position: absolute; left: 50%; top: 50%; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px; content: " "; background: url("/public/image/loading.png") no-repeat center; animation: lrotate 1s; animation-timing-function: linear; animation-iteration-count: infinite; animation-play-state: running; } @keyframes lrotate {from{transform: rotate(0deg)} to{transform: rotate(360deg)} } </style>'
                $('body').append(html).append(style);
                window.postintdataCounter = null;
                return;
            }
            try{
                var _action = typeof(action)=="undefined" ? 'show' : action;
                var layer = $('.ajaxLoading');
                if( _action=='show' ){
                    clearTimeout(window.postintdataCounter);
                    layer.length>=1 && layer.show();
                    window.postintdataCounter = setTimeout(function(){
                        if (window.prepostLock==false) {
                            layer.length>=1 && layer.hide();
                        }
                    }, 1000);
                }else{
                    layer.length>=1 && layer.hide();
                }
            }catch(e){
                return true;
            }
        }
    }
    widget.autoFill();
    widget.postintdata(1);
    window.prepostLock = false;
    window.widget = widget;
    window.prepost = widget.prepost;

});