function Gameboard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; ++i) {
        board[i] = [];
        for (let j = 0; j < columns; ++j) {
            board[i].push(Square());
        }
    }

    const getBoard = () => board;

    const getRowsNum = () => rows;

    const getColumnsNum = () => columns;

    const placeMark = (row, column, player) => {
        const square = board[row][column];
        
        if (square.getState() !== '') {
            return;
        }

        square.addSquare(player);
    }

    const emptySquare = (row, column) => {
        const square = board[row][column];

        if (square.getState() === '') {
            return true;
        }

        return false;
    }

    return { getBoard, getRowsNum, getColumnsNum, placeMark, emptySquare };
}

function Square () {
    let state = '';

    const addSquare = (player) => {
        state = player;
    }
    
    const getState = () => state;

    return { addSquare, getState };
}

function GameController (playerOne = 'Player One', playerTwo = 'Player Two') {
    let board = Gameboard();
    let rounds = 0;
    let hasEnded = false;

    const players = [
        {
            name: '',
            mark: 'X',
            score: 0
        },
        {
            name: '',
            mark: 'O',
            score: 0
        }
    ];

    let activePlayer = players[0];

    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getBoard = () => board.getBoard();

    const getActivePlayer = () => activePlayer;

    const setPlayersName = (firstPlayerName, secondPlayerName) => {
        players[0].name = firstPlayerName;
        players[1].name = secondPlayerName;
    };

    const playRound = (row, column) => {
        if (!board.emptySquare(row, column)) {
            return;
        }
                
        board.placeMark(row, column, getActivePlayer().mark);
        ++rounds;

        checkGameState();

        if (!hasEnded) {
            switchTurn();
            return;
        }

        if (hasEnded && getWinningPlayer() != null) {
            getWinningPlayer().score++;
        }
    };

    const getHasEnded = () => {
        return hasEnded;
    }

    const checkGameState = () => {
        if (rounds >= 5 && checkGameWon(getActivePlayer().mark)) {
            hasEnded = true;
        }

        if (rounds === 9) {
            hasEnded = true;
        }
    }

    const getWinningPlayer = () => {
        if (checkGameWon(players[0].mark)) {
            return players[0];
        } else if (checkGameWon(players[1].mark)) {
            return players[1];
        }

        return null;
    }

    const resetGame = () => {
        board = Gameboard();
        activePlayer = players[0];
        rounds = 0;
        hasEnded = false;
    };

    const newGame = () => {
        resetGame();
        players[0].score = 0;
        players[0].name = '';
        players[1].score = 0;
        players[1].name = '';
    }

    const checkGameWon = (mark) => {
        return checkDiagonal(mark) || checkHorizontal(mark) || checkVertical(mark);
    };

    const checkDiagonal = (mark) => {
        const topLeft = board.getBoard()[0][0].getState();    
        const topRight = board.getBoard()[0][2].getState();    
        const middle = board.getBoard()[1][1].getState();    
        const botLeft = board.getBoard()[2][0].getState();    
        const botRight = board.getBoard()[2][2].getState();    

        return topLeft === mark && middle === mark && botRight === mark 
            || topRight === mark && middle === mark && botLeft === mark;
    };

    const checkHorizontal = (mark) => {        
        for (let i = 0; i < board.getRowsNum(); ++i) {
            let ok = false;

            const left = board.getBoard()[i][0].getState();
            const middle = board.getBoard()[i][1].getState();
            const right = board.getBoard()[i][2].getState();

            ok = left === mark && middle === mark && right === mark;

            if (ok) {
                return true;
            }
        }

        return false;
    };

    const checkVertical = (mark) => {
        for (let i = 0; i < board.getColumnsNum(); ++i) {
            let ok = false;

            const top = board.getBoard()[0][i].getState();
            const middle = board.getBoard()[1][i].getState();
            const bot = board.getBoard()[2][i].getState();

            ok = top === mark && middle === mark && bot === mark;

            if (ok) {
                return true;
            }
        }

        return false;
    }

    return { playRound, getActivePlayer, getBoard, getHasEnded, setPlayersName, newGame, getWinningPlayer };
}

