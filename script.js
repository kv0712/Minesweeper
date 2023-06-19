const ROWS = 10;
const COLS = 10;
const BOMBS = 10;




let board = [];
let startTime;
let timerInterval;

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const timerElement = document.getElementById("timer");
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, "0");
  const seconds = (elapsedTime % 60).toString().padStart(2, "0");
  timerElement.textContent = `⏱️${minutes}:${seconds}`;
}




function initBoard() {
  for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLS; j++) {
      board[i][j] = {
        isBomb: false,
        neighborBombs: 0,
        isClicked: false,
        isFlagged: false,
      };
    }
  }
  
  let bombsPlaced = 0;
  while (bombsPlaced < BOMBS) {
    let row = Math.floor(Math.random() * ROWS);
    let col = Math.floor(Math.random() * COLS);
    if (!board[row][col].isBomb) {
      board[row][col].isBomb = true;
      bombsPlaced++;
    }
  }
  
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (board[i][j].isBomb) {
        continue;
      }
      let neighborBombs = 0;
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          if (i + k < 0 || i + k >= ROWS || j + l < 0 || j + l >= COLS) {
            continue;
          }
          if (board[i + k][j + l].isBomb) {
            neighborBombs++;
          }
        }
      }
      board[i][j].neighborBombs = neighborBombs;
    }
  }
  
  
}

function renderBoard() {
  let gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  for (let i = 0; i < ROWS; i++) {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    for (let j = 0; j < COLS; j++) {
      let cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      if (board[i][j].isClicked) {
        if (board[i][j].isBomb) {
          cellDiv.innerHTML = "💣";
        } else if (board[i][j].neighborBombs > 0) {
          cellDiv.textContent = board[i][j].neighborBombs;
        }
        cellDiv.classList.add("clicked");
      } else if (board[i][j].isFlagged) {
        cellDiv.innerHTML = "🚩";
      }
      cellDiv.addEventListener("click", () => {
        handleClick(i, j);
      });
      cellDiv.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        handleRightClick(i, j);
      });
      rowDiv.appendChild(cellDiv);
    }
    gameBoard.appendChild(rowDiv);
  }

  let flagCount = BOMBS;
  for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
          if (board[i][j].isFlagged) {
              if(flagCount>0){
                flagCount--
              }
          }
      }
  }

  const flagsRemaining = document.getElementById("flags-remaining");
  flagsRemaining.textContent = `🚩 ${flagCount}`;

  if (checkWin()) {
    alert("Победа!");
    initBoard();
    startTimer();
    renderBoard();
  }
  
}

function handleClick(row, col) {
  if (board[row][col].isClicked || board[row][col].isFlagged) {
    return;
  }
  board[row][col].isClicked = true;
  if (board[row][col].isBomb) {
    alert("Game over!");
    initBoard();
    startTimer();
    renderBoard();
  } 
  else if (board[row][col].neighborBombs === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (row + i < 0 || row + i >= ROWS || col + j < 0 || col + j >= COLS) {
          continue;
        }
        handleClick(row + i, col + j);
      }
    }
  }
  
  renderBoard();
  
}

function handleRightClick(row, col) { 
  if (board[row][col].isClicked) { 
    return; 
  } 

  board[row][col].isFlagged = !board[row][col].isFlagged;
 
  renderBoard(); 
   
} 



function checkWin() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (!board[i][j].isClicked && !board[i][j].isBomb ) {
        return false;
      }
    }
  }
  return true;
}



const newGameButton = document.getElementById("new-game");
newGameButton.addEventListener("click", () => {
  initBoard();
  const timerElement = document.getElementById("timer");
  timerElement.style.display = "block";
  const flagsRemainingElement = document.getElementById("flags-remaining");
  flagsRemainingElement.style.display = "block";
  startTimer();
  renderBoard();
});



