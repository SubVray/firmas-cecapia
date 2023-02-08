import logo from "../cecapia.jpg";
import React, { useState, useEffect } from "react";
import "../css/dashboard.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrashCan } from "@fortawesome/free-solid-svg-icons";
export default function DashBoard() {
  const [allUsers, setAllUsers] = useState([]);
  const [usersTable, setUsersTable] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  window.addEventListener("load", function () {
    getUser();
  });

  const getUser = async () => {
    await axios
      .get("https://firmas-cecapia-gd2z.vercel.app/api/users")
      .then((res) => {
        setAllUsers(res.data);
        setUsersTable(res.data);
      })
      .catch((error) => console.log(error));
  };
  const handleDeleteUser = async (userID) => {
    try {
      await axios.delete(
        `https://firmas-cecapia-gd2z.vercel.app/api/user/delete/${userID}`
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
      // agregue aquí su manejo de errores personalizado
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  //   const handleDownloadFirma = (user) => {
  //     const photoFirma = user.firma;
  //     var w = window.open("about:");
  //     setTimeout(() => {
  //       w.document.body.appendChild(w.document.createElement("iframe")).src =
  //         photoFirma;
  //       w.document.body.style.margin = 100;
  //       w.document.getElementsByTagName("iframe")[0].style.width = "30%";
  //       w.document.getElementsByTagName("iframe")[0].style.height = "45%";
  //       w.document.getElementsByTagName("iframe")[0].style.border =
  //         "1px solid red";
  //       w.document.getElementsByTagName("iframe")[0].style.padding = "10px";
  //     }, 0);
  //     // const link = document.createElement("a");
  //     // link.href = "photoFirma";
  //     // window.location.href = `${photoFirma}`;
  //     // // link.download = `firma-${user.numCedula}`;
  //     // document.body.appendChild(link);
  //     // link.click();
  //     // document.body.removeChild(link);
  //   };
  //   const handleDownloadFrontal = (user) => {
  //     const photoFrontal = user.frontImg;
  //     var w = window.open("about:");
  //     setTimeout(() => {
  //       w.document.body.appendChild(w.document.createElement("iframe")).src =
  //         photoFrontal;
  //       w.document.body.style.margin = 100;
  //       w.document.getElementsByTagName("iframe")[0].style.width = "19.5%";
  //       w.document.getElementsByTagName("iframe")[0].style.height = "28%";
  //       w.document.getElementsByTagName("iframe")[0].style.border =
  //         "1px solid red";
  //       w.document.getElementsByTagName("iframe")[0].style.padding = "10px";
  //     }, 0);
  //   };
  const handleChangeSearch = (e) => {
    setBusqueda(e.target.value);
    filter(e.target.value);
  };
  const filter = (terminoBusqueda) => {
    let resultadoBusqueda = usersTable.filter((elemento) => {
      if (
        elemento.phoneNumber
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase()) ||
        elemento.numCedula
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setAllUsers(resultadoBusqueda);
  };

  return (
    <main className=" border container py-4 mt-5 rounded bg-light">
      <h1 className="text-center">DashBoard</h1>
      <div className="logo-container-dash d-flex justify-content-center mb-4">
        <img src={logo} alt="Logo Cecapia" className="m-auto" />
      </div>
      <section className="border rounded p-3">
        <div className=" d-flex align-items-center gap-3">
          <h2>Usuarios</h2>
          <div className="bar-search-container">
            <input
              class="form-control mr-sm-2"
              value={busqueda}
              onChange={handleChangeSearch}
              placeholder="Search"
            />
          </div>
        </div>
        <table className="table table-striped table-bordered   ">
          <thead className="">
            <tr>
              <th>#</th>
              <th># Celular</th>
              <th>Cedula</th>
              <th>Firma</th>
              <th>Foto Frontal</th>
              <th>Foto Trasera</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {allUsers &&
              allUsers.map((user, idx) => {
                return (
                  <tr key={user._id}>
                    <td className="info">
                      <span>{idx + 1}</span>
                    </td>
                    <td className="info">
                      <span>{user.phoneNumber}</span>
                    </td>
                    <td className="info">
                      <span>{user.numCedula}</span>
                    </td>
                    <td className=" align-items-center">
                      {/* <button
                      className="btn btn-warning btn"
                      onClick={() => {
                        handleDownloadFirma(user);
                      }}>
                      <FontAwesomeIcon icon={faDownload} />
                    </button> */}

                      <img
                        src={user.firma}
                        width="100%"
                        height="130px"
                        alt=""
                      />
                    </td>
                    <td>
                      {/* <button
                      className="btn btn-warning btn"
                      onClick={() => {
                        handleDownloadFrontal(user);
                      }}>
                      <FontAwesomeIcon icon={faDownload} />
                    </button> */}

                      <img src={user.frontImg} width={200} alt="" />
                    </td>
                    <td>
                      <img src={user.backImg} width={200} alt="" />
                    </td>
                    <td>
                      <span>
                        <button
                          className="btn btn-danger btn"
                          onClick={() => {
                            handleDeleteUser(user._id);
                          }}>
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
