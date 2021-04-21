<template>
  <div id="main-container">
    <h1>Assistant Messenger 🚀</h1>
    <div class="flex-horizontal">
      <div id="left-container">
        <p v-if="$store.state.convSelected === null">
          Selectionner une conversation
        </p>
        <div v-else>
          <PanneauHorizontal />
          <DetailConversation />
        </div>
      </div>
      <SelectionConversation />
    </div>
  </div>
</template>

<script>
import PanneauHorizontal from "../components/panneau_horizontal/PanneauHorizontal";
import DetailConversation from "../components/detail_conversation/DetailConversation";
import SelectionConversation from "../components/selection_conversation/SelectionConversation.vue";

export default {
  components: {
    PanneauHorizontal,
    DetailConversation,
    SelectionConversation,
  },
};
</script>

<style scoped>
#main-container {
  height: 100%;
  width: 97%;
  margin: 0 0 0 2%;
  font-family: Arial, Helvetica, sans-serif;
  color: #505a50;
}
#left-container {
  width: 74%;
  align-self: flex-start;
}
.box {
  background-color: #eeeeee;
  border-radius: 5px;
  padding-bottom: 30px;
}
h1 {
  margin: 20px;
  line-height: 40px;
}
h3 {
  line-break: anywhere;
  line-height: 20px;
  height: 20px;
  overflow: hidden;
}
.flex-horizontal {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
/* #scroll-selector {
  height: fit-content;
  font-weight: bold;
}
#scroll-selector:hover {
  cursor: pointer;
  background-color: #eeeeee;
}
#btn-load-msg {
  margin-top: -6px;
} */
</style>
