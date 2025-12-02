// ================= Snow / ice particles =================
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

const flakes = [];
const maxFlakes = 160;

function createFlake() {
  return {
    x: Math.random() * width,
    y: Math.random() * -height, // start above screen for smoother spawn
    radius: 0.8 + Math.random() * 2.2,
    speedY: 0.5 + Math.random() * 1.8,
    speedX: (Math.random() - 0.5) * 0.6,
    alpha: 0.4 + Math.random() * 0.6
  };
}

// initial population
for (let i = 0; i < maxFlakes; i++) {
  flakes.push(createFlake());
}

function drawSnow() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < flakes.length; i++) {
    const f = flakes[i];

    // move
    f.y += f.speedY;
    f.x += f.speedX;

    // wrap to top when leaving bottom
    if (f.y > height + 5) {
      flakes[i] = createFlake();
      flakes[i].y = -10;
    }

    if (f.x > width + 5) f.x = -5;
    if (f.x < -5) f.x = width + 5;

    // draw
    ctx.globalAlpha = f.alpha;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(220, 245, 255, 1)";
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawSnow);
}

drawSnow();

// ================= Fade sequence =================
const christmasLogo = document.getElementById("christmasLogo");
const dayScreen = document.getElementById("dayScreen");

// timings (ms)
const SHOW_CHRISTMAS = 5000; // how long Xmas shows before fade
const SHOW_DAY = 5000;       // how long Day 1/60 shows
const FADE_DELAY = 0;        // gap before fade back
const LOOP = true;           // loop forever

function showChristmas() {
  // Xmas visible, pulsing
  christmasLogo.classList.add("show", "pulse");
  christmasLogo.classList.remove("hide");

  // icy hidden
  dayScreen.classList.remove("show");
  dayScreen.classList.add("hide");

  setTimeout(() => {
    fadeToDay();
  }, SHOW_CHRISTMAS);
}

function fadeToDay() {
  // stop pulse when fading out
  christmasLogo.classList.remove("pulse");
  christmasLogo.classList.remove("show");
  christmasLogo.classList.add("hide");

  // fade in icy text
  dayScreen.classList.add("show");
  dayScreen.classList.remove("hide");

  setTimeout(() => {
    if (LOOP) {
      setTimeout(() => {
        // hide day screen to start over
        dayScreen.classList.remove("show");
        dayScreen.classList.add("hide");
        showChristmas();
      }, FADE_DELAY);
    }
  }, SHOW_DAY);
}

// Start when images are loaded
function startOverlay() {
  // initial state: Christmas visible
  showChristmas();
}

if (christmasLogo.complete && dayScreen.complete) {
  startOverlay();
} else {
  let loaded = 0;
  [christmasLogo, dayScreen].forEach((img) => {
    img.addEventListener("load", () => {
      loaded++;
      if (loaded === 2) startOverlay();
    });
  });
}
