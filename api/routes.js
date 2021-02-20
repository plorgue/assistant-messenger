module.exports = (app) => {
  const controller = require("./controller.js");

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/:conv/:scroll", controller.getMessages);
};
