<template>
	<setion class="sms-layer" v-if="isShow">
		<div :class="{'verify-popup': true, 'animation': lang.popuo!='' }">${ lang.popuo }</div>
		<div class="sms-boxer">
			<div class="sms-head">
				<div class="text">${ lang.title }</div>
			</div>
			<div class="sms-body">
				<div class="text">
					${ lang.bodyText }
					<template v-if="canResend">
						<a href="javascript:void(0);" class="resendCode" @click="handleResend">${ lang.resend }</a>
					</template>
					<template v-if="sending">${ lang.sending }</template>
				</div>
			</div>
			<div class="sms-footer">
				<input readonly v-model="vcode1" @focus="handleFocus" :class="{ 'active': vcode.length==(1-1) }">
				<input readonly v-model="vcode2" @focus="handleFocus" :class="{ 'active': vcode.length==(2-1) }">
				<input readonly v-model="vcode3" @focus="handleFocus" :class="{ 'active': vcode.length==(3-1) }">
				<input readonly v-model="vcode4" @focus="handleFocus" :class="{ 'active': vcode.length==(4-1) }">
				<input
					ref="input"
					v-model="vcode"
					@keyup="handleKeydown"
					class="actual-input"
					maxlength="4"
					type="tel">
			</div>
		</div>
		<hr>
		<div class="button-layer">
			<button class="submit" @click="handleVerify">
				<template v-if="sending">
					${ lang.sending }
				</template>
				<template v-else>
					<template v-if="verlifing==false">${ lang.submit }</template>
					<template v-if="verlifing==true">${ lang.submiting }</template>
				</template>
			</button>
		</div>
		<p class="link"><a href="javascript:;" @click="unVerlify">${ lang.error }</a></p>
	</setion>
</template>

<script>
var qs = require('qs');

export default {
	delimiters: ['${', '}']
	, props: [
		'order'
		, 'product'
		, 'mobile'
		, 'token'
	]
	, data() {
		return {
			api: {
				send: '/api_sms_send.php?do='
				, verlify: '/api_sms_send.php?do=verify' 
			}
			// 是否显示弹窗(订单推送成功才显示)
			, isShow: true
			// 能否重新发送
			, canResend: false
			// 发送中
			, sending: false
			// 时间(秒)
			, timeset: 120
			, timeout: null
			// 语言包
			, lang: {
				title: window.smsLang.title
				, message: window.smsLang.message
				, message2: window.smsLang.message2
				, resend: window.smsLang.resend
				, submit: window.smsLang.submit
				, submiting: window.smsLang.submiting
				, error: window.smsLang.error
				, sending: window.smsLang.sending
				, popuo: ''
				, bodyText: ''
			}
			, vcode: ''
			, verlifing: false
		}
	}
	, computed: {
		vcode1(){
			return this.vcode[0] || '';
		}
		, vcode2(){
			return this.vcode[1] || '';
		}
		, vcode3(){
			return this.vcode[2] || '';
		}
		, vcode4(){
			return this.vcode[3] || '';
		}
	}
	, created() {

	}
	, mounted() {
		this.start('send');
	}
	, methods: {
		start(sendType){
			// 区分第一次发送和重发
			let sendtype = sendType ? sendType : 'send';
			let self = this;
			// 初始化状态
			self.timeset = 120; // 倒计时秒数
			self.timeout = null; // 定时器ID
			self.sending = true; // 发送中状态
			self.isShow = true; // 弹窗显示
			self.canResend = false; // 是否可以重新发送
			self.lang.bodyText = ''; // 组件主内容
			self.lang.popuo = ''; // 消息提示内容

			// 对接后台
			self.$http
			.post(
				`${this.api.send}${sendtype}`
				, qs.stringify({
					do: 'send'
					, mobile: this.mobile
					, orderId: this.order
					, token: this.token
					, product_id: this.product
				})
				, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
				    }
				})
			.then(res => {
				// 消息提示
				self.sending = false;
				self.$refs.input.focus();
				// 回调
				const ret_code = res.data.ret_code;

				if (ret_code==200 || ret_code==403) {
					switch(ret_code) {
						case 200:
							// 200 才提示文案
							self.timeset = 120;
							self.lang.popuo = res.data.ret_msg;
							break;
						case 403:
							// 后台返回时间
							self.timeset = res.data.time;
							break;
						default:
							break;
					}
					// 更新文案
					self.lang.bodyText = self.lang.message.replace('{phone}', self.decode(self.mobile)).replace('{second}', self.timeset);
					// 开始倒计时
					self.timeout = setInterval(function(){
						if( self.timeset<=0 ){
							self.canResend = true;
							self.lang.bodyText = self.lang.message2.replace('{phone}', self.decode(self.mobile));
							clearInterval(self.timeout);
						}else{
							self.timeset = parseInt(self.timeset)-1;
							self.lang.bodyText = self.lang.message.replace('{phone}', self.decode(self.mobile)).replace('{second}', self.timeset);
						}
					}, 1000);
				}else{
					self.lang.popuo = res.data.ret_msg;
					self.lang.bodyText = res.data.ret_msg;
					self.canResend = true;
				}
			});
		}
		, moduleShow(){
			this.isShow = true;
		}
		// 重新发送
		, handleResend(){
			this.start('resend');
		}
		// 输入框获得焦点
		, handleFocus(){
			this.$refs.input.focus();
		}
		// 输入框事件
		, handleKeydown(e) {

		}
		// 验证是否正确
		, handleVerify(){
			if (this.sending==true) return false;
			if (this.vcode.length!=4) return this.handleFocus();
			if (this.verlifing==true) return false;
			// ajax锁
			this.verlifing = true;
			// 清除提示文字
			this.lang.popuo = '';
			// 请求
			this.$http.post(this.api.verlify, qs.stringify({
				orderId: this.order
				, mobile: this.mobile
				, vercode: this.vcode
				, token: this.token
				, product_id: this.product
			})).then(res=>{
				// 关闭锁
				this.verlifing = false;
				// 
				if (res.data.ret_code==200) {
					window.location = "/api_order.php?orderId=" + this.order;
				}else{
					this.vcode = '';
					this.lang.popuo = res.data.ret_msg;
					this.handleFocus();
				}
			});
		}
		// 没有验证
		, unVerlify() {
			window.location = "/api_order.php?orderId=" + this.order + "&verify=1";
		}
		// 电话加密
		, decode(mobile) {
			let arr = mobile.split('');
				arr[2] = arr[3] = arr[4] = arr[5] = '*';
			return arr.join('');
		}
	}
	, watch: {
		vcode() {
			let arr = this.vcode.split('').filter(x=>{
				return !isNaN(x);
			});
			this.vcode = arr.join('');
			this.vcode = this.vcode.replace(' ','');
			if( this.vcode.length == 4 ){
				this.vcode = this.vcode.substring(0,4);
				return false;
			}
		}
	}
}
</script>

