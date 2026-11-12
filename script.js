
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const playerScoreText = document.getElementById("playerScore");
const computerScoreText = document.getElementById("computerScore");
const drawScoreText = document.getElementById("drawScore");

const newGameButton = document.getElementById("newGame");
const resetButton = document.getElementById("reset");

let board = Array(9).fill("");
let gameOver = false;
let computerTurn = false;

let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function getWinner(position) {
    for (const [a, b, c] of winningLines) {
        if (
            position[a] &&
            position[a] === position[b] &&
            position[a] === position[c]
        ) {
            return position[a];
        }
    }
    return position.every(Boolean) ? "draw" : null;
}

function render() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.disabled = Boolean(board[index]) || gameOver || computerTurn;
    });

    playerScoreText.textContent = playerScore;
    computerScoreText.textContent = computerScore;
    drawScoreText.textContent = drawScore;
}

function finishGame(result) {
    gameOver = true;

    if (result === "X") {
        playerScore++;
        statusText.textContent = "🎉 You win!";
    } else if (result === "O") {
        computerScore++;
        statusText.textContent = "🤖 Computer wins!";
    } else {
        drawScore++;
        statusText.textContent = "It's a draw!";
    }

    render();
}

function minimax(position, isMaximizing) {
    const result = getWinner(position);

    if (result === "O") return 10;
    if (result === "X") return -10;
    if (result === "draw") return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (!position[i]) {
                position[i] = "O";
                bestScore = Math.max(
                    bestScore,
                    minimax(position, false)
                );
                position[i] = "";
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {
            if (!position[i]) {
                position[i] = "X";
                bestScore = Math.min(
                    bestScore,
                    minimax(position, true)
                );
                position[i] = "";
            }
        }

        return bestScore;
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = "O";
            const score = minimax(board, false);
            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== -1) {
        board[bestMove] = "O";
    }

    computerTurn = false;

    const result = getWinner(board);

    if (result) {
        finishGame(result);
    } else {
        statusText.textContent = "Your turn! Choose a square.";
        render();
    }
}

function playerMove(index) {
    if (gameOver || computerTurn || board[index]) return;

    board[index] = "X";

    const result = getWinner(board);

    if (result) {
        finishGame(result);
        return;
    }

    computerTurn = true;
    statusText.textContent = "Computer is thinking...";
    render();

    setTimeout(computerMove, 400);
}

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => playerMove(index));
});

function newGame() {
    board = Array(9).fill("");
    gameOver = false;
    computerTurn = false;
    statusText.textContent = "Your turn! Choose a square.";
    render();
}

newGameButton.addEventListener("click", newGame);

resetButton.addEventListener("click", () => {
    playerScore = 0;
    computerScore = 0;
    drawScore = 0;
    newGame();
});

render();
