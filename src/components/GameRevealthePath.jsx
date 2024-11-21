// script.js
const MAX_PATH_LENGTH = 70;
const MIN_PATH_LENGTH = 10;
const MULTIPLE_OF = 5;
const MAX_LIVES = 10;

let player = {
    symbol: 'P',
    lives: 3,
    treasuresFound: 0,
    history: []
};

let game = {
    maxMoves: 20,
    pathLength: 20,
    bombs: Array(20).fill(0),
    treasures: Array(20).fill(0)
};

function resetHistory(history, length) {
    for (let i = 0; i < length; i++) {
        history[i] = -1;
    }
}

function startGame() {
    player.symbol = document.getElementById('player-symbol').value;
    player.lives = parseInt(document.getElementById('player-lives').value);
    game.pathLength = parseInt(document.getElementById('path-length').value);
    game.maxMoves = Math.floor(game.pathLength * 0.75);

    game.bombs = Array(game.pathLength).fill().map(() => Math.random() < 0.2 ? 1 : 0);
    game.treasures = Array(game.pathLength).fill().map(() => Math.random() < 0.2 ? 1 : 0);

    player.treasuresFound = 0;
    resetHistory(player.history, game.pathLength);

    createGameBoard();
}

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    for (let i = 0; i < game.pathLength; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.onclick = () => handleCellClick(i);
        gameBoard.appendChild(cell);
    }
}

function handleCellClick(index) {
    if (player.history.includes(index)) return;
    player.history.push(index);

    const cell = document.querySelectorAll('.cell')[index];
    cell.classList.add('clicked');

    let message = '';

    if (game.bombs[index] === 1) {
        message = 'Boom! You hit a bomb!';
        player.lives--;
    } else if (game.treasures[index] === 1) {
        message = 'Yay! You found a treasure!';
        player.treasuresFound++;
    } else {
        message = 'Nothing here. Keep moving!';
    }

    if (player.lives <= 0) {
        message = 'Game Over! You ran out of lives.';
        disableGameBoard();
    }

    document.getElementById('status').textContent = message;
}

function disableGameBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.onclick = null);
}
