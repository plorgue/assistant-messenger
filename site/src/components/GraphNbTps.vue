<template>
  <div id="graph">
    <graph-temps :data="data" :pas="pas" />
  </div>
</template>

<script>
import GraphTemps from "./GraphTemps.vue";

export default {
  components: { GraphTemps },
  props: { messages: Object, pas: Number },
  computed: {
    data() {
      console.log(this.pas);
      let data = [];
      //TODO mettre changement de jour à 5h00 du mat
      let now = new Date(Date.now());
      this.messages.forEach((msg) => {
        let date = new Date(msg.when);
        let offset =
          (((now.getHours() % this.pas) * 60 + now.getMinutes()) * 60 +
            now.getSeconds()) *
          1000;
        let x = (date - now + offset) / (1000 * 60 * 60 * this.pas) - 1;
        data.push(Math.trunc(x));
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
