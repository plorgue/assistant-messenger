<template>
  <div id="graph">
    <graph-temps
      id="graphNbMsg"
      :data="data"
      :pas="pas"
      title="Fréquence de nouveaux messages"
      :xlabel="
        `Temps depuis l'envoie: graduation*${pas}h (une barre = ${pas}h)`
      "
      ylabel="Nombre de messages"
      color="rgba(54, 168, 235, 1)"
    />
  </div>
</template>

<script>
import GraphTemps from "./GraphTemps.vue";

export default {
  components: { GraphTemps },
  props: { messages: Object, pas: Number },
  computed: {
    data() {
      let data = [];
      let now = new Date(Date.now());
      // comptage du nombre de message par tranche horraire
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

      return data;
    },
  },
};
</script>

<style scoped>
#graph {
  width: 100%;
}
</style>
