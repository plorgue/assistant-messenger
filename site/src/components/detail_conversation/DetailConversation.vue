<template>
  <div id="conv-container" class="flex-horizontal">
    <div
      id="result-container"
      v-if="$store.state.convSelected.messages.length > 0"
    >
      <!-- Affichage de chiffres clé sur les messages récupérés -->
      <h3>
        Chiffres
        clés________________________________________________________________
      </h3>
      <p>
        {{
          `${
            $store.state.convSelected.messages.length
          } messages envoyé depuis ${formatDate(
            $store.state.convSelected.messages[0].when
          )} soit en ${formatDuration(
            $store.state.convSelected.messages[0].when,
            Date.now()
          )}`
        }}<br />
        {{ `Longeur moyenne d'un message: ${avgMsgLength()} caractères` }}
      </p>
      <!-- Affichage des messages particuliers -->
      <h3>
        Messages
        particuliers_________________________________________________________
      </h3>
      <div id="topMessage-container">
        <aff-message
          v-for="message in findTopMessages()"
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
          >
            {{ pasGraph[i][0] }}
          </option>
        </select>
      </div>
      <graph-nb-tps
        :messages="$store.state.convSelected.messages"
        :pas="pasGraph[idPasGraph][1]"
      />
      <graph-feedback-tps
        :messages="$store.state.convSelected.messages"
        :pas="pasGraph[idPasGraph][1]"
      />
      <graph-serious-feedback-tps
        :messages="$store.state.convSelected.messages"
        :pas="pasGraph[idPasGraph][1]"
      />
      <graph-interlocuteur :messages="$store.state.convSelected.messages" />
      <div>
        <br />
      </div>
    </div>
    <!-- Liste message sous forme de conv -->
    <div
      id="messages-container"
      class="box"
      v-if="$store.state.convSelected.messages.length > 0"
    >
      <message
        v-for="msg in $store.state.convSelected.messages"
        v-bind:key="msg.when"
        :color="$store.state.convSelected.interlocuteurs.get(msg.who)"
        :auteur="msg.who"
        :date="formatDate(msg.when)"
        :contenu="msg.what"
        :reaction="msg.feedback"
      />
    </div>
  </div>
</template>

<script>
import AffMessage from "./detail_conversation_components/MessageParticulier.vue";
import Message from "./detail_conversation_components/Message.vue";
import GraphSeriousFeedbackTps from "./detail_conversation_components/GraphSeriousFeedbackTps.vue";
import GraphFeedbackTps from "./detail_conversation_components/GraphFeedbackTps.vue";
import GraphInterlocuteur from "./detail_conversation_components/GraphInterlocuteur.vue";
import GraphNbTps from "./detail_conversation_components/GraphNbTps.vue";

export default {
  components: {
    AffMessage,
    GraphNbTps,
    GraphFeedbackTps,
    GraphSeriousFeedbackTps,
    GraphInterlocuteur,
    Message,
  },
  data() {
    return {
      idPasGraph: 1,
      pasGraph: [
        ["jour", 24],
        ["demi-journée", 12],
        ["6 heures", 6],
        ["2 heures", 2],
        ["1 heures", 1],
        ["30 min", 0.5],
        ["15 min", 0.25],
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
      if (this.$store.state.convSelected.messages !== null) {
        let L = 0;
        this.$store.state.convSelected.messages.forEach((msg) => {
          if (msg.whatType === "Texte") {
            L += msg.what.length;
          }
        });
        return Math.round(L / this.$store.state.convSelected.messages.length);
      }
      return -1;
    },
    findTopMessages() {
      let topMessage = [
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
      ];
      let topPouce = 0;
      let topFeedback = 0;
      let topLength = 0;
      let msgTopPouce, msgTopFeedback, msgTopLength;
      this.$store.state.convSelected.messages.forEach((message) => {
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
      topMessage[0].message = msgTopFeedback;
      topMessage[0].nombre = topFeedback;
      topMessage[1].message = msgTopPouce;
      topMessage[1].nombre = topPouce;
      topMessage[2].message = msgTopLength;
      topMessage[2].nombre = topLength;
      return topMessage;
    },
  },
  computed: {},
};
</script>

<style scoped>
h3 {
  line-break: anywhere;
  line-height: 20px;
  height: 20px;
  overflow: hidden;
}
#result-container {
  padding: 16px 16px 0 16px;
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
</style>
