import logo from "../cecapia.jpg";
import React, { useState, useEffect } from "react";
import "../css/dashboard.css";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { SyncLoader } from "react-spinners";

export default function DashBoard() {
  const MySwal = withReactContent(Swal);
  const [allUsers, setAllUsers] = useState([]);
  const [usersTable, setUsersTable] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  let [color, setColor] = useState("#fbbf13");

  window.addEventListener("load", function () {
    setTimeout(() => {
      getUser();
      setIsLoading(false);
    }, 3000);
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

  const handleDeleteUser = (userID) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success mx-1",
        cancelButton: "btn btn-danger mx-1",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Esta seguro?",
        text: "Luego de borrar al usuarios no de puede revertir !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, borrar!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons
            .fire("Borrado!", "El usuario ha sido borrado.", "success")
            .then(async () => {
              try {
                await axios.delete(
                  `https://firmas-cecapia-gd2z.vercel.app/api/user/delete/${userID}`
                );
                getUser();
              } catch (error) {
                console.error(error);
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado!",
            "El usuario no ha sido borrado.",
            "error"
          );
        }
      });
  };

  useEffect(() => {
    setTimeout(() => {
      getUser();
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDownloadFirma = (user) => {
    const photoFirma = user.firma;

    const link = document.createElement("a");
    link.href = photoFirma;
    link.download = `firma-${user.numCedula}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFrontal = (user) => {
    const photoFirma = user.firma;

    const link = document.createElement("a");
    link.href = photoFirma;
    link.download = `firma-${user.numCedula}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      return false;
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
        <div className=" d-flex align-items-center gap-3 py-2">
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
            {isLoading ? (
              <div className="spinner-container">
                <SyncLoader
                  color={color}
                  loading={isLoading}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                <span>Cargando</span>
              </div>
            ) : (
              allUsers &&
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
                      <button
                        className="btn"
                        onClick={() => {
                          handleDownloadFirma(user);
                        }}>
                        <FontAwesomeIcon icon={faDownload} />

                        <img
                          src={user.firma}
                          width="100%"
                          height="130px"
                          alt=""
                        />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => {
                          handleDownloadFrontal(user);
                        }}>
                        <FontAwesomeIcon icon={faDownload} />

                        <img src={user.frontImg} width="100%" alt="" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => {
                          handleDownloadFrontal(user);
                        }}>
                        <FontAwesomeIcon icon={faDownload} />

                        <img src={user.backImg} width="100%" alt="" />
                      </button>
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
              })
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
