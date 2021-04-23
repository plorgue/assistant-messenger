const { scrapping } = require("../utils/scrapping.js");
const fs = require("fs");

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
  console.log(`${messages.length} messages envoyés`);
  result(null, messages);
  return;
};

Conversation.getMessagesStored = (idConv, result) => {
  let jsonFile = "store/bde_conv_.json";
  switch (idConv) {
    case "2783966814983840": //BDE
      jsonFile = "store/bde_conv_177.json";
      break;
    case "3181338375224277": // BDS
      jsonFile = "store/bds_conv_48.json";
      break;
    case "2258131307637099": //Kermess
      jsonFile = "store/bde_conv_5132.json";
      break;
    case "3363123163702478": // Team wei
      jsonFile = "store/teamwei_231.json";
      break;
  }

  console.log("Envoi message conversation type");
  let rawdata = fs.readFileSync(jsonFile, "utf8");
  result(null, JSON.parse(rawdata));
};

Conversation.getGuessMessages = async function (
  idConv,
  nbScroll,
  pwd,
  user,
  result
) {
  console.log(
    `Conversation: ${idConv}, Scroll: ${nbScroll}, Compte visiteur: ${user}`
  );
  let messages = await scrapping(idConv, nbScroll, pwd, user);
  console.log("Messages envoyés");
  result(null, messages);
  return;
};

module.exports = Conversation;
