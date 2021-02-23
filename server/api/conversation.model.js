const { scrapping } = require("../utils/scrapping.js");

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

module.exports = Conversation;
