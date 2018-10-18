import vresource from 'vue-resource';
import EventHub from './extend.js';

// 重复下单显示层
import reorder from './global/reorder.vue';

// 短信模块
import sms from './global/sms.vue';

const region_basic = resolve => require(['./region/basic.vue'], resolve);
const region_malaysia = resolve => require(['./region/mys.vue'], resolve);
const region_indonesia = resolve => require(['./region/idr.vue'], resolve);
const region_india = resolve => require(['./region/ind.vue'], resolve);
const region_qatar = resolve => require(['./region/qat.vue'], resolve);
const region_oman = resolve => require(['./region/omn.vue'], resolve);
const region_philippines = resolve => require(['./region/phl.vue'], resolve);
const region_myanmar = resolve => require(['./region/mmr.vue'], resolve);

let pages = {
    basic: region_basic
    , MYS: region_malaysia
    , Rp: region_indonesia
    , IND: region_india
    , QAT: region_qatar
    , OMN: region_oman
    , PHL: region_philippines
    , MMR: region_myanmar
}

Vue.use(EventHub);
Vue.use(vresource);

let vue = new Vue({
    el: '#app'
    , delimiters: ['${', '}']
    , data: {
        api: {
            order: '/api_sms_send.php?do=order'
        }
        // 各地区组件
        , page: null
        , isShowCombo: false
        // 订单信息
        , order: window.orderInfo
        // 存储表单信息
        , formdata: {}
        , rendering: true
        , dialog: {
            reorder: false
            , sms: false
        }
    }
    , computed: {
        total_currency() {
            
        }
    }
    , components: {
        reorder, sms
    }
    // 获取url数据
    , created(){
        let self = this;
        window.location.search.replace('?','').split("&").map(row=>{
            let key = row.split('=')[0];
            let val = row.split('=')[1];
            self.order[key] = val;
        });
    }
    , mounted(){
        // 加载对应地区的组件
       
        this.page = pages[window.region.code] || pages['basic'];
    }
    , methods: {
        // 地区组件渲染完毕
        afterRender(e) {
            this.rendering = e;
        }
        // (显示/关闭)套餐
        , showCombo(){
            this.isShowCombo = !this.isShowCombo;
        }
        /*
        提交订单流程
        -- 检查表单是否完整
        -- 检查是否重复下单
        -- 检查是否开启短信验证码
        -- 下单成功
        */ 
        , handleSubmit(formdata){

            // 阻止多次点击
            if( this.$loading() == true ){ return false };

            // 1. 开启遮罩层
            this.$loading(true);

            // 2. 验证表单
            let formvalid = this.$refs.formlayer.check();
            if( formvalid==false ){ this.$loading(false); return false; }
            this.formdata = formvalid;

            // 3. 是否重复下单
            let reorderData = {
                mobile: this.formdata.mobile
                , product_id: this.order.product_id
                , combo_id: this.order.combo_id
                , count: this.order.count
                , proto: this.order.proto
            }
            if( this.$refs.reorder.check(reorderData)==false ){ return false };

            // 4. 短信验证码
            if( this.order.is_sms_open==1 ){
                this.dialog.sms = true;
                return false;
            }

            // 4. 开始推送订单
            this.submiting();
        }
        // 推送订单
        , submiting(callback){
            let data = {

            }
            this.$http.post(this.api.order, {

            }).then(res=>{

                let testdata = {
                    ret_code: 200
                    , fbpixel: []
                    , ga: []
                    , orderId: '1234'
                    , pay_method: '货到付款'
                    , ret_msg: 'successed'
                    , token: 'c3b4a393772a7d0b158998ebd4b36058'
                    , total: 10000
                    , website: 'www.dzpas.com/vbb'
                }
                this.order.orderId = testdata.orderId;
                callback && callback(testdata);
            });
        }
        // 
        , gotoCheckOrder() {
            window.location.href = `/order_quality.php?mob=${this.formdata.mobile}&product_id=${this.order.product_id}`;
        }
        // 货币格式化
        , formatCurrency(val) {
            let code = this.order.currency_code;
            let prefix = this.order.currency_prefix==1 ? true : false;
            let strArr = [val];
            prefix==true ? strArr.unshift(code) : strArr.push(code);
            return strArr.join(' ');
        }
    }
}); 