<style lang="less">

.sms-layer {
	display: block;
	width: 100%;
	height: 100%;
	max-width: 375px;
	z-index: 1;
	margin: 0 auto;
	padding-top: 64px;
	.sms-boxer {
		display: block;
		position: relative;
	}
	hr {
		border: none;
		margin: 16px 20px;
		height: 1px;
		background-color: #eee;
	}
	.button-layer {
		display: block;
		margin: 0 16px;
		button {
			width: 100%;
			display: block;
			height: 44px;
			color: #fff;
			line-height: 44px;
			border-radius: 2px;
			background-color: #FC515F;
			border: none;
			font-size: 14px;
			outline: none;
			&:active {
				background-color: lighten(#FC515F, 10%);
			}
		}
	}
	p.link {
		margin-top: 16px;
		text-align: center;
		height: 20px;
		line-height: 20px;
		a {
			color: #666;
			font-size: 14px;
			text-decoration: underline;
		}
	}
}
.sms-head {
	position: relative;
	display: block;
	width: 100%;
	margin-left: 16px;
	margin-bottom: 10px;
	.text {
		font-size: 24px;
		color: #222;
		line-height: 33px;
	}
}
.sms-body {
	position: relative;
	width: 100%;
	.text {
		word-break: break-all;
		margin-top: 20px;
		margin-left: 16px;
		margin-right: 16px;
		margin-bottom: 0;
		display: block;
		font-size: 14px;
		color: #666
	}
	a.resendCode {
		color: #0080FF
	}
}

.sms-footer {
	position: relative;
	padding: 0 16px;
	margin-top: 32px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	max-height: 160px;
	font-size: 0px;
	input {
		position: relative;
		width: 56px;
		height: 56px;
		max-width: 100px;
		max-height: 100px;
		font-size: 24px;
		margin-right: 10px;
		padding: 5px;
		font-size: 20px;
		color: #222;
		line-height: 32px;
		text-align: center !important;
		background: #f6f6f6;
		border: 1px solid #E1E1E1;
		border-radius: 2px;
		z-index: 2;
		box-sizing: border-box;
		&:nth-child(4) {
			margin-right: 0;
		}
		&.active {
			border-color: #333;
		}
	}
	.actual-input {
		position: absolute;
		display: block;
		top: 20px;
		bottom: 20px;
		left: 0;
		right: 0;
		width: 100%;
		height: auto;
		max-width: none;
		max-height: none;
		font-size: 1px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		padding: 0;
		z-index: -100;
		opacity: 0;
	}
}



.verify-popup {
	background: #000;
	border-radius: 4px;
	font-size: 16px;
	color: #FFF;
	width: 240px;
	height: 62px;
	line-height: 62px;
	position: fixed;
	display: block;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	opacity: 0;
	text-align: center;
	z-index: -1000;
	&.animation {
		animation: verifypopup 5s;
		-webkit-animation:verifypopup 5s;
		-moz-animation:verifypopup 5s;
		-o-animation:verifypopup 5s;
	}
}
@keyframes verifypopup {
	0% {
		opacity: .8;
		z-index: 10000
	}
	90% {
		opacity: .8;
		z-index: 10000
	}
	100% {
		opacity: 0;
		z-index: -1000
	}
}
@-webkit-keyframes verifypopup {
	0% {
		opacity: .8;
		z-index: 10000
	}
	90% {
		opacity: .8;
		z-index: 10000
	}
	100% {
		opacity: 0;
		z-index: -1000
	}
}
@-moz-keyframes verifypopup {
	0% {
		opacity: .8;
		z-index: 10000
	}
	90% {
		opacity: .8;
		z-index: 10000
	}
	100% {
		opacity: 0;
		z-index: -1000
	}
}
@-o-keyframes verifypopup {
	0% {
		opacity: .8;
		z-index: 10000
	}
	90% {
		opacity: .8;
		z-index: 10000
	}
	100% {
		opacity: 0;
		z-index: -1000
	}
}
</style>