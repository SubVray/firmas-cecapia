const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    numCedula: {
      type: String,
      unique: true,
      required: true,
    },
    firma: {
      type: String,
      required: true,
    },
    frontImg: {
      type: String,
      required: true,
    },
    backImg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
