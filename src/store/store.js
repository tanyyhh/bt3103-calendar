import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    events: [],
    id: []
  },
  getters: {
    EVENTS: state => state.events
  },
  mutations: {
    ADD_EVENT: (state, event) => {
      state.events.push(event);
      state.id.push(event.id)
      console.log(event.id)
    }
  },
  actions: {}
});

export default store;
