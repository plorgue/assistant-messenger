<template>
  <div id="graph">
    <graph-temps
      id="graphFeedback"
      :data1="data1"
      :data2="data2"
      :pas="pas"
      :title="`Fréquence de réaction`"
      :xlabel="
        `Temps depuis l'envoie: graduation*${pas}h (une barre = ${pas}h)`
      "
      :ylabel="`Nombre de réactions`"
      color1="rgba(46,139,87,1)"
      color2="rgb(255, 116, 116)"
    />
  </div>
</template>

<script>
import GraphTemps from "./GraphTemps.vue";

export default {
  components: { GraphTemps },
  props: { messages: Object, pas: Number },
  computed: {
    data1() {
      let data = [];
      // comptage du nombre de réaction par tranche horraire
      this.messages.forEach((msg) => {
        let nbFeedbacks = msg.feedback.length;
        let x = this.tempsEnPasdeDuréeDepuisMtn(new Date(msg.when));
        data.push(...new Array(nbFeedbacks).fill(x, 0, nbFeedbacks));
      });

      return data;
    },
    data2() {
      const seriousEmoji = [
        "🖐",
        "✋",
        "🤚",
        "🤙",
        "👈",
        "👉",
        "👆",
        "👇",
        "☝",
        "👍",
        "👎",
        "👏",
        "🙌",
        "👐",
        "💪",
        "👀",
        "😮",
        "😯",
        "🙋",
        "🙋‍♂️",
        "🙋‍♀️",
        "🤷‍♀️",
        "🤷‍♂️",
        "🤷",
        "🙅",
        "🙅‍♂️",
        "🙅‍♀️",
        "🙆",
        "🙆‍♂️",
        "🙆‍♀️",
        "💁",
        "💁‍♂️",
        "💁‍♀️",
        "🤦‍♀️",
        "🤦‍♂️",
        "🤦",
        "❤",
      ];
      let data = [];
      // comptage du nombre de réaction par tranche horraire
      this.messages.forEach((msg) => {
        let tag = false;
        if (msg.feedback.length > 0) {
          tag = msg.feedback.some((fdbk) => {
            return seriousEmoji.includes(fdbk);
          });
        }
        if (tag) {
          let x = this.tempsEnPasdeDuréeDepuisMtn(new Date(msg.when));
          data.push(x);
        }
      });

      return data;
    },
  },
  methods: {
    formatHours(h) {
      let minutes = ((h - Math.floor(h)) * 60) % 60;
      return `${Math.floor(h)}h${minutes > 0 ? minutes : ""}`;
    },
    tempsEnPasdeDuréeDepuisMtn(date) {
      let now = new Date(Date.now());
      let offset = 0;
      if (this.pas > 1) {
        offset =
          (((now.getHours() % this.pas) * 60 + now.getMinutes()) * 60 +
            now.getSeconds()) *
          1000;
      } else {
        offset =
          ((now.getMinutes() % (this.pas * 60)) * 60 + now.getSeconds()) * 1000;
      }
      return Math.trunc(
        (date - now + offset) / (1000 * 60 * 60 * this.pas) - 1
      );
    },
  },
};
</script>

<style scoped>
#graphF {
  width: 100%;
}
</style>
