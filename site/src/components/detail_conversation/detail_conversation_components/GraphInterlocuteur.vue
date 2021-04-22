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
      var interlocuteurs = this.dataInterlocuteur();
      var y = [...Array(this.messages.length).keys()];
      var trace1 = {
        y: interlocuteurs,

        name: "control",
        autobinx: false,
        histnorm: "count",
        marker: {
          color: "rgb(47,79,79)",
        },
        opacity: 0.9,
        type: "histogram",
      };

      var layout = {
        // bargap: 0.01,
        bargroupgap: 0.05,
        barmode: "overlay",
        title: "Interlocuteurs",
        xaxis: { title: "Nombre de messages" },
        plot_bgcolor: "#f5f5f5",
        paper_bgcolor: "#f5f5f5",
        margin: {
          l: Math.min(
            Math.max(this.largestName(interlocuteurs) * 8.5, 60),
            180
          ),
          r: 20,
          b: 50,
          pad: 10,
        },
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
    largestName(names) {
      let max = 0;
      names.forEach((name) => {
        if (name.length > max) max = name.length;
      });
      return max;
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
