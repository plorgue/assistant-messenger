const { scrapping } = require("../utils/scrapping.js");
const fs = require("fs");
const { raw } = require("express");

const Conversation = function (conversation) {
  this.id = conversation.id;
};

Conversation.getMessages = async function (idConv, nbScroll, pwd, result) {
  console.log(
    `Conversation: ${idConv}, Scroll: ${nbScroll}, Mot de passe: ${pwd}`
  );
  let messages = await scrapping(idConv, nbScroll, pwd);
  console.log("Messages envoyés");
  result(null, messages);
  return;
};

Conversation.getMessagesStored = (result) => {
  console.log("Envoi message conversation type");
  let rawdata = fs.readFileSync("store/messages_0224-121606.json", "utf8");
  result(null, JSON.parse(rawdata));
};

module.exports = Conversation;
