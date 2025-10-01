//Gameboard IIFE that stores the gameboard.
const Gameboard = (() => {

    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    return {
        createPlayer(name, marker) {
            return {
                name,
                marker
            }
        },
        placeMarker(row, col, marker) {
            if (board[row][col] == null) {
                board[row][col] = marker;
                return true;
            }
            else {
                return false;
            }
        },
        getBoard() {
            return board.map(row => [...row]);
        },

        reset() {
            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board.length; col++) {
                    board[row][col] = null;
                }
            }
        }
    };
})();

//IIFE that controls flow of game logic
const Gamecontroller = (() => {

    const winningConditions = [
        //Row win conditions
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        //Col win conditions
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        //Diag win conditions
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    let turnTracker = 1;

    function winOrTieChecker() {
        let currentBoard = Gameboard.getBoard();

        for (const line of winningConditions) {
            const [r0, c0] = line[0];
            const [r1, c1] = line[1];
            const [r2, c2] = line[2];

            const val0 = currentBoard[r0][c0];
            const val1 = currentBoard[r1][c1];
            const val2 = currentBoard[r2][c2];

            //Win check conditional
            if ((val0 != null) && (val0 == val1) && (val1 == val2)) {
                return val0;
            }
        }

        const fullBoardCheck = currentBoard.flat().every(cell => cell !== null);

        if (fullBoardCheck) {
            return "Tie"
        }

        return false;
    }

    return {

        playRound(row, col) {
            const marker = players[turnTracker - 1].marker;

            //Checks if the playRound func received the correct amt of args.
            if (arguments.length != 2) {
                console.log("Please provide a row number and a column number");
                return;
            }

            //If a player selects an already taken tile, do not advance the turn. 
            if (!Gameboard.placeMarker(row, col, marker)) {
                return;
            }

            const gameStatus = winOrTieChecker();

            if (gameStatus == "Tie") {
                console.log("It's a tie!");
            }

            else if (gameStatus == false) {
                //Continue game, change turn
                turnTracker = (turnTracker === 1) ? 2 : 1;
                console.log(`${players[turnTracker - 1].name} is up next.`);
            }
            else {
                console.log(`${players[turnTracker - 1].name} wins!`)
            }
        },
        setupPlayers() {
            let playerX = document.getElementById("playerX-name").value;
            let playerO = document.getElementById("playerO-name").value;
            players = [Gameboard.createPlayer(playerX, "X"), Gameboard.createPlayer(playerO, "O")];
        },

        getCurrentPlayer() {
            return players[turnTracker - 1];
        },

        reset() {
            Gameboard.reset();
            turnTracker = 1;
        },

        getGameStatus() {
            return winOrTieChecker();
        }
    }
})();

const Displaycontroller = (() => {
    const displayStatus = document.querySelector(".gameStatus");
    const boardTiles = document.querySelectorAll(".board-tiles");
    const resetButton = document.querySelector(".reset");
    const nameInput = document.querySelectorAll(".name-input")
    const startButton = document.querySelector(".start");

    function tileClick() {
        const row = Number(this.dataset.row);
        const col = Number(this.dataset.col);
        Gamecontroller.playRound(row, col);
        Displaycontroller.updateDisplay();
    }

    resetButton.addEventListener("click", () => {
        boardTiles.forEach(boardTiles => {
            boardTiles.textContent = "";
        })
        nameInput.forEach(nameInput => {
            nameInput.value = "";
        })
        Displaycontroller.reset();
    });

    startButton.addEventListener("click", () => {
        Displaycontroller.initializegame();
    })

    return {
        initializegame() {
            Gamecontroller.setupPlayers();
            this.updateDisplay();
            boardTiles.forEach(boardTiles => {
                boardTiles.addEventListener("click", tileClick)
            })
            nameInput.forEach(nameInput => {
                nameInput.disabled = true;
            })
            startButton.disabled = true;
        },

        updateDisplay() {
            const currentBoard = Gameboard.getBoard();
            for (let row = 0; row < currentBoard.length; row++) {
                for (let col = 0; col < currentBoard.length; col++) {
                    const tileLocation = document.querySelector(`[data-row = "${[row]}"][data-col="${[col]}"]`);
                    tileLocation.textContent = currentBoard[row][col];
                }
            }
            if (Gamecontroller.getGameStatus() == "Tie") {
                displayStatus.textContent = "It's a tie!";
                boardTiles.forEach(boardTiles => {
                    boardTiles.removeEventListener("click", tileClick);
                })
            }
            else if (Gamecontroller.getGameStatus() == false) {
                displayStatus.textContent = `It is ${Gamecontroller.getCurrentPlayer().name}'s turn`;
            }
            else {
                displayStatus.textContent = `The winner is ${Gamecontroller.getCurrentPlayer().name}!`;
                boardTiles.forEach(boardTiles => {
                    boardTiles.removeEventListener("click", tileClick);
                })
            }
        },

        reset() {
            displayStatus.textContent = "";
            nameInput.forEach(nameInput => {
                nameInput.disabled = false;
            })
            startButton.disabled = false;
            Gamecontroller.reset();
        }
    }
})();