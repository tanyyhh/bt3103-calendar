<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn
      block
      color="secondary"
      flat
      slot="activator"
      class="success"
      dark
      id="addEvent"
    >Add Project</v-btn>

    <v-card>
      <v-card-title>
        <h2>Add a New Project</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field v-model="code" label="Code" prepend-icon="folder" :rules="inputRules"></v-text-field>
          <v-text-field v-model="name" label="Name" prepend-icon="folder" :rules="inputRules"></v-text-field>
          <v-textarea v-model="desc" label="Description" prepend-icon="edit" :rules="inputRules"></v-textarea>

          <v-menu v-model="menu" :close-on-content-click="false">
            <v-text-field
              slot="activator"
              :rules="inputRules"
              :value="formattedDate"
              clearable
              label="Due date"
              prepend-icon="date_range"
            ></v-text-field>
            <v-date-picker v-model="due" @change="menu = false"></v-date-picker>
          </v-menu>

          <v-spacer></v-spacer>

          <v-btn flat @click="submit" class="success mx-0 mt-3">Add Project</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import format from "date-fns/format";
import db from "@/fb";
import firebase from "firebase";

export default {
  data() {
    return {
      code: "",
      desc: "",
      name: "",
      due: null,
      menu: false,
      inputRules: [
        v => !!v || "This field is required",
        v => v.length >= 3 || "Minimum length is 3 characters"
      ],
      dialog: false
    };
  },
  // mounted() {
  //   var self = this;
  //   firebase.auth().onAuthStateChanged(function(user) {
  //     if (user) {
  //       // User is signed in.
  //       self.person = user.displayName;
  //     } else {
  //       // No user is signed in.
  //       console.log("no user hello");
  //     }
  //   });
  // },
  methods: {
    submit() {
      var self = this;
      let key = new Date().getTime().toString();

      if (this.$refs.form.validate()) {
        this.loading = true;
        var input = {
          code: self.code,
          name: self.name,
          desc: self.desc,
          due: self.due,
          id: key
        };
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            console.log(user.uid);

            var docRef = db.collection("users").doc(user.uid);
            docRef.update({
              projects: firebase.firestore.FieldValue.arrayUnion(key)
            });

            // initialising dummy documents in events, todos collections

            db.collection("masterProjectList")
              .doc(key)
              .set(input)
              .then(doc => {
                self.dialog = false;
                self.$emit("projectAdded");
              });
            db.collection("masterProjectList")
              .doc(key)
              .collection("events")
              .add({});

            const todo = {
              title: "Example todo",
              content: "This is an example todo, feel free to delete this!",
              due: "1st Jan 2020",
              person: "User",
              status: "ongoing"
            };
            db.collection("masterProjectList")
              .doc(key)
              .collection("todos")
              .doc(user.uid)
              .set(todo);

            docRef.get().then(doc => {
              db.collection("masterProjectList")
                .doc(key)
                .collection("members")
                .doc(user.uid)
                .set(doc.data());

              db.collection("masterProjectList")
                .doc(key)
                .collection("members")
                .doc(user.uid)
                .update({
                  memberColor: "red" // default color for user who created project
                });
            });
          } else {
            // No user is signed in.
            console.log("no user hello");
          }
        });
        self.name = "";
        self.code = "";
        self.desc = "";
        self.due = "";
      }
    }
  },
  computed: {
    formattedDate() {
      console.log(this.due);
      return this.due ? format(this.due, "Do MMM YYYY") : "";
    }
  }
};
</script>
