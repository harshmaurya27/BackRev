// Express.js framework
// Express =>> npm package ==> Framework =>> flow => manages request and response

const express = require("express");

const app = express();
app.use((req, res, next) => {
  console.log("this the middleware");
  next();
}); // sre route se pahale ye chalega

app.get("/", (req, res) => {
  res.send("hello world this the world and ther is some change in this world");
});

app.get("/profile", (req, res, next) => {
  return next(new Error("Not implemented"));
});

app.use((err, req, res, next) => {
  res.status(500).send("Something went wrong");
});

app.listen(3000, () => {
  console.log("server is running");
});
