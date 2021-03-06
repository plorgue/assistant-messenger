const express = require("express");
const cors = require("cors");
const app = express();

const port = 3000;

//cors config
app.use(cors());

require("./api/routes.js")(app);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
