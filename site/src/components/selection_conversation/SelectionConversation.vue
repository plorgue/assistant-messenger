<template>
  <div id="right-container" class="box">
    <h2>Conversations</h2>

    <switch-toggle
      class="switch"
      title="Compte visiteur"
      @checked="(value) => switchVisiteur(value)"
    />

    <div class="flex-vertical" v-if="!isVisiteurMode">
      <button-rounded
        v-for="conv in conversations"
        v-bind:key="conv.id"
        :content="conv.name"
        :isSelected="
          $store.state.convSelected !== null &&
          $store.state.convSelected.id === conv.id
            ? true
            : false
        "
        @click.native="clickButton(conv)"
      />
    </div>
    <div v-else class="flex-vertical ">
      <input
        class="rounded-input"
        v-model="idVisiteur"
        placeholder="Identifiant Facebook"
        type="email"
      />
      <input
        class="rounded-input"
        v-model="passwordVisiteur"
        placeholder="Mot de passe Facebook"
        type="password"
      />
      <input
        class="rounded-input"
        v-model="idConvVisiteur"
        placeholder="Id conversation"
      />
      <button-rounded
        class="button-validate"
        content="Valider"
        size="s"
        @click="submit"
      />
    </div>
  </div>
</template>

<script>
import ButtonRounded from "../ButtonRounded.vue";
import SwitchToggle from "./selection_conversation_components/SwitchToggle.vue";
export default {
  components: { SwitchToggle, ButtonRounded },
  data() {
    return {
      isVisiteurMode: false,
      passwordVisiteur: "",
      idConvVisiteur: "",
      idVisiteur: "",
    };
  },
  computed: {
    conversations: function() {
      let conv = this.$store.state.conversations;
      let mainConv = [];
      conv.forEach((element) => {
        if (element.id.length > 0) {
          mainConv.push(element);
        }
      });
      return mainConv;
    },
  },
  methods: {
    clickButton(conv) {
      if (this.$store.state.convSelected === conv) {
        this.$store.commit("newConvSelected", null);
      } else {
        this.$store.commit("newConvSelected", conv);
      }
    },
    switchVisiteur(isCheck) {
      this.isVisiteurMode = isCheck;
    },
    submit() {
      if (
        this.isVisiteurMode &&
        this.idConvVisiteur.length > 0 &&
        this.passwordVisiteur.length > 0 &&
        this.idVisiteur.length > 0
      ) {
        this.$store.dispatch("visiteurConvSelected", [
          this.idVisiteur,
          this.passwordVisiteur,
          this.idConvVisiteur,
        ]);
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
.flex-vertical {
  display: flex;
  flex-direction: column;
  align-self: center;
}
.switch {
  margin-top: 16px;
  margin-left: 10px;
  margin-bottom: 16px;
}
.button-validate {
  align-self: flex-end;
}
</style>
