<template>
  <div class="projects">
    <h1 class="subheading grey--text">Projects</h1>

    <v-container class="my-5">
      <v-expansion-panel>
        <v-expansion-panel-content v-for="todo in todos" :key="todo.title">
          <div slot="header" class="py-1">{{ todo.title }}</div>
          <v-card>
            <v-card-text class="px-4 grey--text">
              <div class="font-weight-bold">Due by {{ todo.due }}</div>
              <div>{{ todo.content }}</div>
              <v-btn flap color="grey-lighten-4" @click="deleteProduct(todo)">
                <v-icon left>delete</v-icon>
                <span>Delete</span>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </div>
</template>

<script>
import db from "@/fb";

export default {
  data() {
    return {
      todos: []
    };
  },
  // computed: {
  //   myProjects() {
  //     return this.projects.filter(project => {
  //       return project.person === "UserName" && project.status != "complete";
  //     });
  //   }
  // },
  firestore() {
    var self = this;
    return {
      todos: db
        .collection("masterProjectList")
        .doc(self.$store.state.selectedProject)
        .collection("todos")
    };
  },
  methods: {
    deleteProduct(todo) {
      if (confirm("Are you sure of deleting the project?")) {
        var query = db
          .collection("masterProjectList")
          .doc(this.$store.state.selectedProject)
          .collection("todos")
          .where("title", "==", todo.title);
        query.get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.delete()
            })
          })
      } else {
      }
    }
  }
};
</script>
