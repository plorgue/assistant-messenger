const { resourceLimits } = require("worker_threads");

const Conversation = function (conversation) {
  this.id = conversation.id;
};

Conversation.getMessages = (idConv, nbScroll, result) => {
  console.log(`Conversation: ${idConv}, Scroll: ${nbScroll}`);
  result(null, "ok");
  return;
};

module.exports = Conversation;
