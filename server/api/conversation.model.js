const { scrapping } = require("./scrapping.js");

const Conversation = function (conversation) {
  this.id = conversation.id;
};

Conversation.getMessages = async function (idConv, nbScroll, pwd, result) {
  console.log(
    `Conversation: ${idConv}, Scroll: ${nbScroll}, Mot de passe: ${pwd}`
  );
  let messages = await scrapping(idConv, nbScroll, pwd);
  console.log(`Nombre de message charger: ${messages.length}`);
  result(null, messages);
  return;
};

module.exports = Conversation;
