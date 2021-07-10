const mongoose = require("mongoose");
const Users = require("./model/users");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/dotenv.env" });
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("connected to Database");

async function deleteMany() {
  const del = await Users.deleteMany();
  console.log(del);
}

async function allUser() {
  const user = await Users.find();
  console.log(user);
}

if (process.argv[2] === "-d") {
  deleteMany();
}
if (process.argv[2] === "-a") {
  allUser();
}
