<template>
  <div class="dashboard">
    <h1 class="subheading grey--text">Dashboard</h1>
    <div class = "bcg">
    <bar-chart-grouped></bar-chart-grouped>
    </div>

    <div class = "hbc">
    <horizontal-bar-chart></horizontal-bar-chart>
    </div>

    <div class = 'dc'>
    <doughnut-chart> </doughnut-chart>
    </div>

  </div>

</template>

<script>
import db from "@/fb";

import DoughnutChart from '../components/DoughnutChart.vue'
import BarChartGrouped from '../components/BarChartGrouped3.vue'
import HorizontalBarChart from '../components/HorizontalBarChart.vue'

export default {
  components: {
    BarChartGrouped,
    HorizontalBarChart,
    DoughnutChart,
  }
};
</script>

<style>
.project.complete {
  border-left: 4px solid #3cd1c2;
}
.project.ongoing {
  border-left: 4px solid #ffaa2c;
}
.project.overdue {
  border-left: 4px solid #f83e70;
}
.v-chip.complete {
  background: #3cd1c2;
}
.v-chip.ongoing {
  background: #ffaa2c;
}
.v-chip.overdue {
  background: #f83e70;
}

.hbc {
  float: left;
  width: 50%;
}
.dc {
  float: right;
  width: 50%;
}
</style>
