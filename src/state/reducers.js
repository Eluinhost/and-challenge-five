import { ACTIVATE_TILE, END_GAME, INITIALISE_MAP, MOVE_ROBOT, SET_FLAG, SET_FLOOR_OFFSET } from './actions';
import { CELL_TYPES } from './cell-types';
import { GAME_STATE } from './game-state';

import { adjust, findIndex } from 'ramda';
import { createReducer } from 'typesafe-redux-helpers';

export const reducer = createReducer({
    cells: [],
    width: 0,
    height: 0,
    robot: { x: 0, y: 0, rotation: 0 },
    state: GAME_STATE.INIT,
    flags: [],
    floorOffset: 6,
})
    .handleAction(INITIALISE_MAP, (state, action) => {
        const robotCell = action.payload.cells.find((cell) => cell.type === CELL_TYPES.ROBOT);

        return {
            ...state,
            state: GAME_STATE.RUNNING,
            cells: action.payload.cells,
            width: action.payload.width,
            height: action.payload.height,
            robot: robotCell ? { ...robotCell.position, rotation: Math.PI / 2 } : state.robot,
        };
    })
    .handleAction(END_GAME, (state, action) => ({
        ...state,
        state: action.payload.success ? GAME_STATE.WON : GAME_STATE.LOST,
    }))
    .handleAction(MOVE_ROBOT, (state, action) => ({
        ...state,
        robot: action.payload,
    }))
    .handleAction(ACTIVATE_TILE, (state, action) => {
        const index = findIndex(
            (cell) => cell.position.x === action.payload.position.x && cell.position.y === action.payload.position.y,
            state.cells
        );

        if (index < 0 || state.cells[index].isActivated) {
            return state;
        }

        return {
            ...state,
            cells: adjust(
                index,
                (item) => ({
                    ...item,
                    isActivated: true,
                    flag: null,
                }),
                state.cells
            ),
        };
    })
    .handleAction(SET_FLAG, (state, action) => {
        const index = findIndex(
            (cell) => cell.position.x === action.payload.position.x && cell.position.y === action.payload.position.y,
            state.cells
        );

        if (index < 0) {
            return state;
        }

        return {
            ...state,
            cells: adjust(
                index,
                (item) => ({
                    ...item,
                    flag: action.payload.flag,
                }),
                state.cells
            ),
        };
    })
    .handleAction(SET_FLOOR_OFFSET, (state, action) => ({
        ...state,
        floorOffset: action.payload.offset,
    }));
