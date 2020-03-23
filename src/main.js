import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import VueSimpleAlert from "vue-simple-alert";
import { firestorePlugin } from "vuefire";
import firebase from "firebase";
import "./fb";

Vue.use(firestorePlugin);

Vue.use(VueSimpleAlert);
Vue.config.productionTip = false;

let app;
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    new Vue({
      router,
      render: h => h(App),
      store
    }).$mount("#app");
  }
});
