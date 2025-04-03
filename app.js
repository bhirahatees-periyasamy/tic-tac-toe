// Define the WebSocket connection URL
const url = "https://tic-tac-toe-ws-zmkv.onrender.com";
const socket = io(url, {
  transports: ["websocket"], // Use WebSocket transport
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Limit reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnections
});

// Game state variables
let lastMoveSymbol = "O"; // Track the last move's symbol
let currentPlayer; // Track the current player
let playerJoined = false; // Track if second player has joined

// Initialize an empty tic-tac-toe board
const gameState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

// WebSocket event handlers
socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Connection Error:", error);
});

// Handle game room creation or joining
const handleGame = (id) => {
  const option = window.prompt("1. Start Game \n2. Join Game");
  const roomId =
    option === "1"
      ? id.toString()
      : option === "2"
      ? window.prompt("Enter your room id").trim()
      : "";
  return [roomId.toString(), Number(option)];
};

// Start a new game session
const startGame = (roomId) => {
  socket.emit("start-game", roomId);
  window.alert(`Room id ${roomId} created`);
};

// Join an existing game session
const joinGame = (roomId) => {
  socket.emit("join-game", roomId);
};

// Event when second player joins
socket.on("player-2-joined", () => {
  console.log("Second player has joined the game");
  window.alert("Second player joined!");
  playerJoined = true;
});

// Handle full room scenario
socket.on("room-full", (msg) => {
  window.alert(msg);
  window.location.reload();
});

// Update board when receiving a move from the server
socket.on("board-update", (data) => {
  const { row, col, symbol } = data;
  lastMoveSymbol = symbol;
  const cell = document.getElementById(`${row}-${col}`);
  if (!gameState[row][col]) renderMove(cell, symbol);
  gameState[row][col] = symbol;
});

// Handle game over scenario
socket.on("game-over", (winningMsg) => {
  window.alert(winningMsg);
  removeEventListeners();
  if (window.confirm("Do you want to play another game?")) {
    window.location.reload();
  }
});

// Generate a unique ID for the player
const id = crypto.randomUUID();
const [roomId, option] = handleGame(id);

// Assign player symbols based on the chosen option
if (option === 1) {
  startGame(roomId);
  currentPlayer = "X";
} else {
  joinGame(roomId);
  currentPlayer = "O";
}

// Create tic-tac-toe board
function createBoard() {
  const board = document.querySelector(".board");
  for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.classList.add(`row-${i}`);
    for (let j = 0; j < 3; j++) {
      const col = document.createElement("button");
      col.classList.add("cell");
      col.setAttribute("id", `${i}-${j}`);
      col.setAttribute("data-row", i);
      col.setAttribute("data-col", j);
      row.appendChild(col);
    }
    board.appendChild(row);
  }
  handleMoves(); // Add event listeners to cells
}

// Handle player moves
function handleClick(e) {
  if (!playerJoined) {
    alert("Wait for the other player");
    return;
  }
  if (lastMoveSymbol === currentPlayer) {
    alert("Wait for other player to move");
    return;
  }

  const cell = e.target;
  const row = parseInt(cell.getAttribute("data-row"));
  const col = parseInt(cell.getAttribute("data-col"));

  if (gameState[row][col] !== "") {
    return;
  }

  gameState[row][col] = currentPlayer;
  renderMove(cell, currentPlayer);

  socket.emit("move", {
    symbol: currentPlayer,
    roomId: roomId,
    col: col,
    row: row,
  });

  if (chooseWinner(gameState, currentPlayer)) {
    removeEventListeners();
    const winningMsg = `${currentPlayer} Wins`;
    socket.emit("game-over", { roomId: roomId, winningMsg });
  } else if (isDraw(gameState)) {
    const bothPlayers = currentPlayer === "X" ? "X and O" : "O and X";
    const winningMsg = `Match is Draw by ${bothPlayers}`;
    socket.emit("game-over", { roomId: roomId, winningMsg });
  }
}

// Render move on the board
function renderMove(cell, player) {
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
  cell.disabled = true;
}

// Add event listeners to board cells
function handleMoves() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.addEventListener("click", handleClick));
}

// Remove event listeners to prevent further moves after game over
function removeEventListeners() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.removeEventListener("click", handleClick));
}

// Check if the game is a draw
function isDraw(board) {
  return board.every((row) => row.every((cell) => cell !== ""));
}

// Check if the current player has won
function chooseWinner(board, currentPlayer) {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === currentPlayer &&
      board[i][1] === currentPlayer &&
      board[i][2] === currentPlayer
    ) {
      return true;
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] === currentPlayer &&
      board[1][j] === currentPlayer &&
      board[2][j] === currentPlayer
    ) {
      return true;
    }
  }

  // Check diagonals
  return (
    (board[0][0] === currentPlayer &&
      board[1][1] === currentPlayer &&
      board[2][2] === currentPlayer) ||
    (board[0][2] === currentPlayer &&
      board[1][1] === currentPlayer &&
      board[2][0] === currentPlayer)
  );
}

// Initialize the game board
createBoard();
