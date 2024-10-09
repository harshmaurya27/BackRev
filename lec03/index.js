const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting up static file

app.use(express.static(path.join(__dirname, "public")));

// view engine

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

//dynamic routing
app.get("/profile/:username", (req, res) => {
  res.send(`welcome, ${req.params.username}`);
});

app.get("/profile/:username/:id", (req, res) => {
  res.send(req.params);
});

app.listen(3000, () => {
  console.log("server is running");
});
