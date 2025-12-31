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

    const printBoard = () => {
        const boardWithStates = board.map((row) => row.map((column) => column.getState()));
        console.log(boardWithStates);
    };

    return { getBoard, getRowsNum, getColumnsNum, placeMark, printBoard };
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
    const board = Gameboard();
    let rounds = 0;

    const players = [
        {
            name: playerOne,
            mark: 'X'
        },
        {
            name: playerTwo,
            mark: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, column) => {
        console.log(`Placing ${getActivePlayer().mark} into row: ${row} and column: ${column}`);
        board.placeMark(row, column, getActivePlayer().mark);
        ++rounds;

        printNewRound();
        
        if (rounds >= 5 && checkGameWon(getActivePlayer().mark)) {
            console.log(`Player ${getActivePlayer().name} has won!`);
        }

        switchTurn();
    };

    const checkGameWon = (mark) => {
        return checkDiagonal(mark) || checkHorizontal(mark) || checkVertical(mark);
    }

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

    return { playRound, getActivePlayer, getBoard: board.getBoard };
}

const c = GameController();
