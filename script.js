import { setupGround, updateGround } from "./ground.js";
import { setupDino, updateDino, getDinoRec, setDinoLose } from "./dino.js";
import { setupCactus, updateCactus, getCactusRects } from "./cactus.js";

const WORD_WIDTH = 100;
const WORD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

export const wordElement = document.querySelector(".world");
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
    setHightScore();
    return;
  }
  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) {
    return handleLose();
  }
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
  setupCactus();
  setHightScore();
  startScreen.classList.add("hide");
  window.requestAnimationFrame(update);
}

function setPixelToWordScale() {
  let wordToPixelScale;
  if (window.innerWidth / window.innerHeight < WORD_WIDTH / WORD_HEIGHT) {
    wordToPixelScale = window.innerWidth / WORD_WIDTH;
  } else {
    wordToPixelScale = window.innerHeight / WORD_HEIGHT;
  }

  wordElement.style.width = `${WORD_WIDTH * wordToPixelScale}px`;
  wordElement.style.height = `${WORD_HEIGHT * wordToPixelScale}px`;
}

function checkLose() {
  const dinoRect = getDinoRec();
  return getCactusRects().some((rect) => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function handleLose() {
  setDinoLose();
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    startScreen.classList.remove("hide");
  }, 100);
  let hightscore = localStorage.getItem("highscore");
  if (score > hightscore) {
    localStorage.setItem("highscore", score);
  }
  setHightScore();
}

function setHightScore() {
  const localScore = localStorage.getItem("highscore");
  document.querySelector(".highscore").textContent = `Highscore: ${Math.floor(
    localScore
  )}`;
}
