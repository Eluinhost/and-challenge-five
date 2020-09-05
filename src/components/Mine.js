import { GAME_STATE } from '../state/game-state';
import { getGameState } from '../state/selectors';

import { Tile } from './Tile';

import React from 'react';
import { useSelector } from 'react-redux';

export const Mine = React.memo(function Mine({ cell }) {
    const state = useSelector(getGameState);

    if (state === GAME_STATE.RUNNING && !cell.isActivated) {
        return <Tile cell={cell} />;
    }

    // TODO add a random animation offset/delay/duration so they're not all in sync if they appear at the same time
    return (
        <a-entity
            class="mine"
            position="0 0 -0.25"
            mixin="mine-model"
            animation="property: position; from: 0 -0.1 0; to: 0 0.1 0; loop: true; dur: 2000; dir: alternate; easing: easeInOutQuad;"
            animation__rotation="property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 5000; easing: linear"
        />
    );
});
