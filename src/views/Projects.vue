<template>
  <div class="projects">
    <h1 class="subheading grey--text">Projects</h1>

    <v-container class="my-5">
      <v-expansion-panel>
        <v-expansion-panel-content
          v-for="project in myProjects"
          :key="project.title"
        >
          <div slot="header" class="py-1">{{ project.title }}</div>
          <v-card>
            <v-card-text class="px-4 grey--text">
              <div class="font-weight-bold">Due by {{ project.due }}</div>
              <div>{{ project.content }}</div>
              <v-btn
                flap
                color="grey-lighten-4"
                @click="deleteProduct(project.id)"
              >
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

export default {
  data() {
    return {
      projects: []
    };
  },
  computed: {
    myProjects() {
      return this.projects.filter(project => {
        return project.person === "UserName" && project.status != "complete";
      });
    }
  },
  methods: {
    deleteProduct(doc) {
      if (confirm("Are you sure of deleting the project?")) {
        console.log(doc);
        db.collection("projects")
          .doc(doc)
          .delete()
          .then(function() {
            console.log("Project successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing project: ", error);
          });
      } else {
      }
    }
  },
  created() {
    db.collection("projects").onSnapshot(res => {
      const changes = res.docChanges();

      changes.forEach(change => {
        if (change.type === "added") {
          this.projects.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        }
      });
    });
  }
};
</script>
