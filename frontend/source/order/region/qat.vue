<template>
    <section>
        <div class="table">
            <div class="flexbox">
                <div class="flex regions">${ region.name }</div>
            </div>
            <div class="flexbox">
                <div class="flex tab_two">
                    <select @change="getCity($event)" ref="city" v-model="form.city" name="state" :placeholder="lang.city" required="required">
                        <option value="">${lang.city}</option>
                        <option :value="item.id_region" v-for="item in areaList.province">${item.name}</option>
                    </select>
                </div>
            </div>
            <div class="flexbox">
                <div class="flex tab_two">
                    <select ref="district" v-model="form.district" name="city" :placeholder="lang.district" required="required">
                        <option value="">${lang.district}</option>
                        <option :value="item.id_region" v-for="item in areaList.city">${item.name}</option>
                    </select>
                </div>
            </div>
            <div class="table-row">
                <input type="text" required="required" ref="address" v-model="form.address" name="address" :placeholder="lang.address_">
            </div>
            <div class="flexbox">
                <div class="flex tab_two">
                    <input type="text" required="required" ref="name" v-model="form.name" name="name" :placeholder="lang.name">
                </div>
                <div class="flex tab_two">
                    <input required="required" type="tel" ref="postal" v-model="form.postal" name="postal" :placeholder="lang.postal" maxlength="5" pattern="[0-9]{5}">
                </div>
            </div>
            <div class="flexbox">
                <div class="flex tab_two">
                    <input type="tel" required="required" ref="mobile" v-model="form.mobile" name="mobile" :placeholder="lang.phone">
                </div>
                <div class="flex tab_two">
                    <input type="email" name="email" ref="email" v-model="form.email" :placeholder="lang.email">
                </div>
            </div>

            <div class="table-row">
                <input type="text" name="guest" v-model="form.note" :placeholder="lang.note">
            </div>
            <div class="flexbox">
                <div class="flex tab_two tab_sele action" rel="0" v-if="paymentType.payment_underline === '1'">
                    <i class="icon"></i>${ lang.cash_on_delivery }
                </div>
                <div class="flex tab_two tab_sele action" rel="0" v-if="paymentType.payment_online === '1' || paymentType.payment_paypal === '1' || paymentType.payment_asiabill === '1'">
                    <i class="icon"></i>${ lang.cash_on_delivery }
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    delimiters: ["${", "}"],
    data() {
        return {
            form: {
                address: "",
                name: "",
                postal: "",
                mobile: "",
                email: "",
                guest: "",
                note: "",
                city: "",
                district: ""
            },
            lang: window.lang,
            region: {
                id: window.region.id,
                code: window.region.code,
                title: window.region.title,
                name: window.region.name
            },
            paymentType: {
                payment_underline: window.paymentType.payment_underline,
                payment_online: window.paymentType.payment_online,
                payment_paypal: window.paymentType.payment_paypal,
                payment_asiabill: window.paymentType.payment_asiabill
            },
            parameterId: {
                region_id: window.region.id,
                yn_region_id: ""
            },
            areaList: {
                province: "",
                city: ""
            }
        };
    },
    mounted() {
        this.$emit("render", false);
        this.getProvince();
    },
    methods: {
        getProvince() {
            this.$http
                .post(
                    "/region.php",
                    { region_id: this.parameterId.region_id },
                    { emulateJSON: true }
                )
                .then(
                    res => {
                        if (res.status === 200) {
                            this.areaList.province = res.body;
                            this.form.district = "";
                        }
                    },
                    () => {
                        console.log("fail");
                    }
                );
        },
        getCity(event) {
            this.parameterId.yn_region_id = event.target.value;
            this.$http
                .post(
                    "/region.php",
                    { yn_region_id: this.parameterId.yn_region_id },
                    { emulateJSON: true }
                )
                .then(
                    res => {
                        if (res.status === 200) {
                            this.areaList.city = res.body;
                        }
                    },
                    () => {
                        console.log("fail");
                    }
                );
        },
        check() {
            if (true) {
                if (this.form.city === "") {
                    alert(this.lang.city);
                    this.$refs.city.focus();
                    return false;
                }

                if (this.form.district === "") {
                    alert(this.lang.district);
                    this.$refs.district.focus();
                    return false;
                }

                if (this.form.address === "") {
                    alert(this.lang.addr);
                    this.$refs.address.focus();
                    return false;
                }

                if (this.form.name === "") {
                    alert(this.lang.name);
                    this.$refs.name.focus();
                    return false;
                }

                if (this.form.postal === "") {
                    alert(this.lang.postal);
                    this.$refs.postal.focus();
                    return false;
                }

                if (this.form.mobile === "") {
                    alert(this.lang.phone);
                    this.$refs.mobile.focus();
                    return false;
                }
                if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.form.mobile)) {
                    alert(this.lang.phone + " error");
                    this.$refs.mobile.focus();
                    return false;
                }

                if (
                    this.form.email !== "" &&
                    !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(
                        this.form.email
                    )
                ) {
                    alert(this.lang.email + " error");
                    this.$refs.email.focus();
                    return false;
                }
                return {
                    mobile: this.form.mobile,
                    address: this.form.address,
                    name: this.form.name,
                    postal: this.form.postal,
                    guest: this.form.guest,
                    email: this.form.email,
                    note: this.form.note,
                    state: this.form.city,
                    city: this.form.district
                };
            } else {
                return false;
            }
        }
    }
};
</script>

<style>
select[name="state"],
select[name="city"] {
    height: 44px;
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px solid #eee;
    border-radius: 4px;
    text-indent: 16px;
}
input,
select,
textarea {
    direction: rtl !important;
    text-align: right !important;
}
.regions {
    text-align: right !important;
    padding-right: 16px;
}
html body {
    font-family: Droid Arabic Naskh, Tahoma, Arial, Sans-serif;
}
.explain {
    direction: rtl !important;
    text-align: right !important;
}
</style>


