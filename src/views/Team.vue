<template>
  <div class="team">
    <h1 class="subheading grey--text">Team</h1>

    <v-flex class="mt-4 mb-3">
      <popup @projectAdded="snackbar=true" />
    </v-flex>

    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="member in members" :key="member.uid">
          <v-card flat class="text-xs-center ma-3">
            <v-card-text>
              <!-- <div class="subheading" px="30">{{ member.member_id }}</div> -->
              <div class="subheading">{{ member.name }}</div>
              <div class="grey--text">{{ member.email }}</div>
              <div :class="member.memberColor">{{ member.memberColor }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn flat color="grey" @click="deleteMember(member.uid)">
                <v-icon small left>delete</v-icon>
                <span class>Delete</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import db from "@/fb";
import popup from "../components/MemberPopup.vue";
import firebase from "firebase";

export default {
  components: {
    popup
  },
  data() {
    return {
      members: [],
      snackbar: false
    };
  },
  firestore() {
    var self = this;
    return {
      members: db
        .collection("masterProjectList")
        .doc(self.$store.state.selectedProject)
        .collection("members")
    };
  },
  methods: {
    deleteMember(uid) {
      if (confirm("Delete this member?")) {
        // remove this member from members collection of this project
        db.collection("masterProjectList")
          .doc(this.$store.state.selectedProject)
          .collection("members")
          .doc(uid)
          .delete()
          .then(function() {
            console.log("Member successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing member: ", error);
          });

        // remove this project id from projects [] of this user
        db.collection("users")
          .doc(uid)
          .update({
            "projects": firebase.firestore.FieldValue.arrayRemove(this.$store.state.selectedProject)
          })
      } else {
      }
    }
  }
};
</script>


