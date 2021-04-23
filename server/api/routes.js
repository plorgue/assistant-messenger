module.exports = (app) => {
  const controller = require("./controller.js");

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/messages/:pwd/:conv/:scroll", controller.getMessages);
  app.get("/messages/:conv", controller.getMessagesStored);
  app.get("/messages/:pwd/:user/:conv/:scroll", controller.getGuessMessages);
};
