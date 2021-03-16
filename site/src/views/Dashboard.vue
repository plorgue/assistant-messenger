<template>
  <div id="main-container">
    <h1>Assistant Messenger 🚀</h1>
    <div class="flex-horizontal">
      <div id="left-container">
        <p v-if="convSelected === null">Selectionner une conversation</p>
        <div v-else>
          <!-- Panneau horizontal pour pull des messages -->
          <div class="box">
            <h2>{{ convSelected.name }}</h2>
            <div class="flex-horizontal">
              <div class="select-container">
                <p>Nombre de scroll:</p>
                <select
                  id="scroll-selector"
                  class="rounded-input"
                  v-model="nbScroll"
                >
                  <option
                    v-for="i in [1, 2, 3, 5, 10, 15, 20, 30, 50, 100, 200]"
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
                @keypress.enter="
                  () => {
                    if (!loadingMessage) loadMessages();
                  }
                "
              />
              <button-conv
                id="btn-load-msg"
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
            </div>
          </div>

          <!-- Détail de la conv sélectionné -->
          <div id="conv-container" class="flex-horizontal">
            <div id="result-container" v-if="convSelected.messages.length > 0">
              <!-- Affichage de chiffres clé sur les messages récupérés -->
              <h3>
                Chiffres
                clés________________________________________________________________
              </h3>
              <p>
                {{
                  `${
                    convSelected.messages.length
                  } messages envoyé depuis ${formatDate(
                    convSelected.messages[0].when
                  )} soit en ${formatDuration(
                    convSelected.messages[0].when,
                    Date.now()
                  )}`
                }}<br />
                {{
                  `Longeur moyenne d'un message: ${avgMsgLength()} caractères`
                }}
              </p>
              <!-- Affichage des messages particuliers -->
              <h3>
                Messages
                particuliers_________________________________________________________
              </h3>
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
              <!-- Affichage des graphiques -->
              <h3>
                Graphiques_______________________________________________________________
              </h3>
              <div class="select-container">
                <p>Pas temporel des graphiques:</p>
                <select class="rounded-input" v-model="idPasGraph">
                  <option
                    v-for="i in [...Array(pasGraph.length).keys()]"
                    v-bind:key="i"
                    :value="i"
                    >{{ pasGraph[i][0] }}</option
                  >
                </select>
              </div>
              <graph-nb-tps
                :messages="convSelected.messages"
                :pas="pasGraph[idPasGraph][1]"
              />
              <graph-feedback-tps
                :messages="convSelected.messages"
                :pas="pasGraph[idPasGraph][1]"
              />
              <graph-serious-feedback-tps
                :messages="convSelected.messages"
                :pas="pasGraph[idPasGraph][1]"
              />
              <graph-interlocuteur :messages="convSelected.messages" />
              <div>
                <br />
              </div>
            </div>
            <!-- Liste message sous forme de conv -->
            <div
              id="messages-container"
              class="box"
              v-if="convSelected.messages.length > 0"
            >
              <message
                v-for="msg in convSelected.messages"
                v-bind:key="msg.when"
                :color="convSelected.interlocuteurs.get(msg.who)"
                :auteur="msg.who"
                :date="formatDate(msg.when)"
                :contenu="msg.what"
                :reaction="msg.feedback"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Choix de la conv à afficher -->
      <div id="right-container" class="box">
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
import Message from "../components/Message.vue";
import GraphNbTps from "../components/GraphNbTps.vue";
import GraphFeedbackTps from "../components/GraphFeedbackTps.vue";
import GraphSeriousFeedbackTps from "../components/GraphSeriousFeedbackTps.vue";
import GraphInterlocuteur from "../components/GraphInterlocuteur.vue";

