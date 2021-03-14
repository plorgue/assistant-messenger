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
  if (messages.length > 150) {
    fs.writeFileSync(
      `store/${messages.length}__${(
        "" + new Date(messages[0].when).toLocaleString()
      )
        .replace(" à ", "_")
        .replace("/", "-")
        .replace("/", "-")
        .replace(":", "-")
        .replace(":", "-")}.json`,
      JSON.stringify(messages)
    );
  }
  console.log("Messages envoyés");
  result(null, JSON.stringify(messages));
  return;
};

Conversation.getMessagesStored = (result) => {
  console.log("Envoi message conversation type");
  let rawdata = fs.readFileSync("store/716__03-03-2021_10-26-18.json", "utf8");
  result(null, JSON.parse(rawdata));
};

module.exports = Conversation;
