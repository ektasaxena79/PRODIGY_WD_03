const board = document.getElementById("board");
const status = document.getElementById("status");
let currentPlayer = "X";
let cells = Array(9).fill("");
let isGameOver = false;

function drawBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleClick(index));
    board.appendChild(cellDiv);
  });
}

function handleClick(index) {
  if (cells[index] === "" && !isGameOver && currentPlayer === "X") {
    cells[index] = "X";
    drawBoard();
    if (checkWinner("X")) {
      status.textContent = "You win! 🎉";
      isGameOver = true;
      return;
    } else if (cells.every(cell => cell !== "")) {
      status.textContent = "It's a draw!";
      isGameOver = true;
      return;
    }

    currentPlayer = "O";
    status.textContent = "AI's turn...";
    setTimeout(() => {
      const bestMove = getBestMove();
      cells[bestMove] = "O";
      drawBoard();
      if (checkWinner("O")) {
        status.textContent = "AI wins! 🤖";
        isGameOver = true;
      } else if (cells.every(cell => cell !== "")) {
        status.textContent = "It's a draw!";
        isGameOver = true;
      } else {
        currentPlayer = "X";
        status.textContent = "Your turn!";
      }
    }, 500);
  }
}

function checkWinner(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index] === player)
  );
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (cells[i] === "") {
      cells[i] = "O";
      let score = minimax(cells, 0, false);
      cells[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWinner("O")) return 1;
  if (checkWinner("X")) return -1;
  if (boardState.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = "";
        best = Math.max(score, best);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = "";
        best = Math.min(score, best);
      }
    }
    return best;
  }
}

function restartGame() {
  cells = Array(9).fill("");
  currentPlayer = "X";
  isGameOver = false;
  status.textContent = "Your turn!";
  drawBoard();
}

restartGame();