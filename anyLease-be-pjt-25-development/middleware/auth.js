const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/dotenv.env" });
const { REFRESH_TOKEN_SECRET } = process.env;
function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied, no token provided");
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    req.user = decoded;
    next();
    //if the token provided is invalid it will throw an exception so we wrap it around a try catch block
  } catch (error) {
    res.status(400).send(`invalid token`);
  }
}

module.exports = auth;
