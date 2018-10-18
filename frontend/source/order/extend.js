var EventHub = {};
EventHub.install = function(Vue, options){
	let globalLoading = null;
	Vue.prototype.$loading = value => {
		if( typeof(value)==undefined ){
			return globalLoading ? true : false;
		}else{
			if( value ){
				// 1、创建构造器
				let loadingTpl = Vue.extend({
					template: '<div class="ajaxLoading"></div>'
				});
				// 2、创建实例，挂载到文档以后的地方
				globalLoading = new loadingTpl().$mount().$el;
				// 3、把创建的实例添加到body中
				document.getElementById('app').appendChild(globalLoading);
			}else{
				// 4、移除
				if( globalLoading ){
					document.getElementById('app').removeChild(globalLoading);
					globalLoading = null;
				}
			}
		}
	}
}
module.exports = EventHub;