var cavas;
var ctx;
var background;
var backgroundCTX;
var qrElement;
var result = [];
var index;
var min = -1;
var value = 0;
var decoder = new QCodeDecoder();
var final = -1;
var tamanhoBusca = 2048;

async function Start(input) {
  tamanhoBusca = input
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
  ctx.drawImage(qr.image, 6, 15, 76, 76);

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
  for (index = 0; index <= tamanhoBusca; index++) {
    result.push(await render());

    let newMin = Math.min(...result);
    if (min > newMin || min == -1) {
      min = newMin;
      value = result.indexOf(newMin);
      console.log("index:", index, "min:", min, "value:", value);
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
  ctx.drawImage(blob, 6, 15, 76, 76);
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
        console.log("Resposta: ", res);
        final = res;
        index = tamanhoBusca;
      }
    });
  };

  return dif;
}
