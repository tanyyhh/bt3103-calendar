<template>
  <v-layout column>
    <v-card>
      <v-toolbar color="indigo" dark>
        <v-toolbar-side-icon></v-toolbar-side-icon>

        <v-toolbar-title>Members</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>search</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>more_vert</v-icon>
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
            <v-list-tile-title>
              {{ member.name }}
            </v-list-tile-title>
            
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <!-- <v-radio-group
        v-for="member in members"
        :key="member.id"
        v-model="selectedMember"
        :mandatory="false"
        :multiple="false"
      >
        <v-radio :label="member.name" :color="member.memberColor"></v-radio>
      </v-radio-group> -->
    </v-card>
  </v-layout>
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
    // isActive: function() {
    //     return this.selectedMember == this.$store.getters.member;
    // }
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
    }
  },

  firestore: {
    members: db.collection("members")
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