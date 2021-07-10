const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "name must not contain character"],
      minlength: 3,
      maxlength: 50,
      match: /[a-zA-Z]{3,}/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
      match:
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 11,
      maxlength: 11,
      unique: true,
    },
    isAdmin: Boolean,
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    // avatar: {
    //   type: String,
    //   default:
    //     "https://res.cloudinary.com/dddj0ycqp/image/upload/v1624604647/sample.jpg",
    // },
  },
  {
    timestamps: true,
  }
);
//hashing of password
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//creating a jwt token
userSchema.methods.generateAuthToken = function (privateKey, time) {
  const payload = {
    _id: this._id,
    fullName: this.fullName,
    isAdmin: this.isAdmin,
  };
  return jwt.sign(payload, privateKey, { expiresIn: time });
};
const Users = mongoose.model("user", userSchema);
module.exports = Users;
