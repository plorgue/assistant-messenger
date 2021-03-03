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
              @click.native="
                () => {
                  if (!loadingMessage) loadMessages();
                }
              "
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
          <Line />
          <div id="result-container" v-if="convSelected.messages.length > 0">
            <p>
              {{
                `${
                  convSelected.messages.length
                } messages envoyé depuis ${formatDate(
                  convSelected.messages[0].when
                )}`
              }}
            </p>
            <div
              id="topMessage-container"
              v-if="topMessage[0].message !== null"
            >
              <aff-message
                v-for="message in topMessage"
                v-bind:key="message.id"
                :titre="message.titre"
                :auteur="message.message.who"
                :quand="formatDate(message.message.when)"
                :contenu="message.message.what"
                :nombre="message.nombre"
              />
            </div>
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
                convSelected = null;
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
import Line from "../components/Line.vue";
import AffMessage from "../components/AffMessage.vue";

export default {
  components: { ButtonConv, Line, AffMessage },
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
      topMessage: [
        {
          id: 1,
          titre: "Le plus de réaction",
          message: null,
          nombre: 0,
        },
        {
          id: 2,
          titre: "Le plus de pouce",
          message: null,
          nombre: 0,
        },
        {
          id: 3,
          titre: "Le plus long message",
          message: null,
          nombre: 0,
        },
      ],
    };
  },
  methods: {
    loadMessages() {
      if (this.password !== "") {
        this.loadingMessage = true;
        fetch(
          //`http://localhost:3000/messages/${this.password}/${this.convSelected.id}/${this.nbScroll}`,
          "http://localhost:3000/messages/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        )
          .then((response) => response.json())
          .then((json) => {
            this.loadingMessage = false;
            this.convSelected.messages = json;
            this.findTopMessages();
          });
      }
    },
    findTopMessages() {
      let topPouce = 0;
      let topFeedback = 0;
      let topLength = 0;
      let msgTopPouce, msgTopFeedback, msgTopLength;
      this.convSelected.messages.forEach((message) => {
        if (message.whatType !== "Non Texte") {
          if (message.what.length > topLength) {
            topLength = message.what.length;
            msgTopLength = message;
          }
          if (message.feedback.length > topFeedback) {
            topFeedback = message.feedback.length;
            msgTopFeedback = message;
          }
          if (
            message.feedback.length > topPouce &&
            message.feedback[0] === "👍"
          ) {
            topPouce = message.feedback.length;
            msgTopPouce = message;
          }
        }
      });
      this.topMessage[0].message = msgTopFeedback;
      this.topMessage[0].nombre = topFeedback;
      this.topMessage[1].message = msgTopPouce;
      this.topMessage[1].nombre = topPouce;
      this.topMessage[2].message = msgTopLength;
      this.topMessage[2].nombre = topLength;
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
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
#result-container {
  padding: 16px 16px 0 64px;
}
</style>
