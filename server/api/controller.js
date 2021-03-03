const Conversation = require("./conversation.model.js");

exports.getMessages = (req, res) => {
  Conversation.getMessages(
    req.params.conv,
    req.params.scroll,
    req.params.pwd,
    (err, messages) => {
      if (err)
        res.status(500).send({
          message: err.message || "error lors de la récupération des messages",
        });
      else res.send(messages);
    }
  );
};

exports.getMessagesStored = (req, res) => {
  Conversation.getMessagesStored((err, messages) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "error lors de la récupération des messages stocker",
      });
    else res.send(messages);
  });
};
