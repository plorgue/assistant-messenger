import { createStore } from "vuex";

export default createStore({
  state: {
    convSelected: null,
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
      {
        name: "Compte visiteur",
        id: "",
        password: "",
        userId: "",
        messages: [],
      },
    ],
  },
  mutations: {
    newConvSelected(state, conv) {
      state.convSelected = conv;
    },
    newMessagesConvSelected(state, messages) {
      state.convSelected.messages = messages;
    },
    newInterlocuteurs(state, interlocuteurs) {
      state.convSelected.interlocuteurs = interlocuteurs;
    },
  },
  actions: {
    visiteurConvSelected({ state, commit }, params) {
      state.conversations[4].userId = params[0];
      state.conversations[4].password = params[1];
      state.conversations[4].id = params[2];
      commit("newConvSelected", state.conversations[4]);
    },
  },
  modules: {},
});
