var cavas;
var ctx;
var background;
var qrElement;
var result;
var index;

window.onload = () => {
  cavas = new OffscreenCanvas(85, 108);
  background = document.querySelector("[data-image='background']");
  qrElement = document.querySelector("[data-image='qr']");
  ctx = cavas.getContext("2d");

  search();
  draw();
  drawQR();
};

function draw() {
  //ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(background, 0, 0);

  qr = new QRious({
    value: "https://webxr.run/XVPRm7NAGPARr#" + index,
    backgroundAlpha: 0,
    level: "H",
  });

  //console.log(qr.toDataURL());
  ctx.drawImage(qr.image, 8, 18, 72, 72);

  const ctxCanvas = document.querySelector("canvas").getContext("2d");

  const blob = ctx.getImageData(0, 0, 85, 108);
  ctxCanvas.putImageData(blob, 0, 0);
}

function drawQR() {
  qr = new QRious({
    element: qrElement,
    value: "https://webxr.run/XVPRm7NAGPARr#" + index,
    backgroundAlpha: 0,
    level: "H",
  });
}

async function search() {
  for (index = 0; index <= 1024; index++) {
    result = await render();
    console.log("index:", index, "result:", result);
    if (result) {
      break;
    }
  }
}

async function render() {
  ctx.clearRect(8, 18, 72, 72);
  ctx.drawImage(background, 0, 0);

  qr = await new QRious({
    value: "https://webxr.run/XVPRm7NAGPARr#" + index,
    backgroundAlpha: 0,
    level: "H",
  });

  let blob = await qr.image;
  ctx.drawImage(blob, 8, 18, 72, 72);

  let dif = false;

  blob = await cavas.convertToBlob();
  let a = new FileReader();
  a.readAsDataURL(blob);
  a.onload = function (e) {
    QCodeDecoder().decodeFromImage(e.target.result, (er, res) => {
      dif = res;
    });
  };

  return dif;
}
