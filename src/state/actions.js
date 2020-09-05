import { createAction } from 'typesafe-redux-helpers';

export const END_GAME = createAction('End Game', (success) => ({ success }));

export const INITIALISE_MAP_FROM_STRING = createAction('Generate Map From String', (map) => ({ map }));

export const INITIALISE_MAP = createAction('Initialise Map', ({ cells, width, height }) => ({
    cells,
    width,
    height,
}));

export const TRIGGER_ROBOT_TILE = createAction('Trigger Robot Tile');

export const TRIGGER_TILE = createAction('Trigger Tile', ({ x, y }) => ({
    x,
    y,
}));

export const ACTIVATE_TILE = createAction('Activate Tile', ({ x, y }) => ({
    position: { x, y },
}));

export const MOVE_ROBOT_RELATIVE = createAction('Move Robot Relative', ({ x, y }) => ({
    delta: { x, y },
}));

export const MOVE_ROBOT = createAction('Move Robot', ({ x, y, rotation }) => ({
    x,
    y,
    rotation,
}));

export const SET_FLAG = createAction('Set Flag', ({ x, y, flag }) => ({
    position: { x, y },
    flag,
}));

export const CYCLE_FLAG = createAction('Cycle Flag', ({ x, y }) => ({
    position: { x, y },
}));

export const SET_FLOOR_OFFSET = createAction('Set Floor Offset', (offset) => ({
    offset,
}));