(function ScreenController () {
    const gameController = GameController();
    const announcer = document.querySelector('.announcer');
    const leftScore = document.querySelector('#left-score');
    const rightScore = document.querySelector('#right-score');
    const firstPlayerName = document.querySelector('#first-player-name');
    const secondPlayerName = document.querySelector('#second-player-name');
    const tableBoard = document.createElement('div');
    const modeDialog = document.querySelector('.mode-dialog');
    const twoPlDialog = document.querySelector('.two-pl-dialog');
    const winDialog = document.querySelector('.win-dialog');
    const xMark = '<svg class="Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alpha-x</title><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>'
    const oMark = '<svg class="Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alpha-o</title><path d="M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z" /></svg>'
    let isSinglePlayer = true;
    // let sPlTurn = true;

    const start = () => {
        modeDialog.showModal();
        gameController.newGame();
        gameController.setPlayersName(firstPlayerName.textContent, secondPlayerName.textContent);
        leftScore.textContent = '0';
        rightScore.textContent = '0';
    }

    const init = () => {
        listenMode();
        listenTwoPlayers();
    }

    const listenMode = () => {
        const robotButton = document.querySelector('.robot');
        const multiPlayer = document.querySelector('.mpl');

        robotButton.addEventListener('click', (e) =>  {
            e.preventDefault();

            firstPlayerName.textContent = 'You'
            secondPlayerName.textContent = robotButton.value;

            setPlayersName(firstPlayerName, secondPlayerName);
            modeDialog.close();

            createTableFromScratch();
            announceRound();
        });

        multiPlayer.addEventListener('click', () => {
            modeDialog.close();
            twoPlDialog.showModal();
        })
    }

    const listenTwoPlayers = () => {
        const firstInput = document.querySelector('#first-player');
        const secondInput = document.querySelector('#second-player');
        const backBtn = document.querySelector('.cancel-btn');
        const startBtn = document.querySelector('.submit-btn');

        backBtn.addEventListener('click', () => {
            twoPlDialog.close();
            modeDialog.showModal();
        });

        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            firstPlayerName.textContent = firstInput.value;
            secondPlayerName.textContent = secondInput.value;
            firstInput.textContent = '';
            secondInput.textContent = '';

            setPlayersName(firstPlayerName, secondPlayerName);
            twoPlDialog.close();

            createTableFromScratch();
            announceRound();
        });

        setPlayersName(firstPlayerName, secondPlayerName);
    } 

    const createTableFromScratch = () => {
        const center = document.querySelector('#center');

        tableBoard.innerHTML = '';
        tableBoard.classList.add('table-board');

        for (let i = 0; i < 9; ++i) {
            const cell = document.createElement('div');
            const mark = document.createElement('div');
            cell.classList.add('cell');
            mark.classList.add('mark');

            cell.appendChild(mark);

            tableBoard.appendChild(cell);
        
            mark.dataset.row = Math.floor(i / 3);
            mark.dataset.column = i % 3;
        }

        if (!center.contains(tableBoard)) {
            center.appendChild(tableBoard);
        }

            listenForClicks();
    }

    const listenForClicks = () => {
        const markCells = document.querySelectorAll('.mark');
        console.log(markCells);

        markCells.forEach(c => {
            console.log(c);

            c.addEventListener('click', () => {
                if(gameController.getHasEnded() || c.innerHTML !== '') {
                    return;
                }

                if (isSinglePlayer) {
                    placeMarksSinglePlayer(markCells, c);
                } else {
                    placeMarksMultiplayer(c);
                }
            });
        });
    }

    const getRobotChoice = () => {
        return { row: Math.floor(Math.random() * 3), column: Math.floor(Math.random() * 3) }
    }

    const placeMarksSinglePlayer = (divList, div) => {
        const row = div.dataset.row;
        const column = div.dataset.column;
        
        console.log("DAMA");
        gameController.playRound(row, column);
        div.innerHTML = xMark;
            
        if (gameController.getHasEnded()) {
            return;
        }

        let aiMove = getRobotChoice();

        while (true) {
            if (divIsElligible(divList, aiMove)) {
                break;
            }

            aiMove = getRobotChoice();
        }

        console.log(aiMove);
        console.log("Robotuu");
        console.log(getDivWithSets(divList, aiMove));
        const choice = getDivWithSets(divList, aiMove);
        gameController.playRound(aiMove.row, aiMove.column);
        choice.innerHTML = oMark;
        sPlTurn = true;
    }

    const getDivWithSets = (divList, aiMove) => {
        return Array.from(divList).find(div => div.dataset.row == aiMove.row && div.dataset.column == aiMove.column);
    }

    const divIsElligible = (divList, aiMove) => {
        const div = getDivWithSets(divList, aiMove);

        return div.innerHTML === '';
    }

    const placeMarksMultiplayer = (div) => {
        const row = c.dataset.row;
        const column = c.dataset.column;

        if(gameController.getActivePlayer().mark === 'X') {
            c.innerHTML = xMark;
        } else {
            c.innerHTML = oMark;
            console.log("AAAAAAAAAA");
        }

        console.log(gameController.getActivePlayer());
        gameController.playRound(row, column);
    }

    const resetGameBoardMarks = () => {
        tableBoard.childNodes.forEach(div => {
            div.firstChild.innerHtml = '';
        });
    }

    const announceRound = () => {
        const name = gameController.getActivePlayer().name;

        if (name === 'You') {
            announcer.textContent = 'Your turn!';
        } else {
            announcer.textContent = `${name} 's turn`;
        }
    }

    const setPlayersName = () => {
        gameController.setPlayersName(firstPlayerName.textContent, secondPlayerName.textContent);
    }

    init();
    start();
})();