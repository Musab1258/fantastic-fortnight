require("express-async-errors");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config/dotenv.env" });
const connectDb = require("./src/database/setup");
const router = require("./route/users");
const { Confirm_Email } = require("./route/emailConfirmation");
const { Login } = require("./route/login");
const { Forget } = require("./route/forgetPassword");
const { resetPassword } = require("./route/resetPassword");
const { UserInfo } = require("./route/getinfo");
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.use("/", Confirm_Email);
app.use("/", Login);
app.use("/", Forget);
app.use("/", resetPassword);
app.use("/", UserInfo);
const error = require("./middleware/error");

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cookieParser());
app.use(error);

const { PORT } = process.env;
const port = process.env.PORT || PORT;
app.listen(port, () => console.log(`listening at port ${port}`));
