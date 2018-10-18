let Vue = window.Vue;
let axios = window.axios;

Vue.prototype.$http = axios;

import sms from '../components/sms.vue';


let App = new Vue({
	el: '#app'
    , delimiters: ['${', '}']
	, data() {
		return {
			order: window.__GLOBAL__.orderId
			, product: window.__GLOBAL__.product_id
			, token: window.__GLOBAL__.token
			, mobile: window.__GLOBAL__.mobile
		}
	}
	, components: {
        sms
    }
});
