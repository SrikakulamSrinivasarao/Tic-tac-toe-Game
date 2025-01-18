let boxes = document.querySelectorAll(".box");
let turn = "X";
let isGameOver = false;
let gameMode = "human";  // Default game mode: human vs human
let isAITurn = false;
let aiSymbol = "O"; // AI plays with "O", Human plays with "X"

// Human vs AI mode toggle button
document.querySelector("#toggle-game-mode").addEventListener("click", () => {
    gameMode = (gameMode === "human") ? "ai" : "human";
    let modeText = (gameMode === "ai") ? "Switch to Human Mode" : "Switch to AI Mode";
    document.querySelector("#toggle-game-mode").innerText = modeText;

    // If switched to AI mode and it’s the AI's turn, make the AI move
    if (gameMode === "ai" && turn === aiSymbol) {
        isAITurn = true;
        aiMove();
    }
});

// Box event listener for Human's move
boxes.forEach(e => {
    e.innerHTML = "";
    e.addEventListener("click", () => {
        if (!isGameOver && e.innerHTML === "") {
            if (!isAITurn) {  // Player move (Human's turn)
                e.innerHTML = turn;
                checkWin();
                checkDraw();
                changeTurn();
                if (!isGameOver && gameMode === "ai") {
                    isAITurn = true;  // Now it's AI's turn
                    aiMove();
                }
            }
        }
    });
});

// Change turn
function changeTurn() {
    if (turn === "X") {
        turn = aiSymbol;
        document.querySelector(".bg").style.left = "85px";
    } else {
        turn = "X";
        document.querySelector(".bg").style.left = "0";
    }
}

// Check for a win
function checkWin() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winConditions.length; i++) {
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if (v0 !== "" && v0 === v1 && v0 === v2) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = turn + " wins!";
            document.querySelector("#play-again").style.display = "inline";
            for (let j = 0; j < 3; j++) {
                boxes[winConditions[i][j]].style.backgroundColor = "#08D9D6";
                boxes[winConditions[i][j]].style.color = "#000";
            }
        }
    }
}

// Check for a draw
function checkDraw() {
    if (!isGameOver) {
        let isDraw = true;
        boxes.forEach(e => {
            if (e.innerHTML === "") isDraw = false;
        });

        if (isDraw) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = "Draw!";
            document.querySelector("#play-again").style.display = "inline";
        }
    }
}

// AI Move with basic strategy
function aiMove() {
    let emptyBoxes = [];
    boxes.forEach((box, index) => {
        if (box.innerHTML === "") {
            emptyBoxes.push(index);
        }
    });

    // AI Strategy: Block, Win, or Random
    let move = bestMove(emptyBoxes);
    boxes[move].innerHTML = aiSymbol;
    checkWin();
    checkDraw();
    changeTurn();
    isAITurn = false;
}

// Best move based on AI strategy
function bestMove(emptyBoxes) {
    // 1. Try to win
    let winningMove = findWinningMove(aiSymbol);
    if (winningMove !== -1) return winningMove;

    // 2. Block opponent from winning
    let blockingMove = findWinningMove("X");
    if (blockingMove !== -1) return blockingMove;

    // 3. Take center if empty
    if (emptyBoxes.includes(4)) return 4;

    // 4. Take a corner (if available)
    let corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
        if (emptyBoxes.includes(corners[i])) return corners[i];
    }

    // 5. Otherwise, take any empty space
    return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
}

// Find winning move for given player symbol
function findWinningMove(symbol) {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winConditions.length; i++) {
        let line = winConditions[i];
        let [a, b, c] = line;
        let values = [boxes[a].innerHTML, boxes[b].innerHTML, boxes[c].innerHTML];

        if (values.filter(v => v === symbol).length === 2 && values.includes("")) {
            return line[values.indexOf("")];
        }
    }
    return -1;
}

// Play again logic
document.querySelector("#play-again").addEventListener("click", () => {
    isGameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    });
});

// Add event listener to the Refresh button
document.querySelector("#refresh-game").addEventListener("click", () => {
    // Reset game variables
    isGameOver = false;
    turn = "X";
    gameMode = "human";
    isAITurn = false;

    // Reset UI elements
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";
    document.querySelector("#toggle-game-mode").innerText = "Switch to AI Mode";
    document.querySelector("#toggle-game-mode").classList.remove("ai-mode");

    // Clear the game board
    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    });
});
