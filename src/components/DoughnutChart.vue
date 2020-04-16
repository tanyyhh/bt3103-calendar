<script>
import { Doughnut } from "vue-chartjs";
import firebase from "firebase";
import db from "@/fb";

export default {
  extends: Doughnut,

  data: function() {
    return {
      seed: 3,
      projectList: [],
      tempList:[],

      dataCollection: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: [],
            data: []
          }
        ]
      },
      options: {
        title: {
          tooltips:{display: false},
          display: true,
          text: "Total time spent on projects",
          fontSize: 20
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },

  methods: {
    random() {
      var x = Math.sin(this.seed++) * 10000;
      return x - Math.floor(x);

    },
    getRandomColor() {
      var letters = '0123456789abcdef';
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(this.random() * 16)];
      }
      return color;
    },

    eventsData() {
      //looks at masterprojectlist database, filters out events with time, giving duration of event and name of project
      var self = this;
      //let temp = {}
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          db.collection("users")
            .doc(user.uid)
            .get()
            .then(doc => {
              self.projectList = doc.data().projects;
            });
        } else {
          console.log("no user hello");
        }
      });

      setTimeout(() => {  
        self.projectList.forEach(proj => {
          var input = {
            projID: proj,
            totalTime: 0
          };
          self.tempList.push(input);

          db.collection("masterProjectList")
            .doc(proj)
            .get()
            .then(doc => {
              if (!(doc.data().name in self.dataCollection.labels)) {
                  self.dataCollection.labels.push(doc.data().name);
                  var color = this.getRandomColor();
                  self.dataCollection.datasets[0].backgroundColor.push(color)
              }
          })
          db.collection("masterProjectList")
            .doc(proj)
            .collection("events")
            .where("color", "==", "khaki")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach(doc => {
                var eventLength = (
                  (Date.parse(doc.data().end) - Date.parse(doc.data().start)) /
                  (1000 * 60 * 60))
                // ).toFixed(1);
                for (var i in self.tempList) {
                  if (self.tempList[i].projID == proj) {
                    self.tempList[i].totalTime += parseInt(eventLength);
                  }
                }
              });
            });
        });
        setTimeout(() => {
            for (var key in self.tempList) {
              self.dataCollection.datasets[0].data.push(self.tempList[key].totalTime)
          }
          this.renderChart(this.dataCollection, this.options);
        }, 1000);
      }, 1000);

  }
  },

  mounted() {
    this.eventsData()
  }
};
</script>

<style>
</style>