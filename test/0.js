var cavas;
var ctx;
var background;
var backgroundCTX;
var qrElement;
var result = [];
var index;
var min;
var minX;
var minY;
var value;
var decoder = new QCodeDecoder();
var final;
var tamanhoBusca;
var x;
var y;
Start(999);
async function Start(input) {
  tamanhoBusca = input;
  min = -1;
  minX = -1;
  minY = -1;
  value = 0;
  background = document.querySelector("[data-image='background']");
  qrElement = document.querySelector("[data-image='qr']");
  cavas = new OffscreenCanvas(108, 108);
  ctx = cavas.getContext("2d");
  ctx.clearRect(0, 0, 108, 108);
  ctx.drawImage(background, 0, 0);
  backgroundCTX = ctx.getImageData(0, 0, 108, 108).data;

  await search();
  console.log("Final");
  draw();
  drawQR();
}

async function draw() {
  //ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, 108, 108);
  ctx.drawImage(background, 0, 0);

  qr = new QRious({
    value: "https://webxr.run/XVPRm7NAGPARr#" + String.fromCharCode(index),
    backgroundAlpha: 0,
    level: "H",
  });

  //console.log(qr.toDataURL());
  let blob = await qr.image;
  ctx.drawImage(blob, minX, minY, 83, 83);

  const ctxCanvas = document.querySelector("canvas").getContext("2d");

  blob = ctx.getImageData(0, 0, 108, 108);
  ctxCanvas.putImageData(blob, 0, 0);
}

function drawQR() {
  qr = new QRious({
    element: qrElement,
    value: "https://webxr.run/XVPRm7NAGPARr#" + index,
    backgroundAlpha: 1,
    level: "H",
  });
}

async function search() {
  for (x = 0; x < 5; x++) {
    for (y = 0; y < 24; y++) {
      for (index = 0; index <= tamanhoBusca; index++) {
        await render();
        if (index % 100 == 0) {
          console.log("index:", index, "x", x, "y", y);
          minX = x;
          minY = y;
          draw();
          drawQR();
        }
      }
      console.log("index:", index, "x", x, "y", y);
      minX = x;
      minY = y;
      draw();
      drawQR();
    }
    console.log("index:", index, "x", x, "y", y);
    minX = x;
    minY = y;
    draw();
    drawQR();
  }
}

async function render() {
  ctx.clearRect(0, 0, 108, 108);
  ctx.drawImage(background, 0, 0);

  qr = await new QRious({
    value: "https://webxr.run/XVPRm7NAGPARr#" + index,
    backgroundAlpha: 0,
    level: "H",
  });

  let img = new Image();
  img.src = qr.toDataURL();
  img.onload = function () {
    ctx.drawImage(img, 0, 0, 83, 83);
  };
  
  //calcDif()
  async function calcDif() {
    let dif = 0;
    let qrCTX = ctx.getImageData(0, 0, 108, 108).data;

    for (let index = 0; index < backgroundCTX.length; index++) {
      dif = dif + (backgroundCTX[index] - qrCTX[index]);
    }

    result[index] = dif;
    let newMin = Math.min(...result);
    if (min > newMin || min == -1) {
      min = newMin;
      value = result.indexOf(newMin);
      minX = x;
      minY = y;
      console.log("index:", index, "min:", min, "x", x, "y", y);
    }
  }

  blob = await cavas.convertToBlob();
  let a = new FileReader();
  a.readAsDataURL(blob);
  a.onload = function (e) {
    let image = document.createElement("img");
    image.src = e.target.result;
    decoder.decodeFromImage(image, (err, res) => {
      if (res) {
        console.log("Resposta: ", res, "index:", index, "min:", min);
        final = res;
        minX = x;
        minY = y;
        index = tamanhoBusca;
      }
    });
  };
}
