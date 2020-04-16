<script>
import { Bar } from "vue-chartjs";
import firebase from "firebase";
import db from "@/fb";

export default {
  extends: Bar,

  data: function() {
    return {
      seed: 3,
      projectList: [],
      tempList: [[], [], [], [], [], [], []],
      dataCollection: {
        labels: [],
        datasets: []
      },

      options: {
        title: {
          display: true,
          text: "Daily activity (past 7 days)",
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
          // No user is signed in.
          console.log("no user hello");
        }
      });

      var today = new Date();
      var labelMaker = new Date();
      for (var a = 0; a < 7; a++) {
        var day = (labelMaker.getMonth() + 1).toString() + "/" + labelMaker.getDate().toString()
        self.dataCollection.labels.unshift(day)
        labelMaker.setDate(labelMaker.getDate() - 1)
      }

      setTimeout(() => {
        self.projectList.forEach(proj => {
          var input = {
            projID: proj,
            totalTime: 0
          };
          for (var i = 0; i < 7; i++) {
            self.tempList[i].push(Object.assign({},input));
          }
          db.collection("masterProjectList")
            .doc(proj)
            .get()
            .then(doc => {
              if (!(doc.data().name in self.dataCollection.labels)) {
                var color = this.getRandomColor()
                var newProject = {label: doc.data().name, backgroundColor: color, data: []}
                self.dataCollection.datasets.push(newProject);         
              }
            });
          db.collection("masterProjectList")
            .doc(proj)
            .collection("events")
            .where("color", "==", "khaki")
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                var eventLength =
                  (Date.parse(doc.data().end) - Date.parse(doc.data().start)) /
                  (1000 * 60 * 60);
                // ).toFixed(1);

                for (var i in self.tempList[0]) {
                  if (self.tempList[0][i].projID == proj && Date.parse(today) - Date.parse(doc.data().start) < 1000 * 60 * 60 * 24) {self.tempList[6][i].totalTime += parseInt(eventLength);}
                  else if (self.tempList[0][i].projID == proj && Date.parse(today) - Date.parse(doc.data().start) < 1000 * 60 * 60 * 24 * 2) {self.tempList[5][i].totalTime += parseInt(eventLength);}
                  else if (self.tempList[0][i].projID == proj && Date.parse(today) - Date.parse(doc.data().start) < 1000 * 60 * 60 * 24 * 3) {self.tempList[4][i].totalTime += parseInt(eventLength);}
                  else if (self.tempList[0][i].projID == proj && Date.parse(today) - Date.parse(doc.data().start) < 1000 * 60 * 60 * 24 * 4) {self.tempList[3][i].totalTime += parseInt(eventLength);}
                  else if (self.tempList[0][i].projID == proj && Date.parse(today) - Date.parse(doc.data().start) < 1000 * 60 * 60 * 24 * 5) {self.tempList[2][i].totalTime += parseInt(eventLength);}
                  else if (self.tempList[0][i].projID == proj && Date.parse(today) - Date.parse(doc.data().start) < 1000 * 60 * 60 * 24 * 6) {self.tempList[1][i].totalTime += parseInt(eventLength);}
                  else if (self.tempList[0][i].projID == proj && Date.parse(today) - Date.parse(doc.data().start) < 1000 * 60 * 60 * 24 * 7) {self.tempList[0][i].totalTime += parseInt(eventLength);}
                }
            
              });
            });
        });
        setTimeout(() => {
          for (var p = 0; p < 7; p++) {
            var count = 0;
            for (var proj in self.tempList[p]) {
              self.dataCollection.datasets[count].data.push(self.tempList[p][proj].totalTime);
              count++;
            }
          }

          this.renderChart(this.dataCollection, this.options);
        }, 1000);
      }, 1000);
    }
  },

  mounted() {
    this.eventsData();
  }
};
</script>