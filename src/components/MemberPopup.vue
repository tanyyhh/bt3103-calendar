<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn flat slot="activator" class="success">Add a new member</v-btn>
    <v-card>
      <v-card-title>
        <h2>Add a new member</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field
            v-model="email"
            label="Please enter the member's email"
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
import firebase from "firebase";

export default {
  data() {
    return {
      email: "",
      dialog: false,
      uid: "",
      colors: [
        "Green",
        "Blue",
        "Yellow",
        "Orange",
        "Purple",
        "Pink",
        "Black"
      ],
      memberColor: ""
    };
  },
  methods: {
    submit() {
      var self = this;
      if (this.$refs.form.validate()) {
        this.loading = true;

        var usersRef = db.collection("users");
        var query = usersRef.where("email", "==", this.email);
        query
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              let uid = doc.data().uid;
              self.uid = uid;
              // console.log("captured", uid);
              // console.log("this", self.uid);
              // console.log(doc.data())

              usersRef
                .doc(uid)
                .get()
                .then(querySnapshot => {
                  console.log(querySnapshot.data());
                });

                // add the project id to the added user's project array
                db.collection("users").doc(uid).update({
                  projects: firebase.firestore.FieldValue.arrayUnion(self.$store.state.selectedProject)
                })

                // add this updated member into project's members collection in masterProjectList
                db.collection("masterProjectList")
                  .doc(self.$store.state.selectedProject)
                  .collection("members")
                  .doc(uid)
                  .set(doc.data());

                  db.collection("masterProjectList")
                  .doc(self.$store.state.selectedProject)
                  .collection("members")
                  .doc(uid)
                  .update({
                    memberColor: self.memberColor.toLowerCase()
                  });
            });
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });

        this.dialog = false;
      }
      console.log("what about here", self.uid);

      this.email = "";
      this.uid = "";
    }
  }
};
</script>
