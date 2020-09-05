import { CELL_TYPES } from './cell-types';
import { FLAG_TYPES } from './flag-types';

import { identity } from 'ramda';
import { createSelector } from 'reselect';

export const getRobotPosition = createSelector((state) => state.robot, identity);

export const getGameState = createSelector((state) => state.state, identity);

export const getCells = createSelector((state) => state.cells, identity);

export const getFlagCount = createSelector(
    (state) => state.cells,
    (cells) => cells.reduce((acc, cell) => (cell.flag === FLAG_TYPES.FLAGGED ? acc + 1 : acc), 0)
);

export const getMineCount = createSelector(
    (state) => state.cells,
    (cells) => cells.reduce((acc, cell) => (cell.type === CELL_TYPES.MINE ? acc + 1 : acc), 0)
);

export const getFloorOffset = createSelector((state) => state.floorOffset, identity);

export const getMapHeight = createSelector((state) => state.height, identity);
export const getMapWidth = createSelector((state) => state.width, identity);

export const getMapCentreX = createSelector(getMapWidth, (width) => (width - 1) / 2);

export const getMapCentreY = createSelector(getMapHeight, (height) => (height - 1) / 2);

export const getIsMapSolved = createSelector(getCells, (cells) =>
    cells.every((cell) => {
        switch (cell.type) {
            case CELL_TYPES.MINE:
                return cell.flag === FLAG_TYPES.FLAGGED;
            case CELL_TYPES.EMPTY:
            case CELL_TYPES.ROBOT:
                return cell.isActivated;
            case CELL_TYPES.WALL:
            case CELL_TYPES.EXIT:
            default:
                return true;
        }
    })
);

export const getExitPosition = createSelector(
    getCells,
    (cells) => cells.find((x) => x.type === CELL_TYPES.EXIT).position
);
