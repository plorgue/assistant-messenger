<template>
  <div id="right-container" class="box">
    <h2>Conversations</h2>

    <switch-toggle
      title="Compte visiteur"
      @checked="
        (value) => {
          isVisiteurMode = value;
        }
      "
    />

    <button-conv
      v-for="conv in $store.state.conversations"
      v-bind:key="conv.id"
      :content="conv.name"
      :isSelected="
        $store.state.convSelected !== null &&
        $store.state.convSelected.id === conv.id
          ? true
          : false
      "
      class="btn-conv"
      @click.native="clickButton(conv)"
    />
  </div>
</template>

<script>
import ButtonConv from "../ButtonConv.vue";
import SwitchToggle from "./selection_conversation_components/SwitchToggle.vue";
export default {
  components: { ButtonConv, SwitchToggle },
  data() {
    return {
      isVisiteurMode: false,
    };
  },
  methods: {
    clickButton(conv) {
      if (this.$store.state.convSelected === conv) {
        this.$store.commit("newConvSelected", null);
      } else {
        this.$store.commit("newConvSelected", conv);
      }
    },
  },
};
</script>

<style scoped>
#right-container {
  position: sticky;
  align-self: flex-start;
  top: 20px;
  width: 20%;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}
.btn-conv {
  align-self: center;
}
</style>
