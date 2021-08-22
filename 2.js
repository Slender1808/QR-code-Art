var canvas;
var ctx;
var background;
var index = 0;
var size = 1;
var decoder = new QCodeDecoder();
var ctxCanvas;
Start();
function Start() {
  background = document.querySelector("[data-image='background']");
  canvasShow = document.querySelector("canvas");
  canvasShow.width = background.width * 2;
  canvasShow.height = background.height * 2;
  ctxCanvas = canvasShow.getContext("2d");
  canvas = new OffscreenCanvas(background.width * 2, background.height * 2);
  ctx = canvas.getContext("2d");
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff";
  render();
}

async function render() {
  if (index < size) {
    ctx.drawImage(
      background,
      0,
      0,
      background.width * 2,
      background.height * 2
    );
    
    let size = 110;
    let qr = await new QRious({
      value: "https://webxr.run/XVPRm7NAGPARr#" + String.fromCharCode(index),
      backgroundAlpha: 1,
      padding: 5,
      size: size,
      level: "H",
    });

    qr = qr._canvasRenderer.getElement()
    ctx.putImageData(qr.getContext("2d").getImageData(0,0,qr.width,qr.height), (background.width * 2) / 2 - size / 2, (background.height * 2) / 2 - size / 2);
 

    let result = new FileReader();
    result.readAsDataURL(await canvas.convertToBlob());
    result.onload = function (e) {
      let imag = new Image();
      imag.src = e.target.result;
      decoder.decodeFromImage(imag, (err, res) => {
        console.log("Resposta: ", res, "Index: ", index);
      });
    };

    ctxCanvas.putImageData(
      ctx.getImageData(0, 0, background.width * 2, background.height * 2),
      0,
      0
    );

    index++;
    render();
  }
}
