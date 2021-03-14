<template>
  <div id="myDiv"><!-- Plotly chart will be drawn inside this DIV --></div>
</template>

<script>
import Plotly from "plotly.js-dist";

export default {
  props: { data: Array },
  mounted() {
    this.showGraph();
  },
  updated() {
    this.showGraph();
  },
  methods: {
    showGraph() {
      var y = [...Array(this.data[0].length).keys()];
      var trace1 = {
        x: this.data[0],
        y: y,
        name: "control",
        autobinx: false,
        histnorm: "count",
        marker: {
          color: "rgba(	54, 168, 235, 1)",
        },
        opacity: 0.9,
        type: "histogram",
        xbins: {
          end: 1,
          size: 1,
          start: Math.min(...this.data[0]),
        },
        text: this.data[1],
      };

      var data = [trace1];
      var layout = {
        // bargap: 0.01,
        bargroupgap: 0.05,
        barmode: "overlay",
        title: "Sampled Results",
        xaxis: { title: "Value" },
        yaxis: { title: "Count" },
      };
      Plotly.newPlot("myDiv", data, layout);
    },
  },
};
</script>

<style scoped>
#myDiv {
  width: 100%;
}
</style>
