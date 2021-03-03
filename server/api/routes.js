module.exports = (app) => {
  const controller = require("./controller.js");

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/messages/:pwd/:conv/:scroll", controller.getMessages);
  app.get("/messages/", controller.getMessagesStored);
};
