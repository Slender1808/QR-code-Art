var cavas;
var ctx;
var background;
var result = [];
var min = -1;
var value = -1;
var ind = 0;

window.onload = async () => {
  cavas = new OffscreenCanvas(85, 108);
  background = document.querySelector("[data-image='background']");
  ctx = cavas.getContext("2d");

  for (let index = 0; index < 10; index++) {
    await search();
    console.log("ind:", ind, "min:", min, "value:", value);
    ind++;
  }

  await draw();
};

function draw() {
  //ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(background, 0, 0);

  qr = new QRious({
    value: "https://webxr.run/XVPRm7NAGPARr#" + value,
    backgroundAlpha: 0,
    level: "H",
  });

  //console.log(qr.toDataURL());
  ctx.drawImage(qr.image, 8, 18, 72, 72);

  const ctxCanvas = document.querySelector("canvas").getContext("2d");

  const blob = ctx.getImageData(0, 0, 85, 108)
  ctxCanvas.putImageData(blob,0,0)
}

async function search() {
  for (let index = 0 * ind; index < 1 * (ind + 1); index++) {
    result.push(await render(index));
  }

  let newMin = Math.min(...result);

  if (min > newMin || min == -1) {
    min = newMin;
    value = result.indexOf(newMin);
  }
}

async function render(input) {
  ctx.clearRect(8, 18, 72, 72);
  ctx.drawImage(background, 0, 0);
  let backgroundCTX = ctx.getImageData(8, 18, 72, 72);

  qr = await new QRious({
    value: "https://webxr.run/XVPRm7NAGPARr#" + input,
    backgroundAlpha: 0,
    level: "H",
  });

  blob = await qr.image
  ctx.drawImage(blob, 8, 18, 72, 72);
  let qrCTX = ctx.getImageData(8, 18, 72, 72);

  let dif = 0;

  for (let index = 0; index < backgroundCTX.data.length; index++) {
    dif = dif + (backgroundCTX.data[index] - qrCTX.data[index]);
  }

  return dif;
}
