require("dotenv").config({
  path: "./.env.local",
});
const app = require("./micro/server");
app.listen(4000);
console.log("Listening on port 4000");
