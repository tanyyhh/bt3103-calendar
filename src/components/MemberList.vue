<template>
  <v-card>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>Members</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="toggleList" icon>
        <v-icon>refresh</v-icon>
      </v-btn>
    
    </v-toolbar>

    <v-list>

      <v-list-tile
        v-for="member in members"
        :key="member.id"
        @click="selectUser(member)"
        class="tile"
        :class="[member.memberColor + '--text']"
      >
        <v-list-tile-content>
          <v-list-tile-title>{{ member.name + (selectedMember === member ? ' (selected)' : '') }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

    </v-list>
  </v-card>
</template>


<script>
import db from "@/fb";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      members: [],
      selectedMember: {}
    };
  },

  computed: {
    ...mapGetters(["member"])
  },

  methods: {
    selectUser(mem) {
      if (this.$store.getters.member == mem) {
        this.$store.commit("SET_MEMBER", {});
        this.selectedMember = {};
      } else {
        // no member selected
        this.$store.commit("SET_MEMBER", mem);
        this.selectedMember = mem;
      }
      console.log(this.$store.getters.member);
    },
    toggleList() {
      this.$store.commit("TOGGLE_LIST");
      console.log("hello");
    }
  },

  firestore() {
    var self = this;
    return {
      members: db.collection("masterProjectList").doc(self.$store.state.selectedProject).collection("members")
    }
  }
};
</script>

<style>
.tile {
  margin: 5px;
  border-radius: 4px;
}

.tile:active {
  background: silver;
}
</style>