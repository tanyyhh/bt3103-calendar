<template>
  <div id="flex-container">
    <div id="left-child-flex">
      <header>{{title}}</header>
      <div>
        <input id="itemForm" v-model="newUser" @keypress.enter="addMember" placeholder="New Member" />
        <button id='button1' @click="addMember">Add Member</button>
      </div>
      <ul id="lst">
        <li v-for="(item, index) in items" :key="item.name">
          {{item.text}}
          <!-- <span :class="item.colorNames">{{item.text}}</span> -->
          <input id='checkbox1' type="checkbox" checked @click="filter(item.color)" />
          <button id='button2' @click="deleteMember(index)">Delete</button>
        </li>
      </ul>
      <label for="who" style='font-size: 20px'>Who are you?</label>
      <select id="who" v-model="selectedUser" @change="setColor(selectedUser)">
        <option value=""  disabled selected>Please select...</option>
        <option v-for="member in items" :key="member.color" :value="member" v-text="member.text"></option>
      </select>
    </div>


    <div id="middle-child-flex">
      <Fullcalendar
        :plugins="calendarPlugins"
        :header="{
                    left:'title',
                    center:'dayGridMonth, timeGridWeek',
                    right:'prev today next'
                }"
        :selectable="true"
        :events="EVENTS"
        @select="handleSelect"
        :contentHeight="calHeight"
        minTime="08:00:00"
        maxTime="19:00:00"
        slotDuration="01:00:00"
        slotEventOverlap="false"
        @eventClick="handleClick"

        />
    </div>

    <div id="right-child-flex">
      <ToDoList></ToDoList>
      <button id="addEvent" @click="promptUser">Add Event</button>
    </div>
  </div>
</template>

<script>
require("@fullcalendar/core/main.min.css");
require("@fullcalendar/daygrid/main.min.css");
require("@fullcalendar/timegrid/main.min.css");

import Fullcalendar from "@fullcalendar/vue";
import DayGridPlugin from "@fullcalendar/daygrid";
import TimeGridPlugin from "@fullcalendar/timegrid";
import InteractionPlugin from "@fullcalendar/interaction";
import ListPlugin from "@fullcalendar/list";

import { mapGetters } from "vuex";
import Swal from "sweetalert2";

import ToDoList from "./ToDoList.vue";
import db from "@/fb";

