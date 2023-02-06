import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faUser,
  faLock,
  faVenusMars,
  faFloppyDisk,
  faDiceD20,
} from "@fortawesome/free-solid-svg-icons";
import Navigation from "../components/Navigation";
import chico from "../images/chico.png";
import chica from "../images/chica.png";

function AdminView() {
  const [users, setUsers] = useState([]);
  const MySwal = withReactContent(Swal);
  const [newUser, setNewUser] = useState({});

  // edit users
  const [uidUser, setUidUser] = useState();
  const [newUsername, setNewUserName] = useState("");
  const [newRol, setNewRol] = useState("");
  const [newGender, setNewGender] = useState();

  const onchangeUsername = (e) => {
    setNewUserName(e.target.value);
  };
  const onChangeRol = (e) => {
    setNewRol(e.target.value);
  };
  const onChangeGender = (e) => {
    setNewGender(e.target.value);
  };

  // edit users
  const handleEditUser = async (e, uid) => {
    e.preventDefault();
    try {
      const newUsernameS = {
        username: newUsername,
        gender: newGender,
        rol: newRol,
      };
      await axios.put(
        `http://localhost:5000/api/user/update/${uid}`,
        newUsernameS
      );
      MySwal.fire({
        title: "El nombre de Usuario se cambio correctamente",
        text: "",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
    }
    getUsers();
  };

  const getUsers = useCallback(async () => {
    await axios
      .get("http://localhost:5000/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const getUsersty = useCallback(async (e, id) => {
    e.preventDefault();
    const res = await axios.get(`http://localhost:5000/api/user/${id}`);
    setNewUserName(res.data.username);
    setNewGender(res.data.gender);
    setNewRol(res.data.rol);
    setUidUser(res.data._id);
  }, []);

  useEffect(() => {
    getUsersty();
  }, [getUsersty]);

  const handleChange = (e) => {
    let newUserRegister = {
      [e.target.name]: e.target.value,
      [e.target.name]: e.target.value,
      [e.target.name]: e.target.value,
      [e.target.name]: e.target.value,
    };
    setNewUser({ ...newUser, ...newUserRegister });
  };

  const handleRegister = async (e) => {
    // e.preventDefault();
    document.querySelectorAll("#form-register-user input").forEach((input) => {
      if (input.value === "") {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        MySwal.fire({
          title: "Campos incompletos",
          text: "Complete los espacio resaltados en rojo.",
          icon: "warning",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        input.classList.remove("is-invalid");
        axios
          .post("http://localhost:5000/api/user/register", newUser)
          .then((data) => {
            if (data.data.error === "User Exist") {
              window.localStorage.setItem("userExist", data.data.error);
              MySwal.fire({
                title: `${newUser.username} ya esta registrado`,
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              window.localStorage.removeItem("userExist");
              MySwal.fire({
                title: "Registrado!",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                document.getElementById("btn-add-new-user").click();
                document.getElementById("form-register-user").reset();
                getUsers();
              });
            }
          });
      }
    });
  };

  const handleDeleteUser = async (e, id) => {
    e.preventDefault();
    await axios.delete(`http://localhost:5000/api/user/delete/${id}`);
    getUsers();
  };

  return (
    <>
      <Navigation />
      <main className="  d-flex justify-content-center align-items-center flex-column ">
        <h1>Dashboard Admin</h1>
        <div className="container">
          <ul className=" list-group">
            {users.map((user) => {
              return (
                <li
                  key={user.username}
                  className="list-group-item  d-flex justify-content-between align-items-center ">
                  <div className=" box-username">
                    <span>{user.username}</span>
                  </div>
                  <div className="text-center box-rol">
                    <span>{user.rol}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-danger btn-delete-user"
                      onClick={(e) => handleDeleteUser(e, user._id)}>
                      <FontAwesomeIcon icon={faTrashCan} className="icon" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-edit-user"
                      data-bs-toggle="modal"
                      data-bs-target="#btn-edit-user"
                      onClick={(e) => getUsersty(e, user._id)}>
                      <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          type="button"
          className="btn btn-primary mt-5"
          data-bs-toggle="modal"
          data-bs-target="#register">
          ADD NEW
        </button>

        <div
          className="modal fade"
          id="register"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5" id="exampleModalLabel">
                  Register New User
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="btn-add-new-user"
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form
                  action=""
                  id="form-register-user"
                  className=" d-flex justify-content-center align-items-center flex-column  p-4 gap-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputGroup1"
                        name="username"
                        placeholder="Username:"
                        onChange={handleChange}
                      />

                      <label htmlFor="floatingInputGroup1">Username:</label>
                    </div>
                  </div>
                  <div className="input-group  ">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputGroup2"
                        placeholder="Password:"
                        name="password"
                        onChange={handleChange}
                      />
                      <label htmlFor="floatingInputGroup1">Password:</label>
                    </div>
                  </div>
                  <div className="input-group  ">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faVenusMars} />
                    </span>
                    <div className="form-floating">
                      <select
                        name="gender"
                        className=" form-select"
                        defaultValue=""
                        onChange={handleChange}>
                        <option disabled value="">
                          Gender
                        </option>
                        <option value={chico}>BOY</option>
                        <option value={chica}>GIRL</option>
                      </select>
                      <label htmlFor="floatingInputGroup1">Gender:</label>
                    </div>
                  </div>
                  <div className="input-group ">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faVenusMars} />
                    </span>
                    <div className="form-floating">
                      <select
                        name="rol"
                        className=" form-select"
                        defaultValue=""
                        onChange={handleChange}>
                        <option value="" disabled>
                          Rol
                        </option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <label htmlFor="floatingInputGroup1">Rol:</label>
                    </div>
                  </div>
                  <button
                    className=" btn btn-success "
                    type="button"
                    onClick={(e) => handleRegister(e)}>
                    <FontAwesomeIcon icon={faFloppyDisk} />
                    <span className="ms-2">Register</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="btn-edit-user"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5" id="staticBackdropLabel">
                  Edit User
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form action="" className=" form-control p-3">
                  <h1 className=" text-center">Perfil</h1>
                  <div className="input-group mb-2 ">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={newUsername}
                        onChange={onchangeUsername}
                      />
                      <label htmlFor="floatingInputGroup1">Username:</label>
                    </div>
                  </div>
                  <div className="input-group mb-2">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faVenusMars} />
                    </span>
                    <div className="form-floating">
                      <select
                        name="gender"
                        className=" form-select"
                        value={newGender}
                        onChange={onChangeGender}>
                        <option value={chico}>BOY</option>
                        <option value={chica}>GIRL</option>
                      </select>
                      <label htmlFor="floatingInputGroup1">Gender:</label>
                    </div>
                  </div>
                  <div className="input-group  ">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faDiceD20} />
                    </span>
                    <div className="form-floating">
                      <select
                        name="rol"
                        className=" form-select"
                        value={newRol}
                        onChange={onChangeRol}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <label htmlFor="floatingInputGroup1">Rol:</label>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary mt-4 m-auto"
                    onClick={(e) => {
                      handleEditUser(e, uidUser);
                    }}>
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminView;
