const canvas = document.querySelector("#signature-canva");
const clearButton = document.querySelector("#clear");
const saveButton = document.querySelector("#save");
const textCedula = document.querySelector("#text-cedula");
const form = document.querySelector("#upload-form");
const cameraBox = document.querySelector("#camera-box");
const cameraStream = document.querySelector("#camera-stream");
const captureButton = document.querySelector("#capture-button");
const frontInput = document.querySelector("#front-input");
const backInput = document.querySelector("#back-input");
const switchButton = document.querySelector("#switch-button");
const lado = document.querySelector("#lado");
let user = {};

if (window.screen.width > 800) {
  canvas.width = 500;
  canvas.height = 300;
} else {
  canvas.width = 300;
  canvas.height = 200;
}

const signaturePad = new SignaturePad(canvas, {
  minWidth: 1,
  maxWidth: 1,
  penColor: "blue",
});

clearButton.addEventListener("click", function () {
  signaturePad.clear();
  signaturePad.on();
});

// foto cedula
let isBack = false;
if (!isBack) {
  console.log("parte frontal");
  lado.innerHTML = "Frontal de la cédula";
} else {
  lado.innerHTML = "Trasera";
  console.log("Posterior de la cédula");
}

async function detectDeviceType() {
  var isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (isMobile) {
    console.log("Estás en un dispositivo móvil");
    form.classList.toggle("d-none");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    cameraStream.srcObject = stream;
    cameraStream.play();
  } else {
    console.log("Estás en un PC");

    form.classList.toggle("d-none");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    cameraStream.srcObject = stream;
    cameraStream.play();
  }
}

captureButton.addEventListener("click", function () {
  const canvas = document.createElement("canvas");
  canvas.width = cameraStream.videoWidth;
  canvas.height = cameraStream.videoHeight;

  const context = canvas.getContext("2d");
  context.drawImage(cameraStream, 0, 0);

  const photo = canvas.toDataURL("image/jpeg", 0.5);

  if (isBack) {
    backInput.value = photo;
  } else {
    frontInput.value = photo;
  }
});

switchButton.addEventListener("click", function () {
  isBack = !isBack;
  if (!isBack) {
    document.getElementById("switch-button").innerHTML =
      "Cambiar a la parte posterior de la cédula";
    lado.innerHTML = "Frontal de la cédula";
  } else {
    document.getElementById("switch-button").innerHTML =
      "Cambiar a la parte frontal de la cédula";
    lado.innerHTML = "Posterior de la cédula";
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const front = frontInput.value;
  const back = backInput.value;
  if (front != "") {
    Swal.fire({
      title: "success",
      text: "Foto frontal exitosa!",
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Entendido",
    }).then(() => {
      document.getElementById("img1").src = front;
      document.getElementById("switch-button").click();
    });
  }
  if (back != "") {
    Swal.fire({
      title: "success",
      text: "Foto posterior exitosa!",
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Entendido",
    }).then(() => {
      document.getElementById("img2").src = back;
      document.getElementById("fotos-cedula").click();
      document.getElementById("fotos-cedula").classList.add("d-none");
      document.getElementById("send-info").classList.remove("d-none");
    });
  }

  // Do something with front and back (e.g. send to server)
});

saveButton.addEventListener("click", () => {
  var context = canvas.getContext("2d");
  const dataURL = signaturePad.toDataURL("image/png");
  if (
    !context
      .getImageData(0, 0, canvas.width, canvas.height)
      .data.some((channel) => channel !== 0)
  ) {
    Swal.fire({
      title: "Warning",
      text: "Debe firmar para guardar la firma",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Entendido",
    });
  } else {
    signaturePad.off();
    user = {
      cedula: "",
      firma: dataURL,
      frontImg: "front",
      backImg: "back",
    };
    console.log(user);
  }
});

const sendInfo = async () => {
  const front = frontInput.value;
  const back = backInput.value;
  const dataURL = signaturePad.toDataURL("image/png");
  var context = canvas.getContext("2d");
  if (
    !context
      .getImageData(0, 0, canvas.width, canvas.height)
      .data.some((channel) => channel !== 0)
  ) {
    Swal.fire({
      title: "Warning",
      text: "Debe firmar para seguir",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Entendido",
    });
  } else if (front == "" && back == "") {
    Swal.fire({
      title: "Warning",
      text: "Para poder guardar la información primero debe tomar las fotos de la cedulas",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Entendido",
    });
  } else if (textCedula.value == "") {
    Swal.fire({
      title: "Warning",
      text: "Debe de ingresar su numero de identificacion",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Entendido",
    });
  } else {
    user = {
      phoneNumber: "",
      cedula: textCedula.value,
      firma: dataURL,
      frontImg: front,
      backImg: back,
    };
    fetch("https://cecapia-github-io.vercel.app/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        console.log("Data sent");
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(user);
  }

  // Save dataURL to database or send to server
};
