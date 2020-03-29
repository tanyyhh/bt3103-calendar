import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        events: [],
        id: [],
        selectedMember: {},
        displayMemberList: true,
        selectedProject: "1585330846799",
        projectName: "Example Project",
        projectCode: "BT3103"

    },
    getters: {
        events: state => state.events,
        member: state => state.selectedMember,
        selectedProject: state => state.selectedProject
    },
    mutations: {
        ADD_EVENT: (state, event) => {
            state.events.push(event);
            state.id.push(event.id)
            console.log(event.id)
        },
        SET_MEMBER: (state, member) => {
            state.selectedMember = member;
        },
        TOGGLE_LIST: (state) => {
            state.displayMemberList = !state.displayMemberList;
        }
    },
    actions: {}
});

export default store;