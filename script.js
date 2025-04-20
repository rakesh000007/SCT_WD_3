let currentPlayer = 'X';
let gameBoard = Array(9).fill("");
let gameActive = true;
let mode = 'cpu';
let scores = { X: 0, O: 0 };

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

document.querySelectorAll("input[name='mode']").forEach(radio => {
  radio.addEventListener("change", () => {
    mode = radio.value;
    resetGame();
  });
});

function handleClick(event) {
  const index = event.target.dataset.index;

  if (!gameActive || gameBoard[index] !== "" || (mode === 'cpu' && currentPlayer === 'O')) return;

  makeMove(index);

  if (mode === 'cpu' && gameActive) {
    setTimeout(() => {
      const move = getBestMove();
      makeMove(move);
    }, 500);
  }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add("pop");
  
    if (checkWin()) {
      const playerName = document.getElementById(currentPlayer === 'X' ? "playerX" : "playerO").value || `Player ${currentPlayer}`;
      statusText.textContent = `${playerName} Wins! 🏆`;
      createConfetti(); // Trigger confetti
      gameActive = false;
      scores[currentPlayer]++;
      updateScore();
    } else if (!gameBoard.includes("")) {
      statusText.textContent = "It's a Draw!";
      createConfetti(); // Trigger confetti for a draw
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatusText();
    }
  }

function updateStatusText() {
  const playerName = document.getElementById(currentPlayer === 'X' ? "playerX" : "playerO").value || `Player ${currentPlayer}`;
  statusText.textContent = `${playerName}'s Turn`;
}

function checkWin() {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return wins.some(([a,b,c]) =>
    gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]
  );
}

function resetGame() {
  gameBoard.fill("");
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = "Player X's Turn";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("pop");
  });
  updateStatusText();
}

function updateScore() {
  scoreX.textContent = scores["X"];
  scoreO.textContent = scores["O"];
}

// Minimax CPU logic
function getBestMove() {
  const best = minimax(gameBoard, 'O');
  return best.index;
}

function minimax(board, player) {
  const available = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);

  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  if (wins.some(([a,b,c]) => board[a] === 'X' && board[a] === board[b] && board[b] === board[c])) {
    return { score: -10 };
  } else if (wins.some(([a,b,c]) => board[a] === 'O' && board[a] === board[b] && board[b] === board[c])) {
    return { score: 10 };
  } else if (available.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i of available) {
    let move = {};
    move.index = i;
    board[i] = player;

    let result = minimax(board, player === 'O' ? 'X' : 'O');
    move.score = result.score;

    board[i] = "";
    moves.push(move);
  }

  return player === 'O'
    ? moves.reduce((best, move) => move.score > best.score ? move : best)
    : moves.reduce((best, move) => move.score < best.score ? move : best);
}

cells.forEach(cell => cell.addEventListener("click", handleClick));

function createConfetti() {
    const confettiCount = 100;  // Number of confetti pieces
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.left = `${Math.random() * 100}vw`; // Random position on the screen
      confetti.style.animationDelay = `${Math.random() * 2}s`; // Random animation delay
      document.body.appendChild(confetti);
  
   
      confetti.addEventListener("animationend", () => {
        confetti.remove();
      });
    }
  }

  