<template>
	<setion class="reorder-layer" v-if="isShow">
		<div class="reorder-boxer">
			<div class="reorder-header">${ lang.reorder_title }</div>
			<div class="reorder-body">${ content }</div>
			<div class="reorder-footer">
				<div @click="handleClickBtn1">${ lang.reorder_btn1 }</div>
				<div @click="handleClickBtn2">${ lang.reorder_btn2 }</div>
			</div>
		</div>
	</setion>
</template>

<script>
export default {
	delimiters: ['${', '}']
	, props: [ 'order', 'formdata', 'confirm', 'cancel' ]
	, data() {
		return {
			isShow: false
			, checked: false
			, lang: window.lang
			, api: '/api_sms.php?do=is_same_buy'
			, product_title: '产品名字'
			// 距离上次下单的时间（单位：秒）
			, interval_time: 0
			, unit: '单位'
			,product_attr:''
		}
	}
	, computed: {
		content(){
			let timeStr = '';
			let unitStr = '';
			if( this.interval_time<60 ){
				timeStr = '';
				unitStr = this.lang.reorder_before_now;
			}else if( this.interval_time>=60 && this.interval_time<3600 ){
				timeStr = parseInt(this.interval_time/3600);
				unitStr = this.lang.reorder_before_minute;
			}else if( this.interval_time>=3600 && this.interval_time<86400 ){
				timeStr = parseInt(this.interval_time/3600);
				unitStr = this.lang.reorder_before_hour;
			}else if( this.interval_time>=86400 && this.interval_time<259200){
				timeStr = parseInt(this.interval_time/3600/24);
				unitStr = this.lang.reorder_before_day;
			}
			return this.lang.reorder_content.replace('{product_title}', this.product_title).replace('{time}', timeStr).replace('{unit}', unitStr);
		}
	}
	, created() {

	}
	, mounted() {
		
	}
	, methods: {
		// 显示窗口
		show(tof) {
			// 弹窗控制
			this.isShow = tof;
			// 外层遮罩层控制
			this.$loading(false);
		}
		/*
		检查是否有重复订单
			data {
				mobile: 电话
				product_id: 产品ID
				combo_id: 套餐ID
				count: 数量
				proto: 属性组合
			}
		*/
		, check(data){
			// 避免重复验证
			if( this.checked==true ){ return true; }
			this.checked = true;

			// 发起ajax请求
			this.$http.post(this.api, {
				mobile: data.mobile
				, combo_id: data.combo_id
				, product_id: data.product_id
				, count: data.count
				, proto: data.proto
			}).then(res=>{
				let ress = { body: {
					ret: 1
					, name: 'goods'
					, interval_time: 8760
				} };
				if( ress.body.ret==1 ){
					this.interval_time = ress.body.interval_time;
					this.product_title = ress.body.name;
					// 超过三天重新下单
					if( this.interval_time >= 259200 ){
						// 关闭弹窗
						this.show(false);
						// 执行父组件提交事件
						this.$emit('confirm');
					}else{
						this.show(true);
					}
				}else{
					alert(res.body.msg);
					this.checked = false;
					this.$loading(false);
				}
			});
			return false;
		}

		// 确认下单
		, handleClickBtn1(){
			// 关闭弹窗
			this.show(false);
			// 执行父组件提交事件
			this.$emit('confirm');
		}

		// 取消订单
		, handleClickBtn2(){
			this.$emit('cancel');
		}
	}
}
</script>

<style lang="less" scoped>
	.reorder-layer {
		position: fixed;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.65);
		top: 0;
		left:0;
		z-index:2;
	}
	.reorder-boxer {
		width: 86%;
		position: fixed;
		top: 50%;
		left: 50%;
		padding: 4%;
		background: #fff;
		color: #222;
		z-index:3;
		transform: translateX(-50%) translateY(-50%);
	}
	@media screen and (min-width: 640px){
		.reorder-boxer {
			width:30%;
		}
	}
	.reorder-header {
		font-size: 14px;
		text-align: center;
	}
	.reorder-body {
		font-size: 14px;
	}
	.reorder-footer {
		display: flex;
		display: -webkit-flex;
		> div {
			flex: 1;
			-webkit-flex:1;
			text-align: center;
			color:#ff5a5f;
			font-size: 14px;
			padding:10px 0;
			cursor: pointer;
		}
	}

</style>