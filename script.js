//Module that stores the gameboard
const Gameboard = (() => {

    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    //Public functions
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

//Module that controls flow of game logic
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

    let players = [];
    let turnTracker = 1; //Tracks whose turn it is. Initial value is 1 which indictates it is Player 1s turn.

    function winOrTieChecker() {
        let currentBoard = Gameboard.getBoard();

        for (const line of winningConditions) {
            const teamAtWinningCord = [];

            // iterate through each line and get the team that's at the winning coordinate
            for(const coordinate of line){
                const [r, c] = coordinate;
                const team = currentBoard[r][c];
                teamAtWinningCord.push(team); // store the team at the winning coordinate into the array
            }
            
            // check if all the elements in the winning positons are the same, if so, then we must have a winner!
            const isWinner = teamAtWinningCord.every(element => teamAtWinningCord[0] === element);
            if (teamAtWinningCord[0] !== null && isWinner) { 
                return teamAtWinningCord[0];
            }
        }

        //Checks to see if all tiles of the board have a value, indicating that the board is full.
        const fullBoardCheck = currentBoard.flat().every(tile => tile !== null);

        if (fullBoardCheck) {
            return "Tie";
        }

        return false;
    }

    //Public functions
    return {
        playRound(row, col) {
            const marker = players[turnTracker - 1].marker;

            //Checks if the playRound func received the correct amt of args.
            if (arguments.length != 2) {
                throw new Error("playRound received an invalid amount of args. Arg count must = 2");

            }

            //If a player selects an already taken tile, do not advance the turn.
            if (!Gameboard.placeMarker(row, col, marker)) {
                return;
            }

            const gameStatus = winOrTieChecker();

            if (gameStatus == false) {
                //Continue the game and update the turnTracker's value to the next players turn
                turnTracker = (turnTracker === 1) ? 2 : 1;

            }
        },

        setupPlayers() {
            let playerX = document.getElementById("playerX-name").value;
            let playerO = document.getElementById("playerO-name").value;
            players = [Gameboard.createPlayer(playerX, "X"),
                Gameboard.createPlayer(playerO, "O")
            ];
        },

        getCurrentPlayer() {
            return players[turnTracker - 1];
        },

        reset() {
            Gameboard.reset();
            players = [];
            turnTracker = 1;
        },

        getGameStatus() {
            return winOrTieChecker();
        }
    }
})();

//Module that controls DOM manipulation
const Displaycontroller = (() => {
    const displayStatus = document.querySelector(".gameStatus");
    const boardTiles = document.querySelectorAll(".board-tiles");
    const resetButton = document.querySelector(".reset");
    const nameInput = document.querySelectorAll(".name-input")
    const startButton = document.querySelector(".start");

    //Gets data-attr from clicked tile and passes as args to playRound func
    function tileClick() {
        const row = Number(this.dataset.row);
        const col = Number(this.dataset.col);
        Gamecontroller.playRound(row, col);
        Displaycontroller.updateDisplay();
    }

    //Clears the board's text content, input values, and re-enables start button & input
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

    //Public functions
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
                displayStatus.textContent = `It's ${Gamecontroller.getCurrentPlayer().name}'s turn`;
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
})()
