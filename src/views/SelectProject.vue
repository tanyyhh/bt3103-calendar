<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Awesome! You added a new project</span>
      <v-btn flat color="white" @click="snackbar=false">Close</v-btn>
    </v-snackbar>
    <v-container class="my-5">
      <h1 class="grey--text">Projects</h1>
      <ProjectPopup @projectAdded="snackbar=true" />
      <v-expansion-panel>
        <v-expansion-panel-content
          v-for="project in masterProjectList"
          :key="project.name"
          v-show="check(project)"
        >
          <div slot="header" class="py-1">{{ project.code + " " + project.name }}</div>
          <v-card>
            <v-card-text class="px-4 black--text">
              <div>{{ project.desc }}</div>
              <div class="font-weight-bold">Due by {{ project.due }}</div>
              <!-- <div class="font-weight-bold">Project id: {{ project.id }}</div> -->
              <v-btn flap color="grey-lighten-4" @click="handleClick(project)">
                <v-icon left>calendar_today</v-icon>
                <span>Go to Calendar</span>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import firebase from "firebase";
import db from "@/fb";
import ProjectPopup from "../components/ProjectPopup.vue";

export default {
  components: {
    ProjectPopup
  },
  data() {
    return {
      masterProjectList: [],
      proj: [],
      users: [],
      currentUsername: "",
      snackbar: false
    };
  },
  firestore: {
    masterProjectList: db.collection("masterProjectList"),
    users: db.collection("users")
  },
  mounted() {
    this.projectList();
    this.test();
  },
  watch: {
    users: function() {
      var self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log(user.uid);

          var docRef = db.collection("users").doc(user.uid);
          docRef.get().then(doc => {
            let proj = doc.data().projects;
            // console.log(proj);
            self.proj = proj;
            self.currentUsername = doc.data().name;
          });
        } else {
          // No user is signed in.
          console.log("no user hello");
        }
      });
    }
  },
  methods: {
    check(project) {
      return this.proj.includes(project.id);
    },
    test() {
      var self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          self.user = db.collection("users").doc(user.uid);
        } else {
          // No user is signed in.
          console.log("no user hello");
        }
      });
    },
    projectList() {
      var self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log(user.uid);

          var docRef = db.collection("users").doc(user.uid);
          docRef.get().then(doc => {
            let proj = doc.data().projects;
            // console.log(proj);
            self.proj = proj;
          });
        } else {
          // No user is signed in.
          console.log("no user hello");
        }
      });
    },
    handleClick(project) {
      this.$store.state.selectedProject = project.id;
      this.$store.state.projectName = project.name;
      this.$store.state.projectCode = project.code;
      this.$router.push("/calendar");
    }
  }
};
</script>

<style>
</style>