export default {
  data: () => ({
    calendarPlugins: [
      DayGridPlugin,
      TimeGridPlugin,
      InteractionPlugin,
      ListPlugin
    ],
    title: "List of Members",
    colour: 0, //color of item
    count: 0, //number of items
    items: [],
    colours: [
      "#FF0000",
      "#FFA500",
      "#FFFF00",
      "#008000",
      "#0000FF",
      "#800080",
      "#FFC0CB",
      "#A52A2A"
    ],
    colourNames: [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "pink",
      "brown"
    ],
    mainColor: "white",
    selectedUser: [],
    newUser: "",
    calHeight: 0
  }),
  created() {
      this.setHeight()
      var vm = this;
      db.collection("events")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              title: doc.data().title,
              start: doc.data().start,
              end: doc.data().end,
              allDay: doc.data().allDay
            };
            console.log(data.start)
            vm.handleSelect2({
              start: new Date(data.start),
              end: new Date(data.end),
              title: data.title,
              allDay: data.allDay
          });
          });
        });
  },
  components: { Fullcalendar, ToDoList },
  computed: {
    ...mapGetters(["EVENTS"])
  },
  methods: {
    handleClick(arg) {
      // console.log(arg.event.id)
    if (confirm("Delete event?")) {
    const isEvent = (e) => e.id == arg.event.id;
    const index = this.$store.state.events.findIndex(isEvent);

    this.$store.state.events.splice(index, 1);
    }

    },
      setHeight() {
          this.calHeight = window.innerHeight * 0.8;
      },
    addMember: function() {
      // var input = document.getElementById('itemForm');
      if (this.newUser !== "") {
        this.items.push({
          text: this.newUser + " (" + this.colourNames[this.colour % 8] + ")",
          color: this.colours[this.colour % 8],
          colorNames: this.colourNames[this.colour % 8],
          toggle: false
        });
        this.colour++;
        this.count++;
        this.newUser = "";
      }
    },

    deleteMember: function(index) {
      this.items.splice(index, 1);
    },

    setColor: function(member) {
      this.mainColor = member.color;
      //console.log(this.$store.state.events)
    },
    handleSelect(arg) {
      if (this.selectedUser.color) {
        this.$store.commit("ADD_EVENT", {
          id: new Date().getTime(),
          title: arg.title,
          start: arg.start,
          end: arg.end,
          allDay: arg.allDay,
          color: this.mainColor
        });
      }
    },

    handleSelect2(arg) {
      console.log("test")
      this.$store.commit("ADD_EVENT", {
        id: new Date().getTime(),
        title: arg.title,
        start: arg.start,
        end: arg.end,
        allDay: arg.allDay,
        display: "block",
        color: "khaki"
      });
    },

    filter(col) {
      for (var e in this.$store.state.events) {
        if (this.$store.state.events[e].color == col) {
          this.$store.state.events[e].color += "00";
        } else if (this.$store.state.events[e].color == col + "00") {
          this.$store.state.events[e].color = this.$store.state.events[
            e
          ].color.slice(0, 7);
        }
      }
    },

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
          var title = document.getElementById("swal-input1").value;
          var start = new Date(
            document.getElementById("swal-input2").value +
              "T" +
              document.getElementById("swal-input4").value
          );
          var end = new Date(
            document.getElementById("swal-input3").value +
              "T" +
              document.getElementById("swal-input5").value
          );
          
          vm.handleSelect2({
            start: start,
            end: end,
            allDay: false,
            title: title
          });

          vm.submit({
            start: document.getElementById("swal-input2").value +
              "T" +
              document.getElementById("swal-input4").value,
            end: document.getElementById("swal-input3").value +
              "T" +
              document.getElementById("swal-input5").value,
            allDay: false,
            title: title
          });

          Swal.fire("Event Added!", "Check the Calendar!", "success");
        }
      });
    },

    submit(arg) {
        const event = {
          title: arg.title,
          start: arg.start,
          end: arg.end,
          allDay: false
        };

        db.collection("events")
          .add(event)
          .then(() => {
            this.dialog = false;
            this.$emit("projectAdded");
          });
    },

    created() {
      console.log("hello")
      db.collection("events")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              title: doc.data().title,
              start: doc.data().start,
              end: doc.data().end
            };
            console.log(data)
            vm.handleSelect2({
              start: start,
              end: end,
              allDay: false,
              title: title
          });
          });
        });
  }
  }
};
</script>

<style>
#addEvent {
  float: center;
  margin-top: 50px;
  margin-bottom: 10px;
  margin-left: 10px;
  background-color:aqua;
  border: 2px solid darkslategray;
  border-radius: 5px;
  width: 100px;
  font-size:15px
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
  flex: 0 0 10%;
  margin-right: 3%;
  margin-top: 3%;
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
#itemForm{
  border: 2px solid darkslategray;
}
#button1 {
  background-color:aqua;
  border: 2px solid darkslategray;
  border-radius: 5px;
  padding: 0px 10px;  
}

#button2 {
  background-color:aqua;
  border: 2px solid darkslategray;
  border-radius: 5px;
  padding: 0px 10px;
  font-size:15px;

}

#lst{
  text-align: left;
  font-size: 17px;
}

#who{
  background-color: lightgrey
}
#checkbox1{
  transform: scale(1)
}
ul {
  background: #f4faf6;
  list-style-position: outside;
  text-align: center;
  width: 110%;
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
