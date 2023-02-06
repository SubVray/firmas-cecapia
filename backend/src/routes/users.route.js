const { Router } = require("express");
const router = Router();

const {
  userRegister,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  userLogin,
  getUserData,
} = require("../controllers/users.controllers");

// get obtener
// post crear
// get ID  obtiene 1
// put actualizar
// delete borrar

router.route("/user/register").post(userRegister);
router.route("/users").get(getUsers);
router.route("/user/:id").get(getUser);

module.exports = router;
