const TILE_IMAGE = 'assets/tile.png';
const TILES = ['burger', 'cherry', 'dumpling', 'fire', 'hotdog', 'ketchup', 
            'marshmallow_bluepink', 'marshmallow_pink', 'pepper', 'weiner'];

const STATE_NO_MATCH = 1;
const STATE_DURING_MATCH = 2;
const STATE_AWAIT_TIMEOUT = 3;
const STATE_LOST = 4;
const STATE_WON = 5;

let TILE_SET = [];
let score = 0;
let timeLeft = 60;
let timerStarted = false;
let game_state = STATE_NO_MATCH;
let matchAttempt = -1;
let timer = undefined;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    shuffleTiles();
    bindTileEvent();

    document.querySelectorAll('.reset').forEach((button, index) => button.addEventListener('click', () => location.reload()));
}

function shuffleTiles() {
    TILE_SET = TILES.concat(TILES);
    TILE_SET = TILE_SET.sort((a, b) => 0.5 - Math.random());
}

function bindTileEvent() {
    let tiles = document.querySelectorAll('.tile');

    for (let tile of tiles) {
        tile.addEventListener('click', (e) => tileClicked(e));
    }
}

function tileClicked(e) {
    let tile = e.target;

    if (!timerStarted) startTimer();
    if (!tile.src == 'assets/tile.png') return;

    if (game_state == STATE_NO_MATCH) {
        matchAttempt = tile;
        game_state = STATE_DURING_MATCH;
        tile.src = `assets/${TILE_SET[tile.id]}.png`;
    } else if (game_state == STATE_DURING_MATCH) {
        tile.src = `assets/${TILE_SET[tile.id]}.png`;
        if (tile.src == matchAttempt.src) {
            addPoint();
            game_state = STATE_NO_MATCH;
        } else {
            game_state = STATE_AWAIT_TIMEOUT;
            setTimeout(() => {
                matchAttempt.src = 'assets/tile.png';
                tile.src = 'assets/tile.png';
                game_state = STATE_NO_MATCH;
            }, 1000);
        }
    }
}

function addPoint() {
    document.getElementById('score').innerHTML = ++score;

    if (score == 10) {
        clearInterval(timer);
        game_state = STATE_WON;
        gameOver();
    }
}

function startTimer() {
    timerStarted = true;
    timer = setInterval(() => {
        document.getElementById('time').innerHTML = `${--timeLeft}s`;
        if (timeLeft == 0) {
            clearInterval(timer);
            game_state = STATE_LOST;
            gameOver();
        }
    }, 1000)
}

function gameOver() {
    if (game_state == STATE_LOST) {
        document.getElementById('gameOver-lose').style.display = "block";
        document.getElementById('final-score').innerHTML = score;
    } else {
        document.getElementById('gameOver-win').style.display = "block";
    }
}