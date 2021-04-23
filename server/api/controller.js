const Conversation = require("./model.js");

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
      else res.send([{ messages: messages, idConv: req.params.conv }]);
    }
  );
};

exports.getMessagesStored = (req, res) => {
  Conversation.getMessagesStored(req.params.conv, (err, messages) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "error lors de la récupération des messages stocker",
      });
    else res.send([{ messages: messages, idConv: req.params.conv }]);
  });
};

exports.getGuessMessages = (req, res) => {
  Conversation.getGuessMessages(
    req.params.conv,
    req.params.scroll,
    req.params.pwd,
    req.params.user,
    (err, messages) => {
      if (err)
        res.status(500).send({
          messages:
            err.message ||
            "error lors de la récupération des messages sur le compte saisi",
        });
      else res.send([{ messages: messages, idConv: req.params.conv }]);
    }
  );
};
