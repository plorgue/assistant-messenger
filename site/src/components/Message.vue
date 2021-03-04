<template>
  <div id="container" :style="msgStyle">
    <div id="header">
      {{ auteur }}<br />
      {{ date }}<br />
      {{ getReaction(reaction) }}
      {{ reaction.length > 0 ? `(${reaction.length})` : "" }}
    </div>
    <p id="message">
      {{ contenu }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    color: String,
    auteur: String,
    reaction: Array,
    date: String,
    contenu: String,
  },
  methods: {
    getReaction(reaction) {
      let str = "";
      reaction.forEach((element) => {
        if (str.length === 0) {
          str = str + element;
        } else {
          str = str + " " + element;
        }
      });
      return str;
    },
  },
  computed: {
    msgStyle() {
      return {
        "background-color": this.color,
      };
    },
  },
};
</script>

<style scoped>
#container {
  margin: 3px;
  padding: 8px;
  border-radius: 15px;
}
#header {
  font-size: 12px;
  color: #222;
  font-weight: bold;
}
#message {
  font-size: 11px;
  color: #444;
  margin: 5px 0 2px 0;
  overflow-x: hidden;
}
</style>
