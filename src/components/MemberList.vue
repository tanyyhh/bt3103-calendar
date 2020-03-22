<template>
  <v-card
    class="mx-auto"
    max-width="300"
    tile
  >
    <v-list rounded>
      <v-subheader>Members</v-subheader>
      <v-list-item-group v-model="member" color="indigo">
        <v-list-item
          v-for="member in members"
          :key="member.id"
          active-class="highlighted"
        >

          <v-list-item-content>
            <v-list-item-title>
                {{ member.name }}
                <br>
                <br>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>


<script>
import db from "@/fb";

export default {

    data() {
        return {
            members: [],
        }
    },

    methods: {

    },

    firestore: {

        members: db.collection("members")

    }

}
</script>

<style>

</style>