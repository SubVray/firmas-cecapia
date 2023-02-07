import SignatureCanvas from "react-signature-canvas";
import logo from "./cecapia.jpg";
import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// ////////////////////////////////////////////////

const MySwal = withReactContent(Swal);

function App() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const signatureCanvas = useRef(null);
  const [isBack, setIsBack] = useState(false);
  const [frontImg, setFrontImg] = useState("");
  const [backImg, setBackImg] = useState("");
  const [camera, setCamera] = useState();
  const [firma, setFirma] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numCedula, setNumCedula] = useState("");
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [stateModal, setStateModal] = useState(false);
  const [photoAdd, setPhotoAdd] = useState("");
  if (stateModal === true) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  function detectDeviceType() {
    document.getElementById("section-cedula").classList.toggle("d-none");
    const videoConstraints = {
      facingMode: { exact: "environment" },
    };
    if (isMobile) {
      console.log("Estás en un dispositivo móvil");
      setCamera(videoConstraints);
    } else {
      console.log("Estás en un PC");
      const videoConstraints = {
        facingMode: "user",
      };
      setCamera(videoConstraints);
    }
  }
  const saveImage = () => {
    const signature = signatureCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    signatureCanvas.current.off();
    setFirma(signature);
  };
  const deleteFirma = () => {
    signatureCanvas.current.clear();
    signatureCanvas.current.on();
  };

  const webcamRef = useRef(null);
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);

      // Obtener la imagen comprimida como una URL de datos
      const compressedImage = canvas.toDataURL("image/jpeg", 0.7);

      if (!isBack) {
        setPhotoAdd(compressedImage);
        MySwal.fire({
          title: "success",
          text: "Foto frontal exitosa!",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Entendido",
        }).then(() => {
          setStateModal(true);
          document.getElementById("switch-button").click();
        });
      } else {
        setPhotoAdd(compressedImage);
        Swal.fire({
          title: "success",
          text: "Foto posterior exitosa!",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Entendido",
        }).then(() => {
          setStateModal(true);
          document.getElementById("section-cedula").classList.add("d-none");
          document.getElementById("btn-send-photos").classList.add("d-none");
          document
            .getElementById("btn-send-cecapia")
            .classList.remove("d-none");
          document.getElementById("btn-camara-back").classList.remove("d-none");
        });
      }
    };
  };
  const handleCamBack = () => {
    document.getElementById("btn-send-cecapia").classList.add("d-none");
    document.getElementById("btn-camara-back").classList.add("d-none");
    document.getElementById("btn-send-photos").classList.remove("d-none");
  };

  const handleSendCecapia = async () => {
    const user = {
      phoneNumber: phoneNumber,
      numCedula: numCedula,
      firma: firma,
      frontImg: frontImg,
      backImg: backImg,
    };
    await axios
      .post("https://firmas-cecapia-gd2z.vercel.app/api/user/register", user)
      .then((data) => {
        MySwal.fire({
          title: "success",
          text: `${data}`,
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Entendido",
        });
        console.log(data);
      })
      .catch((err) => {
        MySwal.fire({
          title: "error",
          text: `${err}`,
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Entendido",
        });
      });
  };

  const handleInputPhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };
  const handleInputNumCedula = (event) => {
    setNumCedula(event.target.value);
  };

  const handleRecortar = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = photoAdd;
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Image = await canvas.toDataURL("image/jpeg");
    console.log(base64Image);
    console.log(isBack);
    if (!isBack) {
      setFrontImg(base64Image);
      setStateModal(false);
      setIsBack(true);
    } else {
      setBackImg(base64Image);
      setStateModal(false);
    }
  };
  return (
    <div className="">
      <form className="form-control d-flex justify-content-center align-items-center flex-column m-auto ">
        <div className="logo-container">
          <img src={logo} alt="Logo" width={"250px"} />
        </div>
        <div className=" form-control d-flex flex-column gap-2 p-3 mt-3">
          <label htmlFor="text-phone-number">Numero de teléfono:</label>
          <input
            type="text"
            onChange={handleInputPhoneNumber}
            className="form-control"
            id="text-phone-number"
          />
          <div className=" d-flex justify-content-start align-items-center gap-1">
            <label htmlFor="text-phone-number"># Cédula:</label>
            <select name="" id="" className="form-select w-75">
              <option value="">Cédula de identidad</option>
              <option value="">Cédulas jurídicas</option>
              <option value="">DIMEX</option>
            </select>
          </div>
          <input
            type="text"
            className="form-control"
            id="text-cedula-number"
            onChange={handleInputNumCedula}
          />
          <label htmlFor="sigCanvas" className="label">
            Firma:
          </label>
          <SignatureCanvas
            penColor="blue"
            ref={signatureCanvas}
            canvasProps={{
              maxwidth: 300,
              height: 300,
              className: "border sigCanvas",
              id: "sigCanvas",
            }}
          />
        </div>
        <div className="d-flex gap-2 my-2">
          <button
            type="button"
            onClick={saveImage}
            className="btn btn-success text-center">
            Guardar
          </button>
          <button
            type="button"
            onClick={deleteFirma}
            className="btn btn-danger text-center">
            Borrar
          </button>
        </div>
        <div className="">
          <button
            type="button"
            id="btn-send-photos"
            onClick={detectDeviceType}
            className="btn btn-primary">
            Subir fotos de la cédula
          </button>
          <div className=" d-flex gap-2">
            <button
              type="button"
              id="btn-send-cecapia"
              onClick={handleSendCecapia}
              className="btn btn-primary d-none">
              Enviar a Cecapia
            </button>
            <button
              type="button"
              id="btn-camara-back"
              onClick={handleCamBack}
              className="btn btn-dark d-none">
              📷
            </button>
          </div>
        </div>
        <div id="section-cedula" className="d-none mt-3">
          <div className="">
            {!isBack ? (
              <p id="lado" className="text-center h3">
                Frontal de la cédula
              </p>
            ) : (
              <p id="lado" className="text-center h3">
                Posterior de la cédula
              </p>
            )}
          </div>
          <div id="camera-box">
            <Webcam
              audio={false}
              height={350}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={camera}
              width={350}
              onTakePhoto={(dataUri) => capture(dataUri)}
            />
            <button
              type="button"
              id="capture-button"
              className="btn btn-capture"
              onClick={capture}>
              Tomar Foto
            </button>
          </div>
          <button type="button" id="switch-button" className="opacity-0">
            Cambiar a la parte posterior de la cédula
          </button>
        </div>
      </form>

      {stateModal && (
        <div className="overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Recortar foto de la Cedula</h3>
            </div>
            <button
              type="button"
              className="btn-close-modal"
              onClick={() => {
                setStateModal(false);
              }}>
              <span>❌</span>
            </button>
            <div className="modal-body">
              <p>⚠️ Para recortar la imagen seleccione la Cedula ⚠️</p>
              <div className="crop-container">
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                  <img
                    src={photoAdd}
                    alt=""
                    className="rounded"
                    width={350}
                    height={"auto"}
                  />
                </ReactCrop>
              </div>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleRecortar}>
                Recortar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="my-3 d-flex gap-2">
        <img src={frontImg} id="img1" className="w-25" alt="" />
        <img src={backImg} id="img2" className="w-25" alt="" />
      </div>
    </div>
  );
}

export default App;
