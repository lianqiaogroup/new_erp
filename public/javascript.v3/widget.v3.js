var widget = {
    // 金额格式化
    fmoney:function(s, n){
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
            sendO:"/api_sms_send.php?do=order"
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
            var theme = $('#theme').val();
            if (typeof(theme) != "undefined" && theme == "style83") {
                window.smsAuth = false;
            }
            window.smsAuth===true && this.render();
        }
        // 添加html节点
        , render: function(){
            var self = this;
            var lang = window.smsLang;

            var html = '<div class="verify-popup"></div> <div class="verify-code" style="display: none;"> <div class="backdrop"></div> <div class="content"> <div class="title"> <div class="close">&times;</div> <div class="text">|title|</div> </div> <div class="message"> <div class="text"> <div class="resend">|sendto|<div class="mobile-content"></div>|take||if_no||click|<a href="javascript:void(0);" class="resendCode">|resend|</a> </div> <div class="wait">|sendto|<div class="mobile-content"></div>|take||if_no||wait_before|<div class="time-content"></div>|wait|</div> </div> </div> <div class="number"> <input data-index="1" readonly> <input data-index="2" readonly> <input data-index="3" readonly> <input data-index="4" readonly data-last="true"> <input class="actual-input" maxlength="4" type="text" style="z-index: -100; opacity: 0;"> </div> </div> </div> </div>'
            for( key in lang ){
                html = html.replace("|"+key+"|", lang[key] );
                html = html.replace("|"+key+"|", lang[key] );
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
                data:{
                    do: "send"
                        , "mobile": mobile
                    , "orderId": ret.orderId
                    , "token":ret.token
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
            var _product_id = $('[name="product_id"]').val();
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
        , verifyPopup: function(text) {
            $(".verify-popup").text(text).addClass("animation");
            $(".verify-popup.animation").css({'opacity':'1','z-index':'1001'})
            setTimeout(function(){
                $(".verify-popup.animation").css({'opacity':'0','z-index':'-1000'})
            }, 5000);
        }
        , performVerify: function(vcode) {
            var self = this;
            var mobile = $("[name='mob']").val();
            var code = vcode ? vcode : $(".actual-input").val();
            var orderId = $("form [name=orderId]").val();
            var product_id = $('[name="product_id"]').val();
            $.ajax({
                url: self.api.verify
                , type: 'post'
                , data:{
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
            //泰国邮编地区
            try{
                if(ajaxLocked == true){
                    return false;
                }
            }catch(ex){

            }
          
                // 异步锁
                if (prepostLock==true) return false;

                prepostLock = true;
            // 验证表单字段
            var region_code = $('#region_code').val() || '';
            var theme = $('#theme').val() || '';
            var noaddress = $("#noaddress").val();
            if ((theme == "style57" || theme == "style87" || theme == "style73" || theme == "style27_2" || theme == "style88" || theme == "style85" || theme == "style85_1") && $('[name="address"]').val() == "") {
                $('[name="address"]').val("**" + noaddress);
            }    
            // 实例
            // if(theme == 'style85_3'){
            //     var area = $('[name="street"]').val();
            //     var address = $('[name="address"]').val();
            //     if (area && address) {
            //         $('[name="address"]').val(area + ' ' + address);
            //     }
            // };

            
            var validForm = new ValidForm(region_code, theme);
            if (validForm.check()==false) {
                this.postintdata('hide');
                    // 开异步锁
                    prepostLock = false;
                    // 跳出
                return false;
            }else{
                
            }
                
            // 验证payment & credit card
            try {
                if( !this.checkCreditCard() ){
                    this.postintdata('hide');
                        // 开异步锁
                        prepostLock = false;
                        // 跳出
                    return false;
                }
            } catch(e) {
                console.error(e);
            }

            
            //验证fb登录
            if(this.getCookie('need_login') == 1){
                if(!$('.fLogin a').attr('href')){
                //获取faceBook登录URL
                    $.get('/login.php',{referer:encodeURI(document.URL)},function(res){
                        $('.fLogin a').prop('href',res.data.fb_login_url)
                    })
                }
                if($('.fLogin').length != 0){
                    $('.fLogin').show();
                        this.postintdata('hide');
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
                        this.postintdata('hide');
                        // 跳出
                        return false;
                    }
                }
            }catch(ex){

            }
            
            if (region_code == 'MYS') {
                var area = $('[name="street"]').val();
                var address = $('[name="address"]').val();
                if (area && address && address.indexOf(area)== -1) {
                    $('[name="address"]').val(area + ' ' + address);
                };
            }
            try{
                // 验证sms valid
                if( window.smsAuth == true ){
                        // 关闭加载涂层
                        this.postintdata('hide');
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
                this.postintdata('hide');

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
            var cssrepeat = '<style>.dis-none{display:none;}.layer_repeat{display:none;position: fixed;width: 100%;height: 100%;overflow: hidden;background: rgba(0, 0, 0, 0.65);top: 0;left:0; z-index:2;}.r_btn .ccc{color:#666;}.repeat{border-radius:6px;display:none;width: 86%;position: fixed;top: 50%;left: 50%;background: #fff;color: #222;z-index:3;transform: translateX(-50%) translateY(-50%);}.tips_text{border-bottom:1px solid #E5E5E5;padding:8%;font-size: 15px;}.r_order{border-right:1px solid #E5E5E5;}.r_title{color:#333;padding-top:4%;font-size: 18px;text-align: center;}.r_btn{display: flex;display: -webkit-flex;}.r_order,.r_inquiry{flex: 1;-webkit-flex:1;text-align: center;color:#5E9BF2;font-size: 18px;padding:10px 0;cursor: pointer;}@media screen and (min-width: 640px){.repeat{width:30%;}}.repeatshow .layer_repeat,.repeatshow .repeat{display:block;}</style>';
            var htmlrepeat = '<div class="layer_repeat"></div><div class="repeat"><div class="r_title">' + repeatlang.title + '</div><div id="prompt" class="tips_text">' + repeatlang.prompt + '</div><div class="r_btn"><div class="r_order" onclick="btnorder()">' + repeatlang.confirm_order + '</div><div class="r_inquiry">' + repeatlang.query_details + '</div></div></div>';
            // var cssrepeat = '<style>.layer_repeat{display:none;position: fixed;width: 100%;height: 100%;overflow: hidden;background: rgba(0, 0, 0, 0.65);top: 0;left:0; z-index:2;}.repeat{display:none;width: 86%;position: fixed;top: 50%;left: 50%;padding: 4%;background: #fff;color: #222;z-index:3;transform: translateX(-50%) translateY(-50%);}.tips_text{font-size: 14px;}.r_title{font-size: 14px;text-align: center;}.r_btn{display: flex;display: -webkit-flex;}.r_order,.r_inquiry{flex: 1;-webkit-flex:1;text-align: center;color:#ff5a5f;font-size: 14px;padding:10px 0;cursor: pointer;}@media screen and (min-width: 640px){.repeat{width:30%;}}.repeatshow .layer_repeat,.repeatshow .repeat{display:block;}</style>';
            // var htmlrepeat = '<div class="layer_repeat"></div><div class="repeat"><div class="r_title">'+ repeatlang.title +'</div><div id="prompt" class="tips_text">'+ repeatlang.prompt +'</div><div class="r_btn"><div class="r_order" onclick="btnorder()">'+repeatlang.confirm_order+'</div><div class="r_inquiry">'+repeatlang.query_details+'</div></div></div>';
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
                    //var datastring = JSON.stringify(response);
                    var datas = JSON.parse(response);
                    if(datas.ret == 0){
                        window.repeat_order = false;
                    } else if (datas.ret == 1) {
                        var text = $('#prompt').html();
                        text = text.replace(/\{protitle\}/g, datas.name);
                        var time = parseInt(datas.interval_time);//秒
                        d = parseInt(time / 3600 / 24);
                        h = parseInt(time / 3600);
                        m = parseInt(time / 60);
                        s = parseInt(datas.interval_time);
                        var btnHtml = $(".r_btn").html();
                        if (m >= 0 && m <= 5) {
                            btnHtml = btnHtml.replace(/r_order/g, 'r_order dis-none');
                            $(".r_btn").html(btnHtml);
                            var total = 5;
                            var str = repeatlang.query_details;
                            $(".r_inquiry").html(str + '(' + total + 's)');
                            var clock = setInterval(function () {
                                total--;
                                $(".r_inquiry").html(str + '(' + total + 's)');
                                if (total == 0) {
                                    clearInterval(clock);
                                    $(".r_inquiry").trigger("click");
                                };
                            }, 1000);
                        } else {
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
                    if (area && address && address.indexOf(area)== -1) {
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

widget.postintdata(1);
    window.prepostLock = false;
window.widget = widget;
window.prepost = widget.prepost;


$(function(){
    // 立即购买
    $(document).on('click', '[data-cuckootag="buy_now"]', function(event) {
        var eventName = $(this).attr('data-event') || '';
        var callback = typeof(window[eventName])=="function" ? window[eventName] : new Function();
        if( typeof(ga_btn_event)!="undefined" ){
            ga_btn_event && ga_btn_event('buy_now', callback);
        }else{
            callback();
        }
    })
    .on('click', '[data-cuckootag="confirm_arrtibute"]', function(event) {
        // 确认属性
        event.preventDefault();
        var eventName = $(this).attr('data-event') || '';
        var callback = typeof(window[eventName])=="function" ? window[eventName] : new Function();
        if( typeof(ga_btn_event)!="undefined" ){
            ga_btn_event('confirm', callback);
        }else{
            callback();
        }
    })
    .on('click', '[data-cuckootag="confirm_order"]', function(event) {
        // 确认订单
        if( $(this).attr('href')!='' && $(this).attr('href')!=undefined ){
            var scrollTag = $(this).attr('href');
            if( parseInt(window.scrollY)+parseInt($(window).height())==$(document).height() ){
            }else{
                if( parseInt(window.scrollY) < parseInt($(scrollTag).offset().top) ){
                    $(window).scrollTop(parseInt($(scrollTag).offset().top))
                    return false;
                }
            }
        }
        if( typeof(ga_btn_event)!="undefined" ){
            if( ga_btn_event_locked==false ){
                ga_btn_event_locked=true;
                ga_btn_event && ga_btn_event('order', function(){
                    $('#form').find('[type="submit"]').trigger('click');
                    ga_btn_event_locked=false;
                });
                return false;
            }else{
                ga_btn_event_locked = false;
                return true;
            }
        }
    })
    .on('click', '[data-cuckootag="check_order"]', function(event) {
        // 查询订单
        event.preventDefault();
        var eventName = $(this).attr('data-event') || '';
        var eventValue = $(this).attr('data-value') || '';
        var callback = typeof(window[eventName])=="function" ? window[eventName] : window.widget.goto_checkOrder;
        if( typeof(ga_btn_event)!="undefined" ){
            ga_btn_event('order_search', function(){
                callback({ identity_tag: eventValue })
            });
        }else{
            callback({ identity_tag: eventValue });
        }
    })
    .on('click', '[data-cuckootag="service"]', function(event) {
        // 客服
        event.preventDefault();
        var service_id = $(this).attr('data-value') || '';
        if( service_id=='' ) return;
        if( typeof(ga_btn_event)!="undefined" ){
            ga_btn_event('online_cs', function(){
                widget.handleActiceService(service_id)
            });
        }else{
            widget.handleActiceService(service_id);
        }
    });
});