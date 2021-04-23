<template>
  <div class="box">
    <h2>{{ $store.state.convSelected.name }}</h2>
    <div class="flex-horizontal">
      <div class="select-container">
        <p>Nombre de scroll:</p>
        <select id="scroll-selector" class="rounded-input" v-model="nbScroll">
          <option
            v-for="i in [
              1,
              2,
              3,
              5,
              10,
              15,
              20,
              30,
              50,
              100,
              200,
              500,
              1000,
              20000,
            ]"
            v-bind:key="i"
            :value="i"
          >
            {{ i }}
          </option>
        </select>
      </div>
      <input
        v-if="!isVisiteurMode"
        v-model="password"
        class="rounded-input"
        placeholder="Mot de passe"
        type="password"
        @keypress.enter="loadMessages"
      />
      <button-rounded
        id="btn-load-msg"
        content="Charger derniers messages"
        size="s"
        @click.native="loadMessages"
      />
      <img
        id="loading-img"
        src="../../assets/loading.png"
        :style="`opacity: ${loadingMessage ? 1 : 0}`"
      />
    </div>
  </div>
</template>

<script>
import ButtonRounded from "../ButtonRounded.vue";
export default {
  components: {
    ButtonRounded,
  },
  props: {
    name: String,
  },
  data() {
    return {
      loadingMessage: false,
      password: "",
      nbScroll: 3,
    };
  },
  computed: {
    isVisiteurMode: function() {
      return this.$store.state.convSelected.name === "Compte visiteur";
    },
  },
  methods: {
    loadMessages() {
      if (
        !this.loadingMessage
        // && (this.password !== "" ||
        // this.$store.state.convSelected.name === "Compte visiteur"
        // )
      ) {
        let convSelected = this.$store.state.convSelected;
        this.loadingMessage = true;
        let mainUrl =
          this.password !== ""
            ? `http://localhost:3000/messages/${this.password}/${convSelected.id}/${this.nbScroll}`
            : `http://localhost:3000/messages/${convSelected.id}`;
        let visiteurUrl = `http://localhost:3000/messages/${convSelected.password}/${convSelected.userId}/${convSelected.id}/${this.nbScroll}`;
        fetch(this.isVisiteurMode ? visiteurUrl : mainUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => {
            this.loadingMessage = false;
            return response.json();
          })
          .then((json) => {
            let conv = json[0];
            conv.interlocuteurs = this.setInterlocuteurs(conv);
            this.$store.dispatch("newMessagesLoaded", conv);
            // this.$store.commit("newMessagesConvSelected", json);
            // this.$store.commit("newInterlocuteurs", this.setInterlocuteurs());
          })
          .catch((err) => console.log(err));
      }
    },
    setInterlocuteurs(conv) {
      const colors = [
        "#2E8B57", //seagreen
        "#DAA520", //goldenrod
        "#B22222", //firebrick
        "#008080", //teal
        "#006400", //darkgreen
        "#800000", //maroon
        "#1E90E0", //dodgerblue
        "#000080", //navy
        "#C71585", //mediumvioletred
        "#EE4500", //orangered
        "#556B2F", //darkolivegreen
        "#483D8B", //darkslateblue
        "#2F4F4F", //darkslategray
        "#D2691E", //chocolate
        "#C52222", //darkred
        "#800080", //purple
        "#BDB76B", //darkkhaki
        "#CD5C5C", //indianred
      ];
      let interlocuteurs = new Map();
      conv.messages.forEach((message) => {
        if (!interlocuteurs.has(message.who)) {
          interlocuteurs.set(
            message.who,
            colors[interlocuteurs.size % colors.length]
          );
        }
      });
      return interlocuteurs;
    },
  },
};
</script>

<style scoped>
#loading-img {
  width: 32px;
  height: 32px;
  align-self: center;
  margin-top: 15px;
  animation: spin 1.2s ease-in-out infinite;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
