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
      let data = [];
      let date1 = new Date(this.messages[0].when);
      this.messages.forEach((msg) => {
        let date = new Date(msg.when);
        data.push(Math.round((date - date1) / (1000 * 60 * 60 * this.pas)));
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
