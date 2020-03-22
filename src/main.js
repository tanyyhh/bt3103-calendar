import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import VueSimpleAlert from "vue-simple-alert"
// import './../node_modules/bulma/css/bulma.css';

Vue.use(VueSimpleAlert);
Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
    store
}).$mount("#app");