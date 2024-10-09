const mongoose = require("mongoose");

try {
  mongoose.connect(
    "mongodb+srv://mauryaharsh464:testProject01@cluster0.3nkb3.mongodb.net/testProject"
  );

  console.log("db is connected successfully");
} catch (error) {
  console.error("error in connecting db :", error);
}

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  age: Number,
  email: String,
  password: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
