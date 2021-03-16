<template>
  <div id="graphInterlocuteurs">
    <!-- Plotly chart will be drawn inside this DIV -->
  </div>
</template>

<script>
import Plotly from "plotly.js-dist";

export default {
  props: { messages: Object },
  methods: {
    showGraph() {
      var y = [...Array(this.messages.length).keys()];
      var trace1 = {
        y: this.dataInterlocuteur(),

        name: "control",
        autobinx: false,
        histnorm: "count",
        marker: {
          color: "rgb(47,79,79)",
        },
        opacity: 0.9,
        type: "histogram",
        // xbins: {
        //   end: 1,
        //   size: 1,
        //   start: Math.min(...this.data),
        // },
      };

      var layout = {
        // bargap: 0.01,
        bargroupgap: 0.05,
        barmode: "overlay",
        title: "Interlocuteurs",
        xaxis: { title: "Nombre de messages" },
        plot_bgcolor: "#f5f5f5",
        paper_bgcolor: "#f5f5f5",
      };
      Plotly.newPlot("graphInterlocuteurs", [trace1], layout);
    },
    dataInterlocuteur() {
      let names = [];
      this.messages.forEach((msg) => {
        names.push(msg.who);
      });
      return names;
    },
  },
  mounted() {
    this.showGraph();
  },
  updated() {
    this.showGraph();
  },
};
</script>

<style scoped>
div {
  width: 100%;
  margin-top: 20px;
}
</style>
