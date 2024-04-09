import "./style.css";
import { getRandomInt, getImg } from "./utils";
import shot from "./assets/sfx/shot.wav";
import shotgun from "./assets/sfx/shotgun.wav";
import mainMusic from "./assets/music/western.ogg";

const canvas = document.getElementById("app");
canvas.width = 800;
canvas.height = 600;

canvas.click();

/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d");

let bestScore = Number(localStorage.getItem("sg_best_score") || 0);
// Data/Load

const gameState = {
  isRunning: false,
  time: 10,
  score: 0,
};

setInterval(() => {
  if (gameState.isRunning) {
    gameState.time--;
  }
}, 1000);

const mouse = {
  x: 0,
  y: 0,
};

const square = {
  x: 0,
  y: 0,
  width: 20,
  height: 20,
};

const sprites = {
  crosshairs: getImg("crosshairs"),
  background: getImg("sky"),
  target: getImg("target"),
};

const sfx = {
  shot: new Audio(shot),
  shotgun: new Audio(shotgun),
};

const music = {
  main: new Audio(mainMusic),
};

const target = {
  x: getRandomInt(0, canvas.width - 50),
  y: getRandomInt(0, canvas.height - 50),
  width: 50,
  height: 50,
};

// Timing
let lastUpdateTime = 0;
let deltaTime = 0;

function update() {
  // Calculate delta time
  let currentTime = performance.now();
  deltaTime = (currentTime - lastUpdateTime) / 1000; // Convert milliseconds to seconds
  lastUpdateTime = currentTime;

  if (gameState.isRunning) {
    if (gameState.time <= 0) {
      if (gameState.score > bestScore) {
        bestScore = gameState.score;
        localStorage.setItem("sg_best_score", JSON.stringify(gameState.score));
      }
      gameState.isRunning = false;
      gameState.time = 10;
      music.main.volume = 0.3;
      gameState.score = 0;
    }
  }

  // Update game logic here
  square.x = mouse.x;
  square.y = mouse.y;
}

function render() {
  // Render game graphics here

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(sprites.background, 0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";

  if (!gameState.isRunning) {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    // ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    const beginSentence = `Clique para começar o jogo`;
    const beginSentenceWidth = ctx.measureText(beginSentence).width;

    ctx.fillText(
      beginSentence,
      canvas.width / 2 - beginSentenceWidth / 2,
      canvas.height / 2,
      canvas.width
    );

    const bestScoreSentence = `O melhor score foi: ${bestScore}`;
    const bestScoreSentenceWidth = ctx.measureText(bestScoreSentence).width;

    ctx.fillText(
      bestScoreSentence,
      canvas.width / 2 - bestScoreSentenceWidth / 2,
      canvas.height / 2 + 50,
      canvas.width
    );
    if (bestScore > 0) {
    }
  }
  if (gameState.isRunning) {
    ctx.drawImage(
      sprites.target,
      target.x,
      target.y,
      target.width,
      target.height
    );
    // ctx.fillRect(target.x, target.y, target.width, target.height);

    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    const timeString = `Time: ${gameState.time}`;
    const timeStringWidth = ctx.measureText(timeString).width;
    ctx.fillText(timeString, canvas.width - timeStringWidth - 10, 30);
  }
  ctx.drawImage(
    sprites.crosshairs,
    square.x,
    square.y,
    square.width,
    square.height
  );
}

function gameLoop() {
  // Update game logic
  update();

  // Render game graphics
  render();

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Events

window.addEventListener("mousemove", ({ clientX, clientY }) => {
  const { offsetTop, offsetLeft } = canvas;
  mouse.x = clientX - offsetLeft - square.width / 2;
  mouse.y = clientY - offsetTop + square.height / 2;
});

canvas.addEventListener("click", () => {
  if (!gameState.isRunning) {
    sfx.shotgun.volume = 0.5;
    sfx.shotgun.play();
    music.main.volume = 0.7;
    music.main.play();
    gameState.isRunning = true;
    return;
  }
  const mousePosX = mouse.x + square.width / 2;
  const mousePosY = mouse.y + square.height / 2;
  const xClicked =
    mousePosX >= target.x && mousePosX <= target.x + target.width;
  const yClicked =
    mousePosY >= target.y && mousePosY <= target.y + target.height;

  if (xClicked && yClicked) {
    const precisionY = mousePosY - target.y > 20 && mousePosY - target.y < 30;
    const precisionX = mousePosX - target.x > 20 && mousePosX - target.x < 30;

    sfx.shot.play();
    target.x = getRandomInt(0, canvas.width - target.width);
    target.y = getRandomInt(0, canvas.height - target.height);
    if (precisionX && precisionY) {
      gameState.score += 2;
      return;
    }
    gameState.score++;

    return;
  }

  gameState.score--;
});
