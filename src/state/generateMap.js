import { CELL_TYPES } from './cell-types';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// adds up to the amount of mines into the cell grid
// into existing empty spaces only
const addMines = ({ cells, width, height, amount }) => {
    let addedMines = 0;
    let timesSkipped = 0;

    while (addedMines < amount) {
        const x = getRandomInt(1, width - 2);
        const y = getRandomInt(1, height - 2);

        // TODO use pathfinding to ensure can still exit?
        // can do it to ensure there is a path from start to exit without
        // needing to walk on a mine/through a wall, still can be really
        // hard to win sometimes even with this because you'll have to
        // sometimes walk blindly into unknown areas

        if (cells[y][x] !== CELL_TYPES.EMPTY) {
            timesSkipped++;

            // getting too hard to find an empty space just give up
            if (timesSkipped > 25) {
                return;
            }

            continue;
        }

        cells[y][x] = CELL_TYPES.MINE;
        addedMines++;
    }
};

export const generateMap = () => {
    const width = getRandomInt(10, 35);
    const height = getRandomInt(10, 35);

    const mapArr = Array(height);

    // top and bottom layer all walls
    mapArr[0] = Array(width).fill(CELL_TYPES.WALL);
    mapArr[mapArr.length - 1] = Array(width).fill(CELL_TYPES.WALL);

    // other rows all start and end with a wall
    for (let y = 1; y < height - 1; y++) {
        mapArr[y] = [CELL_TYPES.WALL, ...Array(width - 2).fill(CELL_TYPES.EMPTY), CELL_TYPES.WALL];
    }

    // make robot 1,1
    mapArr[1][1] = CELL_TYPES.ROBOT;

    // pick random wall on the right side
    mapArr[getRandomInt(1, height - 2)][width - 1] = CELL_TYPES.EXIT;

    // randomly place mines in the area where not wall or robot or exit
    const minesToAdd = getRandomInt(15, 40);

    // TODO place some random walls inside?

    addMines({ cells: mapArr, width, height, amount: minesToAdd });

    const asString = mapArr
        .reverse() // y is inverted
        .map((row) => row.join(''))
        .join('\n');

    console.log('new map', asString);

    return asString;
};
