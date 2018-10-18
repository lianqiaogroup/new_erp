<template>
<section>
    <div class="table">
        <div class="flexbox">
            <div class="flex regions">${ region.title }</div>
        </div>
        <div class="table-row">
            <input type="text" ref="address" v-model="form.address" :placeholder="lang.addr">
        </div>
        <div class="flexbox">
            <div class="flex tab_two">
                <input type="text" ref="name" v-model="form.name" :placeholder="lang.name">
            </div>
            <div class="flex tab_two">
                <input type="tel" ref="postal" v-model="form.postal" :placeholder="lang.postal">
            </div>
        </div> 
        <div class="flexbox">
            <div class="flex tab_two">
                <input type="tel" ref="mobile" v-model="form.mobile" :placeholder="lang.phone">
            </div>
            <div class="flex tab_two">
                <input type="email" ref="email" v-model="form.email" :placeholder="lang.email">
            </div>
        </div>
        <div class="table-row">
            <input type="text" ref="note" v-model="form.note" :placeholder="lang.note">
        </div>
        <div class="flexbox">
            <div class="flex tab_two tab_sele action" rel="0">
                <i class="icon"></i>${ lang.cash_on_delivery }
            </div>
        </div>
    </div>
</section>
</template>
<script>
export default {
    delimiters: ['${', '}']
    , data() {
        return {
            form: {
                address: ''
                , name: ''
                , postal: ''
                , mobile: ''
                , email: ''
                , guest: ''
            }
            , lang: window.lang
            , region: {
                id: window.region.id
                , code: window.region.code
                , title: window.region.title
            }
        }
    }
    , mounted() {
        this.$emit('render', false);
    }
    , methods: {
        check(){
            if(this.form.address === ''){
                alert(this.lang.addr);
                this.$refs.address.focus();
                return false;
            };
            if(this.form.name === ''){
                alert('姓名不能为空！');
                this.$refs.name.focus();
                return false;
            };

            if(this.form.mobile === ''){
                alert('手机号码不能为空！');
                this.$refs.mobile.focus();
                return false;
            };

            return {
                mobile: this.form.mobile,
                address: this.form.address,
                name: this.form.name,
                postal: this.form.postal,
                guest: this.form.guest,
                email: this.form.email
            }
        }
    }
}
</script>