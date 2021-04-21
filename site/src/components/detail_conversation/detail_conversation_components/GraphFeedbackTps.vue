<template>
  <div id="graph">
    <graph-temps
      id="graphFeedback"
      :data="data"
      :pas="pas"
      :title="`Fréquence de réaction`"
      :xlabel="
        `Temps depuis l'envoie: graduation*${pas}h (une barre = ${pas}h)`
      "
      :ylabel="`Nombre de réactions`"
      color="rgba(220,20,60,1)"
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
      // comptage du nombre de réaction par tranche horraire
      this.messages.forEach((msg) => {
        let date = new Date(msg.when);
        let nbFeedbacks = msg.feedback.length;
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
        data.push(...new Array(nbFeedbacks).fill(x, 0, nbFeedbacks));
      });

      return data;
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
#graphF {
  width: 100%;
}
</style>
