const cells = document.querySelectorAll(".cell");
const xTemplate = document.querySelector("#x-template").innerHTML;
const oTemplate = document.querySelector("#o-template").innerHTML;
const resultText = document.querySelector(".result div");
const playAgainBtn = document.getElementById("play-again-btn");
const banner = document.getElementById("banner");
const bannerText = document.getElementById("banner-text");

// Sounds
const tapSound = new Audio("./assets/tap.mp3");
const resultSound = new Audio("./assets/win.mp3");
const resetSound = new Audio("./assets/reset.mp3");

let currentPlayer = "X";
let board = Array(9).fill(null);
let moves = 0;
let gameOver = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

playAgainBtn.classList.remove("show");
bannerText.className = "text-white text-xlarge scale-in";

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (cell.innerHTML.trim() !== "" || gameOver) return;

    tapSound.currentTime = 0;
    tapSound.play();

    cell.innerHTML = currentPlayer === "X" ? xTemplate : oTemplate;
    board[index] = currentPlayer;
    moves++;

    if (moves >= 5) {
      const winner = checkWinner();
      if (winner) return endGame(`${winner} Wins!`);
      if (moves === 9) return endGame("It's a Draw!");
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
  });
});

function checkWinner() {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      pattern.forEach((i) => cells[i].classList.add("glow"));
      drawWinningLine(pattern);
      return board[a];
    }
  }
  return null;
}

function drawWinningLine(pattern) {
  pattern.forEach((i) => {
    cells[i].classList.add("border", "border-white", "shadow-[0_0_15px_white]");
  });
}

function endGame(winnerText) {
  gameOver = true;
  resultText.textContent = winnerText;
  resultSound.currentTime = 0;
  resultSound.play();
  showWinBanner(winnerText);
  playAgainBtn.classList.add("show");
}

function showWinBanner(text) {
  banner.classList.add("banner-large");

  // Remove previous styles
  bannerText.classList.remove("scale-in", "scale-out", "banner-text-red", "banner-text-blue", "banner-text-pinkblue");

  // Scale out current text
  bannerText.classList.add("scale-out");

  setTimeout(() => {
    bannerText.textContent = text;

    // Add appropriate glow style
    if (text.startsWith("X")) {
      bannerText.classList.add("banner-text-red");
    } else if (text.startsWith("O")) {
      bannerText.classList.add("banner-text-blue");
    } else {
      bannerText.classList.add("banner-text-pinkblue");
    }

    // Scale in new text
    bannerText.classList.remove("scale-out");
    bannerText.classList.add("scale-in");

    setTimeout(() => {
      // Scale out again after 3s
      bannerText.classList.remove("scale-in");
      bannerText.classList.add("scale-out");

      setTimeout(() => {
        // Show "Start!" again and apply pink-blue glow
        bannerText.textContent = "Start!";
        banner.classList.remove("banner-large");

        bannerText.className = "text-white text-xlarge scale-in banner-text-pinkblue";
      }, 400);
    }, 3000);
  }, 400);
}

function resetGame() {
  resetSound.currentTime = 0;
  resetSound.play();

  board = Array(9).fill(null);
  moves = 0;
  currentPlayer = "X";
  gameOver = false;

  cells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("glow", "border", "border-white", "shadow-[0_0_15px_white]");
  });

  banner.classList.remove("banner-large");
  bannerText.textContent = "Start!";
  bannerText.className = "text-white text-xlarge scale-in banner-text-pinkblue";

  resultText.textContent = "Start!";
  playAgainBtn.classList.remove("show");
}

playAgainBtn.addEventListener("click", resetGame);