export default {
  components: {
    ButtonConv,
    Line,
    AffMessage,
    Message,
    GraphNbTps,
    GraphFeedbackTps,
    GraphSeriousFeedbackTps,
    GraphInterlocuteur,
  },
  data() {
    return {
      loadingMessage: false,
      password: "",
      convSelected: null,
      nbScroll: 1,
      pasGraph: [
        ["jour", 24],
        ["demi-journée", 12],
        ["6 heures", 6],
        ["2 heures", 2],
        ["1 heures", 1],
        ["30 min", 0.5],
        ["15 min", 0.25],
      ],
      idPasGraph: 1,
      conversations: [
        {
          name: "BDE",
          id: "2783966814983840",
          messages: [],
          interlocuteurs: new Map(),
        },
        {
          name: "BDS",
          id: "3181338375224277",
          messages: [],
          interlocuteurs: new Map(),
        },
        {
          name: "KERMESS",
          id: "2258131307637099",
          messages: [],
          interlocuteurs: new Map(),
        },
        {
          name: "TEAM WEI",
          id: "3363123163702478",
          messages: [],
          interlocuteurs: new Map(),
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
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
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
          .then((response) => {
            this.loadingMessage = false;
            return response.json();
          })
          .then((json) => {
            this.convSelected.messages = json;
            this.findTopMessages();
            this.setInterlocuteurs();
          })
          .catch((err) => console.log(err));
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
    setInterlocuteurs() {
      const colors = [
        "#FF9AA2",
        "#FFB7B2",
        "#FFDAC1",
        "#E2F0CB",
        "#B5EAD7",
        "#C7CEEA",
        "#FFDFD3",
        "#E0BBE4",
        "#E2FCE6",
        "#FFBAE4",
      ];
      let interlocuteurs = new Map();
      this.convSelected.messages.forEach((message) => {
        if (!interlocuteurs.has(message.who)) {
          interlocuteurs.set(
            message.who,
            colors[interlocuteurs.size % colors.length]
          );
        }
      });
      this.convSelected.interlocuteurs = interlocuteurs;
    },
    handleScroll(event) {
      let el = document.getElementById("messages-container");
      if (el !== null) {
        el.style.height =
          window.innerHeight - (el.offsetTop - window.scrollY) - 60 + "px";
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    formatDuration(date1, date2) {
      let d1 = new Date(date1);
      let d2 = new Date(date2);
      let durationInMillis = Math.abs(d2 - d1);
      if (durationInMillis > 259200000) {
        // 3 jours
        return `${Math.round(
          durationInMillis / (1000 * 60 * 60 * 24),
          1
        )} jours`;
      } else if (durationInMillis > 2160000) {
        // 6 heures
        return `${Math.round(durationInMillis / (1000 * 60 * 60), 1)} heures`;
      } else if (durationInMillis > 360000) {
        // 60 min
        return `${Math.floor(
          durationInMillis / (1000 * 60 * 60),
          1
        )}h${Math.round(durationInMillis / (1000 * 60))}min`;
      } else {
        return `${Math.round(durationInMillis / (1000 * 60))} minutes`;
      }
    },
    avgMsgLength() {
      if (this.convSelected.messages !== null) {
        let L = 0;
        this.convSelected.messages.forEach((msg) => {
          if (msg.whatType === "Texte") {
            L += msg.what.length;
          }
        });
        return Math.round(L / this.convSelected.messages.length);
      }
      return -1;
    },
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
#right-container {
  position: sticky;
  align-self: flex-start;
  top: 20px;
  width: 20%;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}
.box {
  background-color: #eeeeee;
  border-radius: 5px;
  padding-bottom: 30px;
}
#messages-container {
  position: sticky;
  align-self: flex-start;
  top: 20px;
  width: 300px;
  min-width: 300px;
  height: calc(100vh - 280px);
  margin-top: 10px;
  padding: 20px 10px 10px 20px;
  overflow-y: scroll;
}
h1 {
  margin: 20px;
  line-height: 40px;
}
h2 {
  padding: 20px 0 0 20px;
  margin: 0;
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
.btn-conv {
  align-self: center;
}
.select-container {
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
#btn-load-msg {
  margin-top: -6px;
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
  padding: 16px 16px 0 16px;
}
</style>
