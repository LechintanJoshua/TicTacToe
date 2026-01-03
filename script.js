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

    const printBoard = () => {
        const boardWithStates = board.map((row) => row.map((column) => column.getState()));
        console.log(boardWithStates);
    };

    return { getBoard, getRowsNum, getColumnsNum, placeMark, printBoard, emptySquare };
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

    const players = [
        {
            name: playerOne,
            mark: 'X',
            score: 0
        },
        {
            name: playerTwo,
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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, column) => {
        if (!board.emptySquare(row, column)) {
            return;
        }
        
        console.log(`Placing ${getActivePlayer().mark} into row: ${row} and column: ${column}`);
        
        board.placeMark(row, column, getActivePlayer().mark);
        ++rounds;

        printNewRound();
        
        if (rounds >= 5 && checkGameWon(getActivePlayer().mark)) {
            console.log(`Player ${getActivePlayer().name} has won!`);
            getActivePlayer().score++;
            return;
        } else if (rounds === 9 && !checkGameWon(getActivePlayer().mark)) {
            console.log(`It's a tie!`);
            return;
        } 

        switchTurn();
    };

    const resetGame = () => {
        board = Gameboard();
        activePlayer = players[0];
        printNewRound();
        rounds = 0;
    };

    const newGame = () => {
        resetGame();
        players[0].score = 0;
        players[1].score = 0;
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

    printNewRound();

    return { playRound, getActivePlayer, getBoard, resetGame, newGame };
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
    
    
    const start = () => {
        modeDialog.showModal();
    }

    const init = () => {
        listenMode();
        listenTwoPlayers();
    }

    const listenMode = () => {
        const robotButton = document.querySelector('.robot');
        const multiPlayer = document.querySelector('.mpl');

        robotButton.addEventListener('click', () =>  {
            secondPlayerName.textContent = robotButton.value;
            
            modeDialog.close();

            createTableFromScratch();
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
            
            firstPlayerName = firstInput.value;
            secondPlayerName = secondInput.value;
            firstInput.textContent = '';
            secondInput.textContent = '';

            twoPlDialog.close();

            console.log(firstPlayerName);
            console.log(secondPlayerName);

            createTableFromScratch();
        });
    } 

    const createTableFromScratch = () => {
        const center = document.querySelector('#center');

        tableBoard.classList.add('table-board');

        for (let i = 0; i < 9; ++i) {
            const cell = document.createElement('div');
            const mark = document.createElement('div');
            cell.classList.add('cell');
            mark.classList.add('mark');

            cell.appendChild(mark);

            tableBoard.appendChild(cell);
        }

        center.appendChild(tableBoard);
    }

    init();
    start();

})();
