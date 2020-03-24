import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        events: [],
        selectedMember: {}
    },
    getters: {
        events: state => state.events,
        member: state => state.selectedMember,
    },
    mutations: {
        ADD_EVENT: (state, event) => {
            state.events.push(event);
        },
        SET_MEMBER: (state, member) => {
            state.selectedMember = member;
        }
    },
    actions: {}
});

export default store;