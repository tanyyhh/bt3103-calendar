<template>
  <v-card>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>To-do List</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="toggleList">
        <v-icon>refresh</v-icon>
      </v-btn>
     
    </v-toolbar>

    <v-list two-line subheader>

      <v-list-tile v-for="todo in todos" :key="todo.title">
        <v-list-tile-content>
          <v-list-tile-title v-text="todo.title"></v-list-tile-title>
          <v-list-tile-sub-title v-text="todo.content"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      
    </v-list>

  </v-card>
</template>

<script>
import db from "@/fb";
export default {
  data() {
    return {
      title: "To Do List",
      newTodo: "",
      todos: []
    };
  },
  created() {},
  firestore: {
    todos: db.collection("projects")
  },
  methods: {
    toggleList() {
      this.$store.commit("TOGGLE_LIST");
      console.log("hello");
    }
  }
};
</script>

<style scoped>
.todolist {
  transform: translate(0%, 0%);
  margin-bottom: 10px;
  border: 10;
  border-radius: 0.5em;
  background: initial;
  background-color: rgb(212, 246, 248);
  color: rgb(14, 13, 13);
  font-size: 1.0625em;
  text-align: center;
}
</style>