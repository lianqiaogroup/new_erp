var vuelib = {
	install: function(Vue, optinos){
		// 序列化
		Vue.prototype.serialize = function(args){
			return Object.getOwnPropertyNames(args).map(function(k){
				return k + "=" + args[k];
			}).join('&');
		}
	}
}


