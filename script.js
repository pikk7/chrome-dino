import { setupGround, updateGround } from "./ground.js";
import { setupDino, updateDino } from "./dino.js";

const WORD_WIDTH = 100;
const WORD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const wordElement = document.querySelector(".world");
const scoreElement = document.querySelector(".score");
const startScreen = document.querySelector(".start-screen");

setPixelToWordScale();
window.addEventListener("resize", setPixelToWordScale);
document.addEventListener("keydown", handleStart, { once: true });

let lastTime = null;
let speedScale;
let score;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  lastTime = time;
  window.requestAnimationFrame(update);
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElement.textContent = Math.floor(score);
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDino();
  startScreen.classList.add("hide");
  window.requestAnimationFrame(update);
}

function setPixelToWordScale() {
  let wordToPixelScale;
  if (window.innerWidth / window.innerHeight < WORD_WIDTH / WORD_HEIGHT) {
    wordToPixelScale = window.innerWidth / WORD_HEIGHT;
  } else {
    wordToPixelScale = window.innerHeight / WORD_HEIGHT;
  }

  wordElement.style.width = `${WORD_WIDTH * wordToPixelScale}px`;
  wordElement.style.height = `${WORD_HEIGHT * wordToPixelScale}px`;
}
