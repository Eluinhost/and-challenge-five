import { ACTIVATE_TILE, MOVE_ROBOT, CYCLE_FLAG, SET_FLOOR_OFFSET, TRIGGER_TILE } from './actions';
import { reducer } from './reducers';
import { rootSaga } from './sagas';

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
    reducer,
    composeWithDevTools({
        actionCreators: {
            ACTIVATE_TILE: (x, y) => ACTIVATE_TILE({ x, y }),
            TRIGGER_TILE: (x, y) => TRIGGER_TILE({ x, y }),
            CYCLE_FLAG: (x, y) => CYCLE_FLAG({ x, y }),
            MOVE_ROBOT: (x, y) => MOVE_ROBOT({ x, y }),
            SET_FLOOR_OFFSET: (offset) => SET_FLOOR_OFFSET(offset),
        },
    })(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
