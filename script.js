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
        const state = board[row][column].getState();

        if (state !== '') {
            return;
        }

        state.addSquare(player);
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
        this.state = player;
    }
    
    const getState = () => state;

    return { addSquare, getState };
}
