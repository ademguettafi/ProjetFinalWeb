//le temps et les mouvements
const GRID_WIDTH = 25;
const GRID_HEIGHT = 15;
const CELL_SIZE = 30;
const MONSTER_MOVE_DELAY = 500; 

const WALL = 1;
const EMPTY_CELL = 0;
const Joueur = 2;
const MONSTER = 3;
const TRESOR = 4;

const grid = [];
let JoueurPos;
const monsterPositions = [];
const tresorPositions = [];
const monsterDirections = [-1, 1]; 
let score = 0;
let monsterMoveInterval;

function generateLevel() {
    // la creation
    for (let y = 0; y < GRID_HEIGHT; y++) {
        grid[y] = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            grid[y][x] = EMPTY_CELL;
        }
    }


    JoueurPos = [Math.floor(GRID_WIDTH / 2), Math.floor(GRID_HEIGHT / 2)];
    grid[JoueurPos[1]][JoueurPos[0]] = Joueur;

    for (let x = 0; x < GRID_WIDTH; x++) {
        grid[0][x] = WALL;
        grid[GRID_HEIGHT - 1][x] = WALL;
    }

    const wallLayout = [
        [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4],
        [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5],
        [9, 10], [9, 11], [9, 12], [9, 13], [9, 14], [10, 14], [10, 4],
        [10, 10], [10, 11], [10, 12], [10, 13], [10, 14], [10, 9],
        [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9],
        [18, 9], [19, 9], [20, 9], [21, 9], [22, 9], [23, 9],
        [18, 10], [19, 10], [20, 10], [21, 10], [22, 10], [23, 10],
        [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5],
    ];

        for (const [x, y] of wallLayout) {
        grid[y][x] = WALL;
    }

    for (let y = 1; y < GRID_HEIGHT - 1; y++) {
        grid[y][0] = WALL;
        grid[y][GRID_WIDTH - 1] = WALL;
    }

    // la Place des monsters
    const monster1X = 18;
    const monster1Y = 12;
    monsterPositions.push([monster1X, monster1Y]);
    grid[monster1Y][monster1X] = MONSTER;

    const monster2X = 2;
    const monster2Y = 9;
    monsterPositions.push([monster2X, monster2Y]);
    grid[monster2Y][monster2X] = MONSTER;

    // la Place tresor 1
    const tresor1X = 6;
    const tresor1Y = 13;
    tresorPositions.push([tresor1X, tresor1Y]);
    grid[tresor1Y][tresor1X] = TRESOR;

    // la Place tresor 2
    const tresor2X = 22;
    const tresor2Y = 12;
    tresorPositions.push([tresor2X, tresor2Y]);
    grid[tresor2Y][tresor2X] = TRESOR;
}

function drawGrid() {
    const gridContainer = document.querySelector('.grid');
    gridContainer.innerHTML = '';

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            switch (grid[y][x]) {
                case WALL:
                    cell.classList.add('wall');
                    break;
                case Joueur:
                    cell.classList.add('Joueur');
                    break;
                case MONSTER:
                    cell.classList.add('monster');
                    break;
                case TRESOR:
                    cell.classList.add('tresor');
                    break;
            }

            gridContainer.appendChild(cell);
        }
    }
}

function moveJoueur(dx, dy) {
    const newJoueurX = JoueurPos[0] + dx;
    const newJoueurY = JoueurPos[1] + dy;

    if (grid[newJoueurY][newJoueurX] === WALL) {
        return;
    }

    for (const [monsterX, monsterY] of monsterPositions) {
        if (newJoueurX === monsterX && newJoueurY === monsterY) {
            gameOver();
            return;
        }
    }

    for (let i = tresorPositions.length - 1; i >= 0; i--) {
        const [tresorX, tresorY] = tresorPositions[i];
        if (newJoueurX === tresorX && newJoueurY === tresorY) {
            score++;
            document.getElementById('score').textContent = score;
            tresorPositions.splice(i, 1);
        }
    }

    grid[JoueurPos[1]][JoueurPos[0]] = EMPTY_CELL;
    JoueurPos = [newJoueurX, newJoueurY];
    grid[newJoueurY][newJoueurX] = Joueur;

    drawGrid();
    //Le joueur a récupéré tous les trésors et gagne

    if (tresorPositions.length === 0) {
        gameOver(true); 
    }
}


function moveMonster(monsterIdx, dx, dy) {
    const [monsterX, monsterY] = monsterPositions[monsterIdx];
    const newMonsterX = monsterX + dx;
    const newMonsterY = monsterY + dy;

    if (grid[newMonsterY][newMonsterX] === WALL || grid[newMonsterY][newMonsterX] === MONSTER) {
        monsterDirections[monsterIdx] *= -1;
        return;
    }

    grid[monsterY][monsterX] = EMPTY_CELL;
    monsterPositions[monsterIdx][0] = newMonsterX;
    monsterPositions[monsterIdx][1] = newMonsterY;
    grid[newMonsterY][newMonsterX] = MONSTER;
}

function moveMonsters() {
    monsterMoveInterval = setInterval(() => {
        // deplacement du monstre 1
        const [monster1X, monster1Y] = monsterPositions[0];
        const monster1Direction = monsterDirections[0];
        if (grid[monster1Y + monster1Direction][monster1X] === WALL || grid[monster1Y + monster1Direction][monster1X] === MONSTER) {
            monsterDirections[0] *= -1;
        } else {
            moveMonster(0, 0, monster1Direction);
        }

        // deplacement du monstre 2
        const [monster2X, monster2Y] = monsterPositions[1];
        const monster2Direction = monsterDirections[1];
        if (grid[monster2Y][monster2X + monster2Direction] === WALL || grid[monster2Y][monster2X + monster2Direction] === MONSTER) {
            monsterDirections[1] *= -1; 
        } else {
            moveMonster(1, monster2Direction, 0);
        }

        for (const [monsterX, monsterY] of monsterPositions) {
            if (JoueurPos[0] === monsterX && JoueurPos[1] === monsterY) {
                gameOver();
                return;
            }
        }

        drawGrid();
    }, MONSTER_MOVE_DELAY);
}


function gameOver(isWin) {
    clearInterval(monsterMoveInterval);
    if (isWin) {
        alert(`Congratulations! Vous avez gagné le jeu! Ton score: ${score}`);
    } else {
        alert(`Game Over! Ton score: ${score}`);
    }
    restartGame();
}

function restartGame() {
    generateLevel();
    score = 0;
    document.getElementById('score').textContent = score;
    drawGrid();
    moveMonsters();
}

document.addEventListener('DOMContentLoaded', () => {
    generateLevel();
    drawGrid();

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                moveJoueur(-1, 0);
                break;
            case 'ArrowRight':
                moveJoueur(1, 0);
                break;
            case 'ArrowUp':
                moveJoueur(0, -1);
                break;
            case 'ArrowDown':
                moveJoueur(0, 1);
                break;
        }
    });

    moveMonsters();
});