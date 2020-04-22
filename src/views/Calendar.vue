<template>
  <div id="flex-container">
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Awesome! You added a new event</span>
      <v-btn flat color="white" @click="snackbar=false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbar2" :timeout="4000" top color="warning">
      <span>Please inform the project or event creator if you would like to delete this event</span>
      <v-btn flat color="white" @click="snackbar2=false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbar3" :timeout="2000" top color="success">
      <span>You deleted an event</span>
      <v-btn flat color="white" @click="snackbar3=false">Close</v-btn>
    </v-snackbar>
    <div id="left-child-flex">
      <EventPopup @eventAdded="snackbar=true" />

      <v-layout column>
        <MemberList v-show="displayMemberList"></MemberList>
        <ToDoList v-show="!displayMemberList"></ToDoList>
      </v-layout>
    </div>

    <div id="middle-child-flex">
      <FullCalendar
        :plugins="calendarPlugins"
        :header="{
                    left:'title',
                    center:'dayGridMonth, timeGridWeek',
                    right:'prev today next'
                }"
        :selectable="true"
        :events="events"
        @select="handleSelect"
        :contentHeight="calHeight"
        minTime="08:00:00"
        maxTime="19:00:00"
        slotDuration="01:00:00"
        slotEventOverlap="false"
        @eventClick="handleClick"
        ref="calendar"
      />
    </div>
  </div>
</template>


<script>
require("@fullcalendar/core/main.min.css");
require("@fullcalendar/daygrid/main.min.css");
require("@fullcalendar/timegrid/main.min.css");

import FullCalendar from "@fullcalendar/vue";
import DayGridPlugin from "@fullcalendar/daygrid";
import TimeGridPlugin from "@fullcalendar/timegrid";
import InteractionPlugin from "@fullcalendar/interaction";
import ListPlugin from "@fullcalendar/list";

import { mapGetters } from "vuex";
import Swal from "sweetalert2";

import ToDoList from "../components/ToDoList.vue";
import MemberList from "../components/MemberList.vue";
import EventPopup from "../components/EventPopup.vue";
import firebase from "firebase";
import db from "@/fb";

export default {
  data: () => ({
    calendarPlugins: [
      DayGridPlugin,
      TimeGridPlugin,
      InteractionPlugin,
      ListPlugin
    ],
    id: 0,
    global: "4a84EZ73ZqWnESN1D2Gu",
    calHeight: 0,
    events: [],
    cal: null,
    snackbar: false,
    snackbar2: false,
    snackbar3: false,
    projectCreator: ""
  }),

  firestore() {
    var self = this;
    return {
      events: db
        .collection("masterProjectList")
        .doc(self.$store.state.selectedProject)
        .collection("events")
    };
  },

  created() {
    this.setHeight();
    this.displayMemberList = this.$store.state.displayMemberList;
    var self = this;
  },

  mounted() {
    var self = this;
    db.collection("masterProjectList")
      .doc(self.$store.state.selectedProject)
      .get()
      .then(doc => {
        self.projectCreator = doc.data().creator;
      });
  },

  components: { FullCalendar, ToDoList, MemberList, EventPopup },

  computed: {
    displayMemberList() {
      return this.$store.state.displayMemberList;
    }
  },

  methods: {
    setHeight() {
      this.calHeight = window.innerHeight * 0.8;
    },

    handleClick(arg) {
      var self = this;
      // deleting event
      if (confirm("Delete event?")) {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // console.log("user:", user.uid, "creator:", arg.event.creator);
            // console.log(arg.event.extendedProps.creator);
            if (
              user.uid == self.projectCreator ||
              user.uid == arg.event.extendedProps.creator
            ) {
              let doc_id = arg.event.id;
              db.collection("masterProjectList")
                .doc(self.$store.state.selectedProject)
                .collection("events")
                .doc(doc_id)
                .delete()
                .then(function() {
                  console.log("Project successfully deleted!");
                })
                .catch(function(error) {
                  console.error("Error removing project: ", error);
                });
              self.snackbar3 = true;
            } else {
              self.snackbar2 = true;
              console.log(
                "Please inform the creator if you would like to delete an event"
              );
            }
          } else {
            // No user is signed in.
            console.log("no user hello");
          }
        });
      }
    },

    handleSelect(arg) {
      // take note of start & end, must use Str
      let vm = this;
      if (Object.keys(this.$store.getters.member).length != 0) {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            let ev = {
              id: new Date().getTime(),
              title: "",
              start: arg.startStr,
              end: arg.endStr,
              allDay: arg.allDay,
              color: vm.$store.getters.member.memberColor,
              creator: user.uid
            };
            db.collection("masterProjectList")
              .doc(vm.$store.state.selectedProject)
              .collection("events")
              .add(ev);
          } else {
            // No user is signed in.
            console.log("no user hello");
          }
        });
      }
    },
  }
};
</script>

<style>
#addEvent {
  margin-bottom: 7%;
}
header {
  background: white;
  padding: 15px;
  border-style: groove;
  border-color: black;
  border-width: 2px;
  text-align: center;
  width: 100%;
}
#flex-container {
  display: flex;
  flex-direction: row;
}
#left-child-flex {
  flex: 0 0 20%;
  margin-right: 2%;
  margin-top: 0%;
}
#right-child-flex {
  flex: 0 0 10%;
  margin-left: 3%;
  margin-top: 3%;
}
#midle-child-flex {
  overflow-y: auto;
  max-height: calc(100vh-150px);
}
#itemForm {
  border: 2px solid darkslategray;
}
#button1 {
  background-color: aqua;
  border: 2px solid darkslategray;
  border-radius: 5px;
  padding: 0px 10px;
}

#button2 {
  background-color: aqua;
  border: 2px solid darkslategray;
  border-radius: 5px;
  padding: 0px 10px;
  font-size: 15px;
}

#lst {
  text-align: left;
  font-size: 17px;
}

#who {
  background-color: lightgrey;
}
#checkbox1 {
  transform: scale(1);
}

.red {
  color: red;
}

.orange {
  color: orange;
}

.yellow {
  color: rgb(177, 177, 0);
}

.green {
  color: green;
}

.blue {
  color: blue;
}

.purple {
  color: purple;
}

.pink {
  color: fuchsia;
}

.brown {
  color: brown;
}
</style>