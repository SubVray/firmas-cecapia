import Navigation from "../components/Navigation";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20, faUser } from "@fortawesome/free-solid-svg-icons";

function EditPerfil(user) {
  const navigate = useNavigate();
  const { uid, gender, rol } = user.user;
  const MySwal = withReactContent(Swal);
  const [newUsername, setNewUsername] = useState("");
  const [genderU, setGender] = useState("");
  const [rolU, setRol] = useState("");

  const params = useParams();

  const onchangeUsername = (e) => {
    setNewUsername(e.target.value);
  };
  const onChangeRol = (e) => {
    setRol(e.target.value);
  };

  const handleEdite = async (e) => {
    e.preventDefault();
    try {
      const newUsernameS = {
        username: newUsername,
        gender: genderU,
        rol: rolU,
      };
      await axios.put(
        `http://localhost:5000/api/user/update/${uid}`,
        newUsernameS
      );
      const user = {
        uid: uid,
        username: newUsernameS.username,
        gender: gender,
        rol: newUsernameS.rol,
      };
      window.localStorage.setItem("user", JSON.stringify(user));
      MySwal.fire({
        title: "El nombre de Usuario se cambio correctamente",
        text: "",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
    }
    getUsers();
  };

  const getUsers = useCallback(async () => {
    if (Object.entries(params).length === 1) {
      const res = await axios.get(
        `http://localhost:5000/api/user/${params.id}`
      );
      setNewUsername(res.data.username);
      setGender(res.data.gender);
      setRol(res.data.rol);
    }
  }, [params]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <>
      <Navigation />
      <main className="  d-flex justify-content-center align-items-center flex-column ">
        <div className="container  ">
          <div className="row  ">
            <div className="col-md-6 offset-3">
              <form action="" className=" form-control p-3">
                <h1 className=" text-center">Perfil</h1>
                <div className="input-group mb-2 ">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <div className="form-floating">
                    <input
                      type="text"
                      value={newUsername}
                      className="form-control"
                      name="username"
                      onChange={onchangeUsername}
                    />
                    <label htmlFor="floatingInputGroup1">Username:</label>
                  </div>
                </div>
                {rol !== "admin" ? (
                  <></>
                ) : (
                  <div className="input-group  ">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faDiceD20} />
                    </span>
                    <div className="form-floating">
                      <select
                        name="rol"
                        className=" form-select"
                        value={rol}
                        onChange={onChangeRol}>
                        <option value="user">Rol</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <label htmlFor="floatingInputGroup1">Rol:</label>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleEdite}
                  className="btn btn-primary mt-4 m-auto">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default EditPerfil;
