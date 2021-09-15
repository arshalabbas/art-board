//canvas element
const canvas = document.querySelector("canvas");
//configure canvas size
canvas.width = innerWidth - 60;
canvas.height = innerHeight - canvas.offsetTop - 30;

//automatically fix the canvas size if we resize the window
window.addEventListener("resize", () => {
  canvas.width = innerWidth - 60;
  canvas.height = innerHeight - canvas.offsetTop - 30;
});

const c = canvas.getContext("2d");

//other elements
const brushSize = document.getElementById("brush-slider");
const color = document.getElementById("color");
const sizeDisplay = document.getElementById("brush-size-value");
const toggle = document.getElementById("toggle");
const reference = document.getElementById("reference");

//intializing brush properties
let brush = {
  size: brushSize.value,
  color: color.value,
};

//stats
let isPainting = false;
let isEraser = false;

//updating dom values and brush size value
function changeBrushSize(value) {
  sizeDisplay.innerHTML = value;
  brush.size = value;
}
//update brush color
const changeBrushColor = (value) => (brush.color = value);

//detecting all mouse moves and clicks
canvas.addEventListener("mousedown", (event) => {
  isPainting = true;
  if (!isEraser) draw(event);
});

canvas.addEventListener("mouseleave", () => (isPainting = false));

canvas.addEventListener("mouseup", (event) => {
  isPainting = false;
  c.beginPath();
});

function draw(event) {
  if (!isPainting) return;

  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;

  c.lineWidth = brush.size;
  c.lineCap = "round";
  c.strokeStyle = brush.color;
  c.lineTo(x, y);
  c.stroke();
}

function erase(event) {
  if (!isPainting) return;

  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;

  c.clearRect(x - brush.size / 2, y - brush.size / 2, brush.size * 2, brush.size * 2);
}

canvas.addEventListener("mousemove", (event) => {
  if (isEraser) {
    erase(event);
  } else {
    draw(event);
  }
});

function toggleBrush() {
  isEraser = !isEraser;
  console.log(isEraser);
  if (isEraser) {
    toggle.className = "fas fa-eraser";
    reference.className = "fas fa-pencil-alt";
  } else {
    toggle.className = "fas fa-pencil-alt";
    reference.className = "fas fa-eraser";
  }
}

//save and new
function saveArt() {
  const donwloadLink = document.createElement("a");
  donwloadLink.download = "art.png";
  donwloadLink.href = canvas.toDataURL();
  donwloadLink.click();
}
function clearArt() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

//keyboard shotcuts
window.addEventListener("keypress", (event) => {
  if (event.key.toLowerCase() === "c") clearArt();
  if (event.key.toLowerCase() === "s") saveArt();
  if (!isNaN(event.key)) {
    if (event.key < 1) return;
    brush.size = event.key;
    brushSize.value = event.key;
    sizeDisplay.innerHTML = event.key;
  }
});
