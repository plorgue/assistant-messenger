<template>
  <div id="main-container">
    <h1>Assistant Messenger 🚀</h1>
    <div class="flex-horizontal">
      <div id="left-container" class="flex">
        <p v-if="convSelected === null">Selectionner une conversation</p>
        <div v-else>
          <h2>{{ convSelected.name }}</h2>
          <div class="flex-horizontal">
            <button-conv
              content="Charger derniers messages"
              size="s"
              @click.native="loadMessages"
            />
            <img
              id="loading-img"
              src="../assets/loading.png"
              :style="`opacity: ${loadingMessage ? 1 : 0}`"
            />
            <div id="select-container">
              <p class="">Nombre de scroll:</p>
              <select
                id="scroll-selector"
                class="rounded-input"
                v-model="nbScroll"
              >
                <option
                  v-for="i in [...Array(20).keys()].map((x) => x + 1)"
                  v-bind:key="i"
                  :value="i"
                  >{{ i }}</option
                >
              </select>
            </div>
            <input
              v-model="password"
              class="rounded-input"
              placeholder="Mot de passe"
              type="password"
            />
          </div>
        </div>
      </div>
      <div id="right-container">
        <h2>Conversations</h2>
        <button-conv
          v-for="conv in conversations"
          v-bind:key="conv.id"
          :content="conv.name"
          :isSelected="
            convSelected !== null && convSelected.id === conv.id ? true : false
          "
          class="btn-conv"
          @click.native="
            () => {
              if (convSelected === conv) {
                conv = null;
              } else {
                convSelected = conv;
              }
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonConv from "../components/ButtonConv.vue";

export default {
  components: { ButtonConv },
  data() {
    return {
      loadingMessage: false,
      password: "",
      convSelected: null,
      nbScroll: 1,
      conversations: [
        {
          name: "BDE",
          id: "2783966814983840",
          messages: [],
        },
        {
          name: "BDS",
          id: "3181338375224277",
          messages: [],
        },
        {
          name: "KERMESS",
          id: "2258131307637099",
          messages: [],
        },
        {
          name: "TEAM WEI",
          id: "3363123163702478",
          messages: [],
        },
      ],
    };
  },
  methods: {
    loadMessages() {
      if (this.password !== "") {
        this.loadingMessage = true;
        fetch(
          `http://localhost:3000/messages/${this.password}/${this.convSelected.id}/${this.nbScroll}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        )
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            this.loadingMessage = false;
          });
      }
    },
  },
};
</script>

<style scoped>
#main-container {
  height: 100%;
  width: 90%;
  margin: 0 5% 0 5%;
  font-family: Arial, Helvetica, sans-serif;
  color: #505a50;
}
#left-container {
  width: 72%;
  height: 1000px;
}
#right-container {
  position: sticky;
  align-self: flex-start;
  top: 60px;
  margin-top: 20px;
  width: 25%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  border-left: 2px solid gray;
}
h1 {
  margin: 20px;
}
.flex-horizontal {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.btn-conv {
  align-self: center;
}
h2 {
  margin-left: 20px;
}
#select-container {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
#scroll-selector {
  height: fit-content;
  font-weight: bold;
}
#scroll-selector:hover {
  cursor: pointer;
  background-color: #eeeeee;
}
.rounded-input {
  height: fit-content;
  padding: 10px;
  margin-top: 20px;
  margin-left: 16px;
  border-radius: 15px;
  border: 1px solid #222;
  outline: 0;
  font-size: 14px;
  color: #505a50;
  background-color: whitesmoke;
}
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
