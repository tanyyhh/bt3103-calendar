<template>
  <div id="flex-container">
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Awesome! You added a new event</span>
      <v-btn flat color="white" @click="snackbar=false">Close</v-btn>
    </v-snackbar>
    <div id="left-child-flex">
      <EventPopup @eventAdded="snackbar=true"/>

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

import ToDoList from "./ToDoList.vue";
import MemberList from "./MemberList.vue";
import EventPopup from "./EventPopup.vue"
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
    snackbar: false
  }),

  firestore() {
    var self = this;
    return {
      events: db.collection("masterProjectList").doc(self.$store.state.selectedProject).collection("events")
    }
  },

  created() {
    this.setHeight();
    this.displayMemberList = this.$store.state.displayMemberList;
  },

  components: { FullCalendar, ToDoList, MemberList, EventPopup},

  computed: {
    displayMemberList() {
      return this.$store.state.displayMemberList;
    },
  },

  methods: {
    setHeight() {
      this.calHeight = window.innerHeight * 0.8;
    },

    handleClick(arg) { // deleting event
      if (confirm("Delete event?")) {
        let doc_id = arg.event.id;
        db.collection("masterProjectList")
          .doc(this.$store.state.selectedProject)
          .collection("events")
          .doc(doc_id)
          .delete()
          .then(function() {
            console.log("Project successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing project: ", error);
          });
      }
    },

    handleSelect(arg) { // take note of start & end, must use Str
      if (Object.keys(this.$store.getters.member).length != 0) {
        let ev = {
          id: new Date().getTime(),
          title: "",
          start: arg.startStr,
          end: arg.endStr,
          allDay: arg.allDay,
          color: this.$store.getters.member.memberColor
        };
        db.collection("masterProjectList").doc(this.$store.state.selectedProject).collection("events").add(ev);
      }
    },

    // filter(col) {
    //   for (var e in this.$store.state.events) {
    //     if (this.$store.state.events[e].color == col) {
    //       this.$store.state.events[e].color += "00";
    //     } else if (this.$store.state.events[e].color == col + "00") {
    //       this.$store.state.events[e].color = this.$store.state.events[
    //         e
    //       ].color.slice(0, 7);
    //     }
    //   }
    // },

    promptUser() {
      var vm = this;
      this.$fire({
        title: "Add Event!",
        type: "question",
        html:
          "Event Name" +
          '<input id="swal-input1" class="swal2-input" placeholder="Give a Name!">' +
          "Start Date" +
          '<input id="swal-input2" class="swal2-input" placeholder="YYYY-MM-DD">' +
          "End Date" +
          '<input id="swal-input3" class="swal2-input" placeholder="YYYY-MM-DD">' +
          "Start Time" +
          '<input id="swal-input4" class="swal2-input" placeholder="HH:MM:SS">' +
          "End time" +
          '<input id="swal-input5" class="swal2-input" placeholder="HH:MM:SS">'
      }).then(function(result) {
        if (result.value) {
          db.collection("global")
            .doc(vm.global)
            .get()
            .then(doc => {
              vm.id = doc.data()["variable"];
            })
            .catch(function(error) {
              console.log("Error getting document:", error);
            });

          var input = {
            start:
              document.getElementById("swal-input2").value +
              "T" +
              document.getElementById("swal-input4").value,
            end:
              document.getElementById("swal-input3").value +
              "T" +
              document.getElementById("swal-input5").value,
            allDay: false,
            title: document.getElementById("swal-input1").value
          };

          setTimeout(function() {
            input["id"] = vm.id;
            vm.submit(input);

            db.collection("global")
              .doc(vm.global)
              .set(
                {
                  variable: vm.id + 1
                },
                { merge: true }
              );

            Swal.fire("Event Added!", "Check the Calendar!", "success");
          }, 1000);
        }
      });
    },

    submit(arg) {
      var vm = this;
      const event = {
        id: arg.id,
        title: arg.title,
        start: arg.start,
        end: arg.end,
        allDay: false,
        display: "block",
        color: "khaki",
        // unique: arg.unique
      };

      db.collection("masterProjectList")
        .doc(vm.$store.state.selectedProject)
        .collection("events")
        .add(event)
        .then(() => {
          this.dialog = false;
          this.$emit("eventAdded");
        });
      
    }
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
/* ul {
  background: #f4faf6;
  list-style-position: outside;
  text-align: center;
  width: 110%;
} */

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

<!--
@charset "UTF-8";
.fc-timeGrid-view .fc-day-grid {
    position: relative;
    z-index: 2
}

.fc-timeGrid-view .fc-day-grid .fc-row {
    min-height: 3em
}

.fc-timeGrid-view .fc-day-grid .fc-row .fc-content-skeleton {
    padding-bottom: 1em
}

.fc .fc-axis {
    vertical-align: middle;
    padding: 0 4px;
    white-space: nowrap
}

.fc-ltr .fc-axis {
    text-align: right
}

.fc-rtl .fc-axis {
    text-align: left
}

.fc-time-grid,
.fc-time-grid-container {
    position: relative;
    z-index: 1
}

.fc-time-grid {
    min-height: 100%
}

.fc-time-grid table {
    border: 0 hidden transparent
}

.fc-time-grid>.fc-bg {
    z-index: 1
}

.fc-time-grid .fc-slats,
.fc-time-grid>hr {
    position: relative;
    z-index: 2
}

.fc-time-grid .fc-content-col {
    position: relative
}

.fc-time-grid .fc-content-skeleton {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0
}

.fc-time-grid .fc-business-container {
    position: relative;
    z-index: 1
}

.fc-time-grid .fc-bgevent-container {
    position: relative;
    z-index: 2
}

.fc-time-grid .fc-highlight-container {
    z-index: 3;
    position: relative
}

.fc-time-grid .fc-event-container {
    position: relative;
    z-index: 4
}

.fc-time-grid .fc-now-indicator-line {
    z-index: 5
}

.fc-time-grid .fc-mirror-container {
    position: relative;
    z-index: 6
}

.fc-time-grid .fc-slats td {
    height: 4.25em;
    border-bottom: 0
}

.fc-time-grid .fc-slats .fc-minor td {
    border-top-style: dotted
}

.fc-time-grid .fc-highlight {
    position: absolute;
    left: 0;
    right: 0
}

.fc-ltr .fc-time-grid .fc-event-container {
    margin: 0 2.5% 0 2px
}

.fc-rtl .fc-time-grid .fc-event-container {
    margin: 0 2px 0 2.5%
}

.fc-time-grid .fc-bgevent,
.fc-time-grid .fc-event {
    position: absolute;
    z-index: 1
}

.fc-time-grid .fc-bgevent {
    left: 0;
    right: 0
}

.fc-time-grid-event {
    margin-bottom: 1px;
    width: 10%;
}


/* .fc-time-grid-event-inset {
    -webkit-box-shadow: 0 0 0 1px #fff;
    box-shadow: 0 0 0 1px #fff
} */

.fc-time-grid-event.fc-not-start {
    border-top-width: 0;
    padding-top: 1px;
    border-top-left-radius: 0;
    border-top-right-radius: 0
}

.fc-time-grid-event.fc-not-end {
    border-bottom-width: 0;
    padding-bottom: 1px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0
}

.fc-time-grid-event .fc-content {
    overflow: visible;
    max-height: 100%
}

.fc-time-grid-event .fc-time,
.fc-time-grid-event .fc-title {
    padding: 0 1px
}

.fc-time-grid-event .fc-time {
    font-size: 0em;
    white-space: nowrap
}

.fc-time-grid-event.fc-short .fc-content {
    white-space: nowrap
}

.fc-time-grid-event.fc-short .fc-time,
.fc-time-grid-event.fc-short .fc-title {
    display: inline-block;
    vertical-align: top
}

.fc-time-grid-event.fc-short .fc-time span {
    display: none
}

.fc-time-grid-event.fc-short .fc-time:before {
    content: attr(data-start)
}

.fc-time-grid-event.fc-short .fc-time:after {
    content: " - "
}

.fc-time-grid-event.fc-short .fc-title {
    font-size: .85em;
    padding: 0
}

.fc-time-grid-event.fc-allow-mouse-resize .fc-resizer {
    left: 0;
    right: 0;
    bottom: 0;
    height: 8px;
    overflow: hidden;
    line-height: 8px;
    font-size: 11px;
    font-family: monospace;
    text-align: center;
    cursor: s-resize
}

.fc-time-grid-event.fc-allow-mouse-resize .fc-resizer:after {
    content: "="
}

.fc-time-grid-event.fc-selected .fc-resizer {
    border-radius: 5px;
    border-width: 1px;
    width: 8px;
    height: 8px;
    border-style: solid;
    border-color: inherit;
    background: #fff;
    left: 50%;
    margin-left: -5px;
    bottom: -5px
}

.fc-time-grid .fc-now-indicator-line {
    border-top-width: 1px;
    left: 0;
    right: 0
}

.fc-time-grid .fc-now-indicator-arrow {
    margin-top: -5px
}

.fc-ltr .fc-time-grid .fc-now-indicator-arrow {
    left: 0;
    border-width: 5px 0 5px 6px;
    border-top-color: transparent;
    border-bottom-color: transparent
}

.fc-rtl .fc-time-grid .fc-now-indicator-arrow {
    right: 0;
    border-width: 5px 6px 5px 0;
    border-top-color: transparent;
    border-bottom-color: transparent
}
-->
