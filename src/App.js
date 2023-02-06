import SignatureCanvas from "react-signature-canvas";
import logo from "./cecapia.jpg";
import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function App() {
  const [isBack, setIsBack] = useState(false);
  const [forntImg, setFrontImg] = useState("");
  const [bakcImg, setBackImg] = useState("");
  const [camera, setCamera] = useState({});
 const videoConstraints = {
   facingMode: "user",
 };
  // function detectDeviceType() {
  //   var isMobile =
  //     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //       navigator.userAgent
  //     );

  //   if (isMobile) {
  //     console.log("Estás en un dispositivo móvil");
  //     const videoConstraints = {
  //       facingMode: "user",
  //     };
  //     setCamera(videoConstraints);
  //   } else {
  //     console.log("Estás en un PC");

  //     const videoConstraints = {
  //       facingMode: { exact: "environment" },
  //     };
  //     setCamera(videoConstraints);
  //   }
  // }

  const webcamRef = useRef(null);
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!isBack) {
      setFrontImg(imageSrc);
      setIsBack(true);
    } else {
      setBackImg(imageSrc);
      setIsBack(false);
    }

    console.log(`front ${forntImg}`);
    console.log(`back ${bakcImg}`);
  };

  return (
    <div className="">
      <form
        action=""
        className="form-control d-flex justify-content-center align-items-center flex-column ">
        <div className="logo-container">
          <img src={logo} alt="Logo" width={"250px"} />
        </div>
        <div className=" form-control d-flex flex-column gap-2 p-4 mt-3">
          <label htmlFor="text-phone-number">Numero de teléfono:</label>
          <input type="text" className="form-control" id="text-phone-number" />
          <div className=" d-flex justify-content-start align-items-center gap-1">
            <label htmlFor="text-phone-number"># cédula:</label>
            <select name="" id="" className="form-select w-50">
              <option value="">Cédula de identidad</option>
              <option value="">Cédulas jurídicas</option>
              <option value="">DIMEX</option>
            </select>
          </div>
          <input type="text" className="form-control" id="text-cedula-number" />
          <label htmlFor="sigCanvas" className="label">
            Firma:
          </label>
          <SignatureCanvas
            penColor="blue"
            canvasProps={{
              maxwidth: 300,
              height: 300,
              className: "border sigCanvas",
              id: "sigCanvas",
            }}
          />
        </div>
        <div className="d-flex gap-2 my-2">
          <button type="button" className="btn btn-success text-center">
            Guardar
          </button>
          <button type="button" className="btn btn-danger text-center">
            Borrar
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className="btn btn-primary">
            Subir fotos de la cédula
          </button>
        </div>
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
            videoConstraints={videoConstraints}
            width={350}
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
      </form>
      <div className="my-3">
        <img src="#" id="img1" className="w-25" alt="" />
        <img src="#" id="img2" className="w-25" alt="" />
      </div>
    </div>
  );
}

export default App;
