<template>
  <div :id="`${id}`">
    <!-- Plotly chart will be drawn inside this DIV -->
  </div>
</template>

<script>
import Plotly from "plotly.js-dist";

export default {
  props: {
    id: String,
    data1: Array,
    data2: Array,
    pas: Number,
    title: String,
    xlabel: String,
    ylabel: String,
    color1: String,
    color2: String,
  },
  mounted() {
    this.showGraph();
  },
  updated() {
    this.showGraph();
  },
  methods: {
    showGraph() {
      var y = [...Array(this.data1.length).keys()];
      let traces = [];
      var trace1 = {
        x: this.data1,
        y: y,
        name: "Total réactions",
        autobinx: false,
        histnorm: "count",
        marker: {
          color: this.color1,
        },
        opacity: 0.9,
        type: "histogram",
        xbins: {
          end: 1,
          size: 1,
          start: Math.min(...this.data1),
        },
        text: this.barHoverText(this.data1),
      };
      traces.push(trace1);

      if (this.data2 !== undefined) {
        if (!this.data2.includes(Math.max(...this.data1))) {
          this.data2.push(Math.max(...this.data1));
        }
        var trace2 = {
          x: this.data2,
          y: y,
          name: 'Réactions "sérieuses"',
          autobinx: false,
          histnorm: "count",
          marker: {
            color: this.color2,
          },
          opacity: 1,
          type: "histogram",
          xbins: {
            end: 1,
            size: 1,
            start: Math.min(...this.data2),
          },
          text: this.barHoverText(this.data2),
        };
        traces.push(trace2);
      }

      var layout = {
        // bargap: 0.01,
        bargroupgap: 0.05,
        barmode: "overlay",
        title: this.title,
        xaxis: { title: this.xlabel },
        yaxis: { title: this.ylabel },
        plot_bgcolor: "#f5f5f5",
        paper_bgcolor: "#f5f5f5",
        margin: {
          l: 80,
          r: 50,
          b: 80,
          pad: 15,
        },
      };

      Plotly.newPlot(this.id, traces, layout);
    },
    barHoverText(data) {
      const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      let min = Math.min(...data);
      let max = Math.max(...data);
      let now = new Date(Date.now());
      let text = [];

      // nommage des barres de l'histogramme
      if (this.pas === 24) {
        // Ajd   Hier   Lun Mar Mer Jeu Ven Sam Dim XX
        for (let i = min; i <= max; i++) {
          if (i === 0) text.push("Ajd");
          else if (i === -1) text.push("Hier");
          else {
            let d = new Date(now);
            d.setDate(d.getDate() + i);
            text.push(`${jours[d.getDay()]} ${d.getDate()}`);
          }
        }
      } else if (this.pas === 12) {
        // Adj AM    Hier PM     Lun ...
        let deca = now.getHours() >= 12 ? 0 : 1;

        for (let i = min - deca; i <= max - deca; i++) {
          if (i === 0 || i === -1)
            text.push(`Ajd ${i === 0 ? "après-midi" : "matin"}`);
          else if (i === -2 || i === -3)
            text.push(`Hier ${i === -2 ? "après-midi" : "matin"}`);
          else {
            let d = new Date(now);
            d.setDate(d.getDate() + Math.trunc(i / 2));
            text.push(
              `${jours[d.getDay()]} ${d.getDate()} ${
                i / 2 - Math.trunc(i / 2) === -0.5 ? "matin" : "après-midi"
              }`
            );
          }
        }
      } else {
        //Adj 12h-15h ...  Lun XX 12h15-12h30
        let deca = 0;
        if (this.pas > 1) {
          deca = 24 / this.pas - Math.ceil((now.getHours() + 0.1) / this.pas);
        } else {
          deca =
            24 / this.pas -
            now.getHours() / this.pas -
            Math.ceil(now.getMinutes() / (this.pas * 60));
        }

        for (let i = min - deca; i <= max - deca; i++) {
          if (i <= 0 && i >= -(24 / this.pas) + 1)
            text.push(
              `Ajd ${this.formatHours(
                (24 + (i - 1) * this.pas) % 24
              )}-${this.formatHours((24 + i * this.pas) % 24)}`
            );
          else if (i <= -(24 / this.pas) && i >= -((24 / this.pas) * 2) + 1)
            text.push(
              `Hier ${this.formatHours(
                (24 + ((i % (24 / this.pas)) - 1) * this.pas) % 24
              )}-${this.formatHours(
                (24 + (i % (24 / this.pas)) * this.pas) % 24
              )}`
            );
          else {
            let d = new Date(now);
            d.setDate(d.getDate() + Math.trunc(i / 4));
            let t1 = (24 + ((i % (24 / this.pas)) - 1) * this.pas) % 24;
            let t2 = (24 + (i % (24 / this.pas)) * this.pas) % 24;
            if (this.pas >= 1) {
              text.push(`${jours[d.getDay()]} ${d.getDate()} ${t1}h-${t2}h`);
            } else {
              text.push(
                `${jours[d.getDay()]} ${d.getDate()} ${this.formatHours(
                  t1
                )}-${this.formatHours(t2)}`
              );
            }
          }
        }
      }
      return text;
    },
    formatHours(h) {
      let minutes = ((h - Math.floor(h)) * 60) % 60;
      return `${Math.floor(h)}h${minutes > 0 ? minutes : ""}`;
    },
  },
};
</script>

<style scoped>
div {
  width: 100%;
  margin-top: 20px;
}
</style>
