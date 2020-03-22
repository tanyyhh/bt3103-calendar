<template>
    <button id="addEvent" @click="promptUser">Add Event</button>
</template>

<script>
import db from "@/fb";

export default {
  methods: {
    submit(arg) {
      if (this.$refs.form.validate()) {
        this.loading = true;

        const event = {
          title: arg.title,
          start: arg.start,
          end: arg.end
        };

        db.collection("events")
          .add(event)
          .then(() => {
            this.dialog = false;
            this.$emit("projectAdded");
          });
      }
    },

    promptUser() {
      var vm = this;
      this.$fire({
        title: "Add Event!",
        type: "question",
        html:
          "Event Name" +
          '<input id="swal-input1" class="swal2-input" placeholder="Give a Name!">' +
          "Start Date" +
          '<input id="swal-input2" class="swal2-input" placeholder="YYYY-MM-DD">' +
          "End Date" +
          '<input id="swal-input3" class="swal2-input" placeholder="YYYY-MM-DD">' +
          "Start Time" +
          '<input id="swal-input4" class="swal2-input" placeholder="HH:MM:SS">' +
          "End time" +
          '<input id="swal-input5" class="swal2-input" placeholder="HH:MM:SS">'
      }).then(function(result) {
        if (result.value) {
          var title = document.getElementById("swal-input1").value;
          var start = new Date(
            document.getElementById("swal-input2").value +
              "T" +
              document.getElementById("swal-input4").value
          );
          var end = new Date(
            document.getElementById("swal-input3").value +
              "T" +
              document.getElementById("swal-input5").value
          );
          vm.handleSelect2({
            start: start,
            end: end,
            allDay: false,
            title: title
          });

          vm.submit({

          }

          Swal.fire("Event Added!", "Check the Calendar!", "success");
        }
      });
    },

    handleSelect2(arg) {
      this.$store.commit("ADD_EVENT", {
        id: new Date().getTime(),
        title: arg.title,
        start: arg.start,
        end: arg.end,
        allDay: arg.allDay,
        display: "block",
        color: "khaki"
      });
    },
  }
};
</script>
}


