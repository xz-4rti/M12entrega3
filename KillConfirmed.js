// Estado global del juego
const gameState = {
  score: 0,
  time: 60,
  lives: 3,
  intervalId: null,
  moveIntervalId: null,
};

// Arreglos de imágenes
const enemyImages = [
  "cupheadEnemigo.png",
  "diddyEnemigo.png",
  "freezerEnemigo.png",
  "godzillaEnemigo.png",
  "jokerEnemigo.png",
];

const allyImages = [
  "lamineAliado.png",
  "broncanoAliado.png",
  "estopaAliado.png",
  "kennyAliado.png",
  "marioAliado.png",
];

// Inicialización del juego
window.addEventListener("load", initGame);

function initGame() {
  setupEventListeners();
  showPage("start-page");
  setupGunImage();
}

// Configurar los eventos del juego
function setupEventListeners() {
  document
    .getElementById("nextScreenButton")
    .addEventListener("click", () => showPage("rules-page"));
  document
    .getElementById("backToStartButton")
    .addEventListener("click", () => showPage("start-page"));
  document
    .getElementById("startGameButton")
    .addEventListener("click", startGame);
  document
    .getElementById("playAgainButton")
    .addEventListener("click", resetGame);
  document.getElementById("retryButton").addEventListener("click", resetGame);

  const gameArea = document.querySelector(".game-area");
  gameArea.addEventListener("click", handleCharacterClick);
  gameArea.addEventListener("click", createImageOnClick);
}

// Mostrar una página específica
function showPage(pageClass) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => (page.style.display = "none"));
  document.querySelector(`.${pageClass}`).style.display = "block";
}

// Configurar imagen fija del arma
function setupGunImage() {
  const gameArea = document.querySelector(".game-area");

  const gunImg = document.createElement("img");
  gunImg.id = "gunImage";
  gunImg.src = "image/gun.png";
  gunImg.style.position = "fixed";
  gunImg.style.width = "200px";
  gunImg.style.height = "200px";
  gunImg.style.bottom = "130px";
  gunImg.style.right = "400px";

  gameArea.appendChild(gunImg);
}

// Iniciar el juego
function startGame() {
  resetGameState();
  updateUI();
  showPage("game-page");
  startTimer();
  startCharacterMovement();
}

// Reiniciar el estado del juego
function resetGameState() {
  gameState.score = 0;
  gameState.time = 60;
  gameState.lives = 3;

  clearInterval(gameState.intervalId);
  clearInterval(gameState.moveIntervalId);
}

// Iniciar el temporizador
function startTimer() {
  gameState.intervalId = setInterval(() => {
    gameState.time -= 1;
    updateUI();

    if (gameState.time <= 0 || gameState.lives <= 0) {
      endGame(gameState.lives > 0 ? "victory" : "defeat");
    }
  }, 1000);
}

// Iniciar el movimiento de los personajes
function startCharacterMovement() {
  const enemies = document.querySelectorAll(".enemy");
  const allies = document.querySelectorAll(".ally");

  gameState.moveIntervalId = setInterval(() => {
    repositionAndChangeImages(enemies, enemyImages);
    repositionAndChangeImages(allies, allyImages);
  }, 800); // Mover cada 0.8 segundo
}

// Función para reposicionar y cambiar imágenes de personajes
function repositionAndChangeImages(characters, images) {
  characters.forEach((character) => {
    const gameArea = document.querySelector(".game-area");
    const maxWidth = gameArea.offsetWidth - character.offsetWidth;
    const maxHeight = gameArea.offsetHeight - character.offsetHeight;

    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Reposicionar el personaje
    character.style.left = `${randomX}px`;
    character.style.top = `${randomY}px`;

    // Cambiar la imagen del personaje
    character.style.backgroundImage = `url("image/${randomImage}")`;
  });
}

const playHitSound = () => {
  const hitSound = new Audio("audio/hit.mp3");
  console.log("golpe");
  hitSound.play();
};

const playShootSound = () => {
  const shootSound = new Audio("audio/shot.mp3");
  console.log("disparo");
  shootSound.play();
};

// Manejar clics en personajes
function handleCharacterClick(event) {
  playShootSound();
  if (event.target.classList.contains("enemy")) {
    console.log("enemigo golpeado");
    playHitSound();
    gameState.score += 10;
    document.title = `Kill Confirmed | Score: ${score}`;
  } else if (event.target.classList.contains("ally")) {
    console.log("aliado golpeado");
    playHitSound();
    gameState.lives -= 1;
  }
  updateUI();

  if (gameState.lives <= 0) {
    endGame("defeat");
  }
}

// Musika
const toggleAudio = document.getElementById("toggleAudio");
const audioPlayer = document.getElementById("audioPlayer");

toggleAudio.addEventListener("change", () => {
  if (toggleAudio.checked) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

// Crear una imagen temporal de disparo en la esquina inferior derecha
function createImageOnClick(event) {
  const gunImg = document.getElementById("gunImage");

  // Cambiar a la imagen de disparo
  gunImg.src = "image/gunshot.png";
  gunImg.style.position = "fixed";
  gunImg.style.width = "200px";
  gunImg.style.height = "200px";
  gunImg.style.bottom = "130px";
  gunImg.style.right = "400px";

  // Restaurar la imagen normal después de 0.1 segundos
  setTimeout(() => {
    gunImg.src = "image/gun.png";
  }, 100);
}

// Finalizar el juego
function endGame(outcome) {
  clearInterval(gameState.intervalId);
  clearInterval(gameState.moveIntervalId);

  const playVictorySound = new Audio("audio/victory.mp3");
  const playDefeatSound = new Audio("audio/defeat.mp3");

  if (outcome === "victory") {
    document.getElementById("finalScore").innerText = gameState.score;
    showPage("victory-page");
    playVictorySound.play();
  } else {
    document.getElementById("finalScoreDefeat").innerText = gameState.score;
    showPage("defeat-page");
    playDefeatSound.play();
  }
}

// Actualizar la interfaz
function updateUI() {
  document.getElementById("scoreCounter").innerText = gameState.score;
  document.getElementById("timeCounter").innerText = gameState.time;
  document.getElementById("livesCounter").innerText = gameState.lives;
}

// Reiniciar el juego
function resetGame() {
  resetGameState();
  showPage("start-page");
}
