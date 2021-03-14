<template>
  <div id="graph">
    <graph-temps :data="data" />
  </div>
</template>

<script>
import GraphTemps from "./GraphTemps.vue";

export default {
  components: { GraphTemps },
  props: { messages: Object, pas: Number },
  computed: {
    data() {
      const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      let data = [];
      let text = [];
      let now = new Date(Date.now());
      this.messages.forEach((msg) => {
        let date = new Date(msg.when);
        let offset = 0;
        if (this.pas > 1) {
          offset =
            (((now.getHours() % this.pas) * 60 + now.getMinutes()) * 60 +
              now.getSeconds()) *
            1000;
        } else {
          offset =
            ((now.getMinutes() % (this.pas * 60)) * 60 + now.getSeconds()) *
            1000;
        }
        let x = Math.trunc(
          (date - now + offset) / (1000 * 60 * 60 * this.pas) - 1
        );
        data.push(x);
      });
      if (this.pas === 24) {
        // Ajd   Hier   Lun Mar Mer Jeu Ven Sam Dim XX
        for (let i = Math.min(...data); i <= Math.max(...data); i++) {
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
        console.log(deca);
        for (
          let i = Math.min(...data) - deca;
          i <= Math.max(...data) - deca;
          i++
        ) {
          if (i === 0 || i === -1)
            text.push(`Ajd ${i === 0 ? "après-midi" : "matin"}`);
          else if (i === -2 || i === -3)
            text.push(`Hier ${i === -2 ? "après-midi" : "matin"}`);
          else {
            let d = new Date(now);
            d.setDate(d.getDate() + Math.trunc(i / 2));
            text.push(
              `${jours[d.getDay()]} ${d.getDate()} ${
                i / 2 - Math.trunc(i / 2) === -0.5 ? "après-midi" : "matin"
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
        console.log(deca);
        for (
          let i = Math.min(...data) - deca;
          i <= Math.max(...data) - deca;
          i++
        ) {
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

      return [data, text];
    },
  },
  methods: {
    formatHours(h) {
      let minutes = ((h - Math.floor(h)) * 60) % 60;
      return `${Math.floor(h)}h${minutes > 0 ? minutes : ""}`;
    },
  },
};
</script>

<style scoped>
#graph {
  width: 100%;
}
</style>
