import {
    ACTIVATE_TILE,
    CYCLE_FLAG,
    END_GAME,
    INITIALISE_MAP,
    INITIALISE_MAP_FROM_STRING,
    MOVE_ROBOT,
    MOVE_ROBOT_RELATIVE,
    SET_FLAG,
    TRIGGER_ROBOT_TILE,
    TRIGGER_TILE,
} from './actions';
import { CELL_TYPES } from './cell-types';
import { FLAG_TYPES } from './flag-types';
import {
    getCells,
    getExitPosition,
    getFlagCount,
    getIsMapSolved,
    getMapHeight,
    getMapWidth,
    getMineCount,
    getRobotPosition,
} from './selectors';

import { takeEvery, put, select, call } from 'redux-saga/effects';

export const FLAGS = [FLAG_TYPES.NONE, FLAG_TYPES.FLAGGED, FLAG_TYPES.MAYBE];

function* activateTrigger({ payload: { x, y } }) {
    const cells = yield select(getCells);

    const cell = cells.find((cell) => cell.position.x === x && cell.position.y === y);

    if (!cell || cell.isActivated || cell.type === CELL_TYPES.WALL) {
        return;
    }

    yield put(ACTIVATE_TILE({ x, y }));

    if (cell.type === CELL_TYPES.MINE) {
        yield put(END_GAME(false));
        return;
    }

    if (cell.adjacent !== 0) {
        // no need to iterate unless it's a 0 cell
        return;
    }

    const width = yield select(getMapWidth);
    const height = yield select(getMapHeight);

    for (let nextX = x - 1; nextX <= x + 1; nextX++) {
        for (let nextY = y - 1; nextY <= y + 1; nextY++) {
            // out of bounds
            if (nextX < 0 || nextX > width - 1 || nextY < 0 || nextY > height - 1) {
                continue;
            }

            // this cell
            if (nextX === x && nextY === y) {
                continue;
            }

            yield call(activateTrigger, { payload: { x: nextX, y: nextY } });
        }
    }
}

function* moveRobotRelative({
    payload: {
        delta: { x, y },
    },
}) {
    const cells = yield select(getCells);
    const current = yield select(getRobotPosition);

    if (!cells.length) {
        return;
    }

    let newX = x + current.x;
    let newY = y + current.y;

    const targetCell = cells.find((cell) => cell.position.x === newX && cell.position.y === newY);

    if (!targetCell) {
        return;
    }

    const rotation = Math.atan2(y, x) + Math.PI / 2;

    const isAllMinesFlagged = yield select(getIsMapSolved);

    // don't allow movement into a wall but allow the rotation to happen
    if (targetCell.type === CELL_TYPES.WALL || (targetCell.type === CELL_TYPES.EXIT && !isAllMinesFlagged)) {
        newX = current.x;
        newY = current.y;
    }

    yield put(MOVE_ROBOT({ x: newX, y: newY, rotation }));

    if (targetCell.type === CELL_TYPES.MINE) {
        yield put(TRIGGER_TILE({ x: newX, y: newY }));
        return;
    }

    const { x: exitX, y: exitY } = yield select(getExitPosition);

    if (isAllMinesFlagged && exitX === newX && exitY === newY) {
        yield put(END_GAME(true));
    }
}

export function* cycleFlag({
    payload: {
        position: { x, y },
    },
}) {
    const cells = yield select(getCells);

    const cell = cells.find((cell) => cell.position.x === x && cell.position.y === y);

    if (!cell) {
        return;
    }

    let nextFlag = FLAGS[(FLAGS.indexOf(cell.flag) + 1) % FLAGS.length];

    // don't allow past the number of mines in the field, if they flag
    // past that point then just toggle between maybe and nothing
    if (nextFlag === FLAG_TYPES.FLAGGED) {
        const flags = yield select(getFlagCount);
        const mines = yield select(getMineCount);

        if (flags >= mines) {
            nextFlag = FLAG_TYPES.MAYBE;
        }
    }

    yield put(
        SET_FLAG({
            x,
            y,
            flag: nextFlag,
        })
    );
}

function* triggerRobotTile() {
    const { x, y } = yield select(getRobotPosition);

    yield put(TRIGGER_TILE({ x, y }));
}

function* initialiseMapFromString({ payload: { map } }) {
    const rows = map.split('\n').reverse();

    const cells = rows
        .map((row, y) =>
            row.split('').map((cell, x) => {
                const data = {
                    type: cell,
                    adjacent: 0,
                    flag: FLAG_TYPES.NONE,
                    position: { x, y },
                    isActivated: false,
                };

                for (let i = x - 1; i <= x + 1; i++) {
                    for (let j = y - 1; j <= y + 1; j++) {
                        // out of bounds
                        if (i < 0 || j < 0 || i > row.length - 1 || j > rows.length - 1) {
                            continue;
                        }

                        if (rows[j][i] === CELL_TYPES.MINE) {
                            data.adjacent++;
                        }
                    }
                }

                return data;
            })
        )
        .flat();

    yield put(INITIALISE_MAP({ cells, height: rows.length, width: rows[0].length }));
}

export function* rootSaga() {
    yield takeEvery(INITIALISE_MAP_FROM_STRING, initialiseMapFromString);
    yield takeEvery(TRIGGER_ROBOT_TILE, triggerRobotTile);
    yield takeEvery(CYCLE_FLAG, cycleFlag);
    yield takeEvery(TRIGGER_TILE, activateTrigger);
    yield takeEvery(MOVE_ROBOT_RELATIVE, moveRobotRelative);
}
