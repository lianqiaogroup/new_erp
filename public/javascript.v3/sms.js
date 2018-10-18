function SmsCreator(param){
    // 
    if( typeof(param)=="undefined" ){ return {}; }
    this.is_open_sms = param.is_open_sms;
    // 
    this._api = {
        checkOpen: '/api_sms_send.php?do=is_open_sms'
        , sendO:"/api_sms_send.php?do=order"
        , send: "/api_sms_send.php?do=send"
        , verify: "/api_sms_send.php?do=verify"
        , resend: "/api_sms_send.php?do=resend"
    }
    this.orderId = '';
    // 初始化
    function _init(){
        if( typeof(param.theme)!="undefined" && param.theme=="style83" ){
            this.is_open_sms = false;
            return false;
        }
        // 判定是否开启短信验证码
        if( typeof(this.is_open_sms)=="undefined" ){
            var self = this;
            $.post( this.api.checkOpen, {}, function(data){
                try{
                    self.is_open_sms = JSON.parse(data).is_open_sms==1 ? true : false;
                }catch(e){
                    console.warn('api接口JSON格式数据错误，关闭验证码功能');
                    self.is_open_sms = false;
                }
                self.is_open_sms==true && self._render();
            });
        }else{
            this.is_open_sms==true && this._render();
        }
    }
    function _render(){
        var self = this;
        var lang = window.SMSlang;
        var html = '<div class="verify-popup"></div> <div class="verify-code" style="display: none;"> <div class="backdrop"></div> <div class="content"> <div class="title"> <div class="close">&times;</div> <div class="text">|title|</div> </div> <div class="message"> <div class="text"> <div class="resend">|sendto|<div class="mobile-content"></div>|take||if_no||click|<a href="javascript:void(0);" class="resendCode">|resend|</a> </div> <div class="wait">|sendto|<div class="mobile-content"></div>|take||if_no|<div class="time-content"></div>|wait|</div> </div> </div> <div class="number"> <input data-index="1" readonly> <input data-index="2" readonly> <input data-index="3" readonly> <input data-index="4" readonly data-last="true"> <input class="actual-input" maxlength="4" type="text" style="z-index: -100; opacity: 0;"> </div> </div> </div> </div>'
        for( key in lang[region_code] ){
            html = html.replace("|"+key+"|", lang[region_code][key] );
            html = html.replace("|"+key+"|", lang[region_code][key] );
        }
        $('body').append(html);
        // 
        $(".verify-code .close").click(this.vcodeClose);
        $(".verify-code .resendCode").click(this.sendCode);
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
    function start(formdata){
        if(typeof(ajaxLocked) != "undefined" && ajaxLocked == true ){
            return false;
        }else{
            this.sendOrder();
        }
    }
    function vcodeShow(){
        $(".verify-code").show();
        var x = $("[name='mob']").val();
            x = x.slice(0, 2) + "****" + x.slice(6);
        $(".verify-code .mobile-content").text(x);
        $(".actual-input").val('').focus();
    }
    function vcodeClose(){
        $(".verify-code").css('display', 'none');
        $(".verify-code input[data-index]").each(function(i, e){
            e.value = "";
        });
    }
    function sendCode(ret){
        var self = window.widget.smsvalid;
        if( self.sendLock ){ return false; }
        self.sendLock = true;
        var _api = self.api.send;
        if( typeof(ret)=="undefined" ){
            ret = self.orderResponse;
            _api = self.api.resend;
        }
        var mobile = $("[name='mob']").val();
        $(".verify-code").addClass("verifying");
        $.ajax({
            url: _api,
            type: 'post',
            dataType: 'json',
            data:{
                do: "send"
                , mobile: mobile
                , "orderId": ret.orderId
                , "token":ret.token
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
    function sendOrder(){
        var self = window.widget.smsvalid;
        var formdata = $('#form').serialize();
        var _product_id = $('[name="product_id"]').val();
        $.ajax({
            url: self.api.sendO,
            type: 'post',
            dataType: 'json',
            data: formdata,
            success: function(ret){
                if( ret.ret_code==200 ){
                    // 显示短信框
                    self.vcodeShow();
                    //
                    console.warn('facebook mark after 200');
                    fbq('track', 'Purchase', {value: '30', currency:'USD'});
                    var _orderId = ret.orderId;
                    var _mobile = $("[name='mob']").val();
                    var _website = ret.website;
                    // 监控fb
                    $.post('/api_facebook.php', {
                        'orderId': _orderId
                        , 'website': _mobile
                        , 'mobile': _website
                    }, function(res) {
                        console.log(res);
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
    function verifyPopup(text){
        $(".verify-popup").text(text).addClass("animation");
        $(".verify-popup.animation").css({'opacity':'1','z-index':'1001'})
        setTimeout(function(){
            $(".verify-popup.animation").css({'opacity':'0','z-index':'-1000'})
        }, 5000);
    }
    function performVerify(vcode){
        var self = this;
        var mobile = $("[name='mob']").val();
        var code = vcode ? vcode : $(".actual-input").val();
        var orderId = $("form [name=orderId]").val();
        $.ajax({
            url: self.api.verify
            , type: 'post'
            , data:{"mobile": mobile,"vercode":code,"orderId":orderId,"token":self.sms_token}
            , dataType: 'json'
            , success: function(response){
                var ret = response;
                if(ret.ret_code == 200){
                    self.verifyPopup(ret.ret_msg);
                    window.location = "/api_order.php?orderId=" + orderId;
                }else{
                    self.verifyPopup(ret.ret_msg);
                }
            }
        });
    }
    return {
        init: init
    }
}