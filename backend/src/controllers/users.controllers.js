const userControl = {};

const User = require("../models/Users.model");

userControl.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

userControl.getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.json(user);
};

userControl.userRegister = async (req, res) => {
  const { phoneNumber, numCedula, firma, frontImg, backImg } = req.body;
  try {
    const oldUser = await User.findOne({ numCedula });
    if (oldUser) {
      return res.send({ error: "User Exist" });
    }
    await User.create({
      phoneNumber,
      numCedula,
      firma,
      frontImg,
      backImg,
    });
    res.send({ status: "Ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
};

userControl.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

module.exports = userControl;
