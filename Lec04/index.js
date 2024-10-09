const express = require("express");
const userModel = require("./models/userModel");

const postModel = require("./models/postSchema");

const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//profile

app.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");

  // populate

  res.render("profile", { user });
});
app.get("/like/:id", isLoggedIn, async (req, res) => {
  const post = await postModel.findOne({ _id: req.params.id }).populate("user");

  if (post.likes.indexOf(req.user.id) === -1) {
    post.likes.push(req.user.id);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.id), 1);
  }

  await post.save();

  // populate

  res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
  const post = await postModel.findOne({ _id: req.params.id }).populate("user");

  res.render("edit", { post, user: post.user });
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
  const post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content }
  );

  res.redirect("/profile");
});

app.post("/post", isLoggedIn, async (req, res) => {
  const { content } = req.body;
  const user = await userModel.findOne({ email: req.user.email });

  const post = await postModel.create({
    user: user._id,
    content,
  });
  user.posts.push(post._id);
  await user.save();

  res.redirect("/profile");
});

app.post("/register", async (req, res) => {
  try {
    const { email, password, username, name, age } = req.body;
    const user = await userModel.findOne({ email });
    if (user) return res.status(500).send("User already exists");

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    let newUser = await userModel.create({
      name,
      username,
      password: hashedPassword,
      age,
      email,
    });

    // Generate JWT token
    const payload = { id: newUser._id, email: newUser.email };
    const token = jwt.sign(payload, "shhhh");
    res.cookie("token", token);

    res.send("user registered successfully");
  } catch (error) {
    console.error("error while registring the user", error);
    throw error;
  }
});

// login

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(500).send("something went wrong");

    const isPasswordCorrect = bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.redirect("/login");
    // Generate JWT token
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, "shhhh");
    res.cookie("token", token);

    res.status(200).redirect("/profile");
  } catch (error) {
    console.error("something went wrong while loggin ", error);
  }
});
app.get(" ", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") return res.redirect("/login");
  else {
    let data = jwt.verify(req.cookies.token, "shhhh");

    req.user = data;
  }
  next();
}

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
