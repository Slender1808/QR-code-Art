var index = 0;
var decoder = new QCodeDecoder();
var qrElement;

draw();
for (index = 0; index < 1024; index++) {
  draw();
}
async function draw() {
  qrElement = document.querySelector("[data-image='qr']");
  qr = new QRious({
    value: "https://webxr.run/XVPRm7NAGPARr#" + String.fromCharCode(index),
    backgroundAlpha: 1,
    level: "H",
    element: qrElement,
  });

  decoder.decodeFromImage(qrElement, (err, res) => {
    console.log("Resposta: ", res, "index:", index);
  });
}
