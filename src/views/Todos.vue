<template>
  <div class="projects">
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Awesome! You added a new todo</span>
      <v-btn flat color="white" @click="snackbar=false">Close</v-btn>
    </v-snackbar>
    <v-container class="my-5">
      <h1 class="grey--text">Todos</h1>
      <Popup @projectAdded="snackbar=true" />
      <v-expansion-panel>
        <v-expansion-panel-content v-for="todo in todos" :key="todo.title">
          <div slot="header" class="py-1">{{ todo.title }}</div>
          <v-card>
            <v-card-text class="px-4 grey--text">
              <div>{{ todo.content }}</div>
              <div class="font-weight-bold">Due by {{ todo.due }}</div>
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
import Popup from "../components/Popup.vue";

export default {
  components: {
    Popup
  },
  data() {
    return {
      todos: [],
      snackbar: false
    };
  },
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
        query.get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        });
      } else {
      }
    }
  }
};
</script>
