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
Start(254);
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

function draw() {
  //ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, 108, 108);
  ctx.drawImage(background, 0, 0);

  qr = new QRious({
    value: "https://webxr.run/XVPRm7NAGPARr#" + value,
    backgroundAlpha: 0,
    level: "H",
  });

  //console.log(qr.toDataURL());
  ctx.drawImage(qr.image, minX, minY, 83, 83);

  const ctxCanvas = document.querySelector("canvas").getContext("2d");

  const blob = ctx.getImageData(0, 0, 108, 108);
  ctxCanvas.putImageData(blob, 0, 0);
}

function drawQR() {
  qr = new QRious({
    element: qrElement,
    value: "https://webxr.run/XVPRm7NAGPARr#" + value,
    backgroundAlpha: 1,
    level: "H",
  });
}

async function search() {
  for (x = 0; x < 26; x++) {
    for (y = 0; y < 26; y++) {
      for (index = 0; index <= tamanhoBusca; index++) {
        result[index] = await render();

        let newMin = Math.min(...result);
        if (min > newMin || min == -1) {
          min = newMin;
          value = result.indexOf(newMin);
          minX = x;
          minY = y;
          console.log("index:", index, "min:", min, "x", x, "y", y);
        }
      }
    }
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

  let blob = await qr.image;
  ctx.drawImage(blob, x, y, 83, 83);
  let qrCTX = ctx.getImageData(0, 0, 108, 108).data;

  let dif = 0;

  for (let index = 0; index < backgroundCTX.length; index++) {
    dif = dif + (backgroundCTX[index] - qrCTX[index]);
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
        index = tamanhoBusca;
      }
    });
  };

  return dif;
}
