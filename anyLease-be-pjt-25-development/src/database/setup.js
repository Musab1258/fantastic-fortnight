const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/dotenv.env" });
const { MONGO_URI } = process.env;

async function connectDb() {
  await mongoose.connect(MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to Database");
}

module.exports = connectDb;
