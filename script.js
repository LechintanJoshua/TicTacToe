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

    return { getBoard, placeMark, printBoard };
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

        switchTurn();
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer, getBoard: board.getBoard };
}
