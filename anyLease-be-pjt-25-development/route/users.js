const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Users = require("../model/users");
require("dotenv").config();
const sendEmail = require("../utils/sendMail");
const passwordComplexity = require("joi-password-complexity").default;

router.post("/api/signup", async (req, res) => {
  //destructure the dotenv
  const { ACTIVATION_TOKEN_SECRET, CLIENT_URL } = process.env;
  //destructure the req.body object
  const { email, phone } = req.body;

  const { error } = validateUsers(req.body);
  if (error) return res.status(401).send(error.details[0].message);
  let user = await Users.findOne({ email });
  if (user) return res.status(401).send("email already in use ");
  user = await Users.findOne({ phone });
  if (user) return res.status(401).send("phone number already in use ");
  user = await new Users(req.body);
  let result = await user.save();

  //the jwt.sign was added as a method within the users model
  let createActivationToken = result.generateAuthToken(
    ACTIVATION_TOKEN_SECRET,
    "12m"
  );
  const url = `${CLIENT_URL}/confirmation/${createActivationToken}`;
  console.log(url);
  //send emai
  sendEmail(email, url, result.lastName);
  res
    .header("x-auth-token", createActivationToken)
    .status(200)
    .send("Register success! Please activate your email to start");
});
router.get("/", (req, res) => {
  res.json({
    name: "samuel ekene",
  });
});

function validateUsers(req) {
  const schemaUser = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().required().email(),
    password: passwordComplexity().required(),
    phone: Joi.string().min(11).required(),
  });
  return schemaUser.validate(req);
}

module.exports = router;
