document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript is connected and ready to go!");
});

// Reference for fractal:  https://codepen.io/yukulele/pen/zYXmQyj?editors=1111
// @yukulele
const subPixel = 1;
const scale = 1;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
let size = 0;
let x;
let y;
const lasts = [];
const dots = [];
let count = 11;
let cnt = Math.ceil(count);
let ratio = 0.48;
let pow = 0.575;
let colgen = 6;
let cntp = cnt ** pow;
let step = 0;
function draw() {
  if (--step < 0) return;
  let i = lasts[0] + ((Math.random() ** 2 * cntp) | 0);
  i = ((i % cnt) + cnt) % cnt | 0;
  const dot = dots[i];
  x = x * (1 - ratio) + dot.x * ratio;
  y = y * (1 - ratio) + dot.y * ratio;
  lasts.unshift(i);
  const hue = colgen ? lasts[colgen - 1] : 0;
  ctx.fillStyle = `oklch(55% 0.27 ${-hue / count}turn / .6)`;
  ctx.beginPath();
  ctx.arc(x, y, 0.3 / scale, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  lasts.length = 9;
}

function loop() {
  const init = performance.now();
  ctx.fillStyle = "#fff";
  while (performance.now() - init - 1000 / 45 < 0) draw();
  window.requestAnimationFrame(loop);
}
function resize() {
  const w = window.innerWidth * subPixel * devicePixelRatio;
  const h = window.innerHeight * subPixel * devicePixelRatio;
  const min = Math.round(Math.min(w, h));
  if (min === size) return;
  size = min;
  canvas.width = canvas.height = size;
  init();
}
function init() {
  ctx.reset();
  ctx.fillRect(0, 0, size, size);
  ctx.scale(1, scale);
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, 1);
  x = Math.random() * size;
  y = Math.random() * size;
  dots.length = 0;
  step = 2e6;
  count = 11 || 1;
  ratio = 0.48;
  pow =  0.575;
  colgen = 6;
  cnt = Math.ceil(count);
  cntp = cnt ** pow;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const x = (Math.sin(angle) * size) / 2;
    const y = (-Math.cos(angle) * size) / 2;
    dots.push({ x, y });
  }
  draw();
}

window.addEventListener("resize", resize);
window.addEventListener("click", () => (step = 2e6));
resize();
loop();

document.body.appendChild(canvas);
