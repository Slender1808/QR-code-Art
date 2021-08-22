var canvas;
var ctx;
var background;
var index = 0;
var size = 9999;
var decoder = new QCodeDecoder();
var ctxCanvas;
Start();
function Start() {
  background = document.querySelector("[data-image='background']");
  ctxCanvas = document.querySelector("canvas").getContext("2d");
  canvas = new OffscreenCanvas(155, 155);
  ctx = canvas.getContext("2d");
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff";
  render();
}

async function render() {
  if (index < size) {
    ctx.drawImage(background, 40, 40);
    ctx.fillRect(0, 0, 155, 155);

    ctx.drawImage(background, 40, 40);
    let qr = await new QRious({
      value:
        "https://webxr.run/XVPRm7NAGPARr#" +
        String("000000000000000000000000000000" + index).slice(-30),
      backgroundAlpha: 0,
      level: "H",
    });

    let img = new Image();
    img.src = await qr.toDataURL();
    img.onload = function () {
      ctx.drawImage(img, 0, 0, 155, 155);
    };

    let result = new FileReader();
    result.readAsDataURL(await canvas.convertToBlob());
    result.onload = function (e) {
      let imag = new Image();
      imag.src = e.target.result;
      decoder.decodeFromImage(imag, (err, res) => {
        console.log("Resposta: ", res, "Index: ", index);
      });
    };


    ctxCanvas.putImageData(ctx.getImageData(0, 0, 155, 155), 0, 0);

    index++;
    render();
  }
}
