const express = require("express");
const router = express.Router();
const User = require("../models/Users.model");

// get obtener
// post crear
// get ID  obtiene 1
// put actualizar
// delete borrar

// create user
router.post("/user/register", async (req, res) => {
  const user = await User(req.body);
  user.save().then((data) => res.json(data));
});

// get al users
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
router.get("/user/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.json(user);
});
router.delete("/user/delete/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json(user);
});

module.exports = router;
