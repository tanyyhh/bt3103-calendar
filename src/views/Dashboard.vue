<template>
  <div class="dashboard">
    <h1 class="subheading grey--text">Dashboard</h1>

    <div class = "hbc">
    <horizontal-bar-chart></horizontal-bar-chart>
    </div>

    <div class = 'dc'>
    <doughnut-chart> </doughnut-chart>
    </div>

    <!-- <v-container class="my-5">
      <v-layout row justify-start class="mb-3">
        <v-tooltip top>
          <v-btn
            small
            flat
            color="grey"
            @click="sortBy('title')"
            slot="activator"
          >
            <v-icon small left>folder</v-icon>
            <span class="caption text-lowercase">By project name</span>
          </v-btn>
          <span>Sort by project name</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn
            small
            flat
            color="grey"
            @click="sortBy('person')"
            slot="activator"
          >
            <v-icon small left>person</v-icon>
            <span class="caption text-lowercase">By Person</span>
          </v-btn>
          <span>Sort by project author</span>
        </v-tooltip>
      </v-layout>

      <v-card flat v-for="todo in todos" :key="todo.title">
        <v-layout row wrap :class="`pa-3 project ${todo.status}`">
          <v-flex xs12 md6>
            <div class="caption grey--text">Project title</div>
            <div>{{ todo.title }}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Person</div>
            <div>{{ todo.person }}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Due by</div>
            <div>{{ todo.due }}</div>
          </v-flex>
          <v-flex xs2 sm4 md2>
            <div class="right">
              <v-chip
                small
                :class="`${todo.status} white--text my-2 caption`"
                >{{ todo.status }}</v-chip
              >
            </div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
    </v-container> -->
    
  </div>

</template>

<script>
import db from "@/fb";

import DoughnutChart from '../components/DoughnutChart.vue'
import HorizontalBarChart from '../components/HorizontalBarChart.vue'

export default {
  components: {
    HorizontalBarChart,
    DoughnutChart,
  }

  // // components: 
  // //   BarChartGrouped,
  // //   DoughnutChart,
  // data() {
  //   return {
  //     todos: [],
  //     projectList: [], //used for labelling graphs eg.[project 1, project 2]
  //     events: [], //used for doughnut data eg. [project 1 : 10, project 2 : 2]
  //     days: [], //contains the past 7 days of time spent on diff projects
  //               //eg. [[project 1 : 10h, project 2 : 3h], [project 1 : 1h, project 2 : 0h]]
  //     dateList: [], //used for labelling days on the graph eg.["4/11", "4/12"]

  //   };
  // },
  // firestore() {
  //   var self = this;
  //   return {
  //     todos: db.collection("masterProjectList").doc(self.$store.state.selectedProject).collection("todos")
  //   }
  // },
  // methods: {
  //   sortBy(prop) {
  //     this.projects.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
  //   },
  //   addTimeToDays() {//attaches date to each output of projectTime()
      
  //   },
  //   eventsDataByDay() { //loops thru days and adds total number of hours spent per project, returns a dictionary for doughnut plot
  //     var self = this;
  //     firebase.auth().onAuthStateChanged(function(user) {
  //       if (user) {
  //         // User is signed in.
  //         db.collection("users")
  //           .doc(user.uid)
  //           .get()
  //           .then(doc => {
  //             self.projectList = doc.data().projects;
  //           });
  //       } else {
  //         // No user is signed in.
  //         console.log("no user hello");
  //       }
  //     });
    
  //     for (var j = 0; i < 7; j++) { //for loop 7 times for past 7 days data
  //       var temp = [];
  //       var today = new Date(); //get todays date
  //       today.setDate(today.getDate() - j);
  //       this.dateList.push(today);
  //       self.projectList.forEach(proj => {
  //         var input = {
  //           projID: proj,
  //           totalTime: 0,
  //         }
  //         console.log("before push", self.temp);
  //         self.temp.push(input);
  //         console.log("after push", self.temp)
  //         db.collection("masterProjectList")
  //           .doc(proj)
  //           .collection("events")
  //           .where("color", "==", "khaki")
  //           .get()
  //           .then(querySnapshot => {
  //             querySnapshot.forEach(doc => {
  //               var eventLength = (
  //                 (Date.parse(doc.data().end) - Date.parse(doc.data().start)) /
  //                 (1000 * 60 * 60)
  //               ).toFixed(1);
  //               for (var i in self.temp) {
  //                 if ((self.temp[i].projID == proj) && (today == new Date(doc.data().end))) {
  //                   self.temp[i].totalTime += eventLength;
  //                 }
  //               }
  //             });
  //           });
  //       });
  //     }
  //   },
  //   eventsData() { //looks at masterprojectlist database, filters out events with time, giving duration of event and name of project
  //     var self = this;
  //     firebase.auth().onAuthStateChanged(function(user) {
  //       if (user) {
  //         // User is signed in.
  //         db.collection("users")
  //           .doc(user.uid)
  //           .get()
  //           .then(doc => {
  //             self.projectList = doc.data().projects;
  //           });
  //       } else {
  //         // No user is signed in.
  //         console.log("no user hello");
  //       }
  //     });

  //     self.projectList.forEach(proj => {
  //       var input = {
  //         projID: proj,
  //         totalTime: 0
  //       }
  //       console.log("before push", self.events);
  //       self.events.push(input);
  //       self.projectList.push(input.projID);
  //       console.log("after push", self.events)
  //       db.collection("masterProjectList")
  //         .doc(proj)
  //         .collection("events")
  //         .where("color", "==", "khaki")
  //         .get()
  //         .then(querySnapshot => {
  //           querySnapshot.forEach(doc => {
  //             var eventLength = (
  //               (Date.parse(doc.data().end) - Date.parse(doc.data().start)) /
  //               (1000 * 60 * 60)
  //             ).toFixed(1);
  //             for (var i in self.events) {
  //               if (self.events[i].projID == proj) {
  //                 self.events[i].totalTime += eventLength;
  //               }
  //             }
  //           });
  //         });
  //     });
  //     //output should be (Project 1 : 10h, Project 2: 3h), //should add this into a dictionary with format (Project name : hours spent)
  //   }

  // }
};
</script>

<style>
.project.complete {
  border-left: 4px solid #3cd1c2;
}
.project.ongoing {
  border-left: 4px solid #ffaa2c;
}
.project.overdue {
  border-left: 4px solid #f83e70;
}
.v-chip.complete {
  background: #3cd1c2;
}
.v-chip.ongoing {
  background: #ffaa2c;
}
.v-chip.overdue {
  background: #f83e70;
}

.hbc {
  float: left;
  width: 50%;
}
.dc {
  float: right;
  width: 50%;
}
</style>
