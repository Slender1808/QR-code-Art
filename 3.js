var canvas;
var ctx;
var background;
var index = 0;
var tamanhoBusca = 9999;
var decoder = new QCodeDecoder();
var ctxCanvas;
var backgroundCTX;
var result = [];
var min = -1;
var sizeQR = 121;

Start()
async function Start() {
  background = document.querySelector("[data-image='background']");
  ctx = new OffscreenCanvas(
    background.width * 2,
    background.height * 2
  ).getContext("2d");
  ctx.drawImage(background, 0, 0, background.width * 2, background.height * 2);

  backgroundCTX = ctx.getImageData(
    (background.width * 2) / 2 - sizeQR / 2,
    (background.width * 2) / 2 - sizeQR / 2,
    sizeQR,
    sizeQR
  );

  ctxCanvas = document.querySelector("canvas");
  ctxCanvas.width = background.width * 2;
  ctxCanvas.height = background.height * 2;
  ctxCanvas = ctxCanvas.getContext("2d");

  canvas = new OffscreenCanvas(background.width * 2, background.height * 2);
  ctx = canvas.getContext("2d");

  for (index = 0; index <= tamanhoBusca; index++) {
    await render();
  }
}

async function render() {
  ctx.drawImage(background, 0, 0, background.width * 2, background.height * 2);

  let qr = new QRious({
    value: "https://webxr.run/XVPRm7NAGPARr#" + String("0000" + index).slice(-30),
    backgroundAlpha: 1,
    padding: 5,
    size: sizeQR,
    level: "H",
  });

  qr = qr._canvasRenderer.getElement();
  ctx.putImageData(
    qr.getContext("2d").getImageData(0, 0, sizeQR, sizeQR),
    (background.width * 2) / 2 - sizeQR / 2,
    (background.height * 2) / 2 - sizeQR / 2
  );

  let dif = 0;

  let qrCTX = ctx.getImageData(
    (background.width * 2) / 2 - sizeQR / 2,
    (background.height * 2) / 2 - sizeQR / 2,
    sizeQR,
    sizeQR
  );

  for (let i = 0; i < backgroundCTX.data.length; i++) {
    dif = dif + (backgroundCTX.data[i] - qrCTX.data[i]);
  }

  result[index] = dif;
  let newMin = Math.min(...result);
  if (min > newMin || min == -1) {
    min = newMin;

    // SHOW
    let show = new FileReader();
    show.readAsDataURL(await canvas.convertToBlob());
    show.onload = function (e) {
      let imag = new Image();
      imag.src = e.target.result;
      decoder.decodeFromImage(imag, (err, res) => {
        console.log("Resposta:", res, "Index:", index, "min:", min);
      });
    };

    ctxCanvas.putImageData(
      ctx.getImageData(0, 0, background.width * 2, background.height * 2),
      0,
      0
    );
  }
}
