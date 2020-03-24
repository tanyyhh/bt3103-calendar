<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn flat slot="activator" class="success">Add a new member</v-btn>
    <v-card>
      <v-card-title>
        <h2>Add a new member</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field v-model="id" label="Member id" prepend-icon="person"></v-text-field>
          <v-text-field
            v-model="name"
            label="Member Name"
            prepend-icon="person"
          ></v-text-field>
          <v-text-field
            v-model="job_scope"
            label="Member Job Scope"
            prepend-icon="person"
          ></v-text-field>
          <v-spacer></v-spacer>

          <v-flex xs12 sm6>
          <v-select
            v-model="memberColor"
            :items="colors"
            label="Select a color"
            solo
          ></v-select>
        </v-flex>
        <v-spacer></v-spacer>

          <v-btn flat @click="submit" class="success mx-0 mt-3">Add Member</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import format from "date-fns/format";
import db from "@/fb";

export default {
  data() {
    return {
      id: "",
      name: "",
      job_scope: "",
      title: "",
      content: "",
      due: null,
      menu: false,
      // inputRules: [
      //   v => !!v || "This field is required",
      //   v => v.length >= 1 || "Minimum length is 1 character"
      // ],
      dialog: false,
      colors: ["Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Black"],
      memberColor: ""
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        const member = {
          name: this.name,
          id: this.id,
          job_scope: this.job_scope,
          memberColor: this.memberColor.toLowerCase(),
          isSelected: false
        };

        db.collection("members")
          .add(member)
          .then(() => {
            this.dialog = false;
            this.$emit("projectAdded");
          });

        
      }
      this.id = "";
      this.name = "";
      this.job_scope = "";
      this.memberColor = "";
    }
  }
};
</script>
