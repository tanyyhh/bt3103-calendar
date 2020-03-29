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
    >Add Event</v-btn>

    <v-card>
      <v-card-title>
        <h2>Add a New Event</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field v-model="name" label="Name" prepend-icon="folder" :rules="inputRules"></v-text-field>
          <!-- <v-textarea v-model="desc" label="Description" prepend-icon="edit" :rules="inputRules"></v-textarea> -->

          <v-menu v-model="menu" :close-on-content-click="false">
            <v-text-field
              slot="activator"
              :rules="inputRules"
              clearable
              label="Start date"
              prepend-icon="date_range"
              v-model="from"
            ></v-text-field>
            <v-date-picker v-model="from" @change="menu=false"></v-date-picker>
          </v-menu>

          <v-menu v-model="menu2" :close-on-content-click="false">
            <v-text-field
              slot="activator"
              :rules="inputRules"
              clearable
              label="End date"
              prepend-icon="date_range"
              v-model="till"
            ></v-text-field>
            <v-date-picker v-model="till" @change="menu2=false"></v-date-picker>
          </v-menu>

          <v-menu v-model="menu3" :close-on-content-click="false" ref="menu">
            <v-text-field
              slot="activator"
              :rules="inputRules"
              clearable
              label="Start time"
              prepend-icon="place"
              v-model="start"
            ></v-text-field>
            <v-time-picker
              v-if="menu3"
              v-model="start"
              full-width
              @click:minute="$refs.start.save(time)"
              @change="menu3=false"
            ></v-time-picker>
            <v-btn>hello</v-btn>
          </v-menu>

          <v-menu v-model="menu4" :close-on-content-click="false" ref="menu">
            <v-text-field
              slot="activator"
              :rules="inputRules"
              clearable
              label="End time"
              prepend-icon="place"
              v-model="end"
            ></v-text-field>
            <v-time-picker
              v-if="menu4"
              v-model="end"
              full-width
              @click:minute="$refs.end.save(time)"
              @change="menu4=false"
            ></v-time-picker>
          </v-menu>

          <v-spacer></v-spacer>

          <v-btn flat @click="submit" class="success mx-0 mt-3">Add Event</v-btn>
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
      name: "",
      from: "",
      till: "",
      start: "",
      end: "",
      menu: false,
      menu2: true,
      menu3: false,
      menu4: false,
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
      var input = {
        start: this.from + "T" + this.start,
        end: this.till + "T" + this.end,
        allDay: false,
        title: this.name
      };
      this.handleEvent(input);
      this.from = "";
      this.till = "",
      this.start = "",
      this.end = ""
    },
    handleEvent(arg) {
      var vm = this;
      const event = {
        id: new Date().getTime(),
        title: arg.title,
        start: arg.start,
        end: arg.end,
        allDay: false,
        display: "block",
        color: "khaki"
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
  },
  computed: {
    formattedDate() {
      console.log(this.due);
      return this.start ? format(this.start, "Do MMM YYYY") : "";
    }
  }
};
</script>
