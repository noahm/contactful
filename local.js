require("dotenv").config({
  path: "./.env.local",
});
process.env.PORT = 4000;
require("./micro/server");
console.log("Listening on port 4000");
