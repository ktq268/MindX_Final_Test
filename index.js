const gameBoard = document.querySelector(".game-board");
const gameStatusElement = document.querySelector(".player-turn");
const startButton = document.querySelector(".start-btn");
const restartButton = document.querySelector(".restart-btn");
const gameBeginElement = document.querySelector(".game-status");

const players = ["X", "O"];
let currentPlayer = 0;
let gameState = [];
let gameStarted = false;
let gameOver = false;
let isFirstMove = true;

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", handleCellClick);
    gameBoard.appendChild(cell);
    gameState.push("");
  }
}

function handleCellClick(event) {
  const cell = event.target;
  const index = Array.from(gameBoard.children).indexOf(cell);

  if (
    gameStarted &&
    !gameOver &&
    !cell.classList.contains("X") &&
    !cell.classList.contains("O")
  ) {
    cell.classList.add(players[currentPlayer]);
    gameState[index] = players[currentPlayer];

    const previousPlayer = currentPlayer;
    currentPlayer = (currentPlayer + 1) % 2;
    gameStatusElement.textContent = `Lượt của: ${players[currentPlayer]}`;

    checkWin(previousPlayer);
  }
}

function checkWin(playerIndex) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c] &&
      gameState[a] === players[playerIndex]
    ) {
      gameOver = true;
      gameStatusElement.textContent = `${players[playerIndex]} đã chiến thắng!`;
      highlightWinningCells(combination);
      restartButton.disabled = false;
      return;
    }
  }

  if (!gameState.includes("")) {
    gameOver = true;
    gameStatusElement.textContent = "Hòa!";
    restartButton.disabled = false;
  }
}

function highlightWinningCells(combination) {
  for (let index of combination) {
    gameBoard.children[index].classList.add("winning");
  }
}

function startGame() {
  if (!gameStarted && !gameOver) {
    gameStarted = true;
    gameBeginElement.textContent = "Hãy chiến đấu hết mình!";
    startButton.disabled = true;

    if (isFirstMove) {
      currentPlayer = 0; // Ván đầu tiên luôn là X
      isFirstMove = false;
      gameStatusElement.textContent = "Lượt của: X";
    } else {
      currentPlayer = (currentPlayer + 1) % 2; // Ván tiếp theo, lượt của người chơi tiếp theo
      gameStatusElement.textContent = `Lượt của: ${players[currentPlayer]}`;
    }
  }
}

function restartGame() {
  if (gameOver) {
    gameState = Array(9).fill("");
    currentPlayer = 0;
    gameStarted = false;
    gameOver = false;
    isFirstMove = true;
    gameBeginElement.textContent = "Bấm bắt đầu để chơi";

    startButton.disabled = false;
    restartButton.disabled = true;

    const cells = gameBoard.children;
    for (let cell of cells) {
      cell.classList.remove("X", "O", "winning");
    }
  }
}

createBoard();
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
