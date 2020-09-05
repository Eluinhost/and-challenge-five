import { INITIALISE_MAP_FROM_STRING } from '../state/actions';
import { GAME_STATE } from '../state/game-state';
import { generateMap } from '../state/generateMap';
import { getFlagCount, getGameState, getMineCount } from '../state/selectors';
import { useIsInVr } from '../useIsInVr';

import { Button } from './Button';

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FlagCount = React.memo(function FlagCount() {
    const flags = useSelector(getFlagCount);
    const mines = useSelector(getMineCount);

    return (
        <a-entity>
            <a-text
                id="mines-remaining"
                value={`Flagged: ${flags} / ${mines}`}
                font="aileronsemibold"
                color="#680097"
                width="3"
                position="-1.35 0.2 0"
            ></a-text>
        </a-entity>
    );
});

const CursorControls = React.memo(function CursorControls() {
    return (
        <a-entity>
            <a-text
                value="Left Click: Cycle flags"
                font="aileronsemibold"
                color="#680097"
                width="2"
                position="-1.35 -0.2 0"
            ></a-text>
            <a-text
                value="Space: Activate the tile the robot is on"
                font="aileronsemibold"
                color="#680097"
                width="2"
                position="-1.35 -0.3 0"
            ></a-text>
            <a-text
                value="Arrow Keys: Move Robot"
                font="aileronsemibold"
                color="#680097"
                width="2"
                position="-1.35 -0.4 0"
            ></a-text>
        </a-entity>
    );
});

const IndexControls = React.memo(function IndexControls() {
    return (
        <a-entity>
            <a-text
                value="Point + Trigger: Cycle flags"
                font="aileronsemibold"
                color="#680097"
                width="2"
                position="-1.35 -0.2 0"
            ></a-text>
            <a-text
                value="A: Activate the tile the robot is on"
                font="aileronsemibold"
                color="#680097"
                width="2"
                position="-1.35 -0.3 0"
            ></a-text>
            <a-text
                value="Thumbstick: Move Robot"
                font="aileronsemibold"
                color="#680097"
                width="2"
                position="-1.35 -0.4 0"
            ></a-text>
        </a-entity>
    );
});

// TODO make this display not look terrible
export const Display = React.memo(function Display() {
    const state = useSelector(getGameState);
    const dispatch = useDispatch();

    const isInVr = useIsInVr();

    const handleResetClick = useCallback(() => {
        const map = generateMap();
        dispatch(INITIALISE_MAP_FROM_STRING(map));
    }, [dispatch]);

    let contents;

    switch (state) {
        case GAME_STATE.LOST:
            contents = (
                <a-text value="You Lost!" font="aileronsemibold" color="#680097" width="4" position="-1 0 0"></a-text>
            );
            break;
        case GAME_STATE.WON:
            contents = (
                <a-text value="You Won!" font="aileronsemibold" color="#680097" width="4" position="-1 0 0"></a-text>
            );
            break;
        default:
            contents = (
                <a-entity>
                    <a-text
                        value="Flag all mines and activate all tiles to unlock exit"
                        font="aileronsemibold"
                        color="#680097"
                        width="3"
                        position="-1.35 0.4 0"
                    ></a-text>
                    <FlagCount />
                    {isInVr ? <IndexControls /> : <CursorControls />}
                </a-entity>
            );
    }

    return (
        <a-entity>
            {contents}
            <a-text value="RESET >" font="aileronsemibold" color="#680097" width="3" position="0.7 -0.29 0"></a-text>
            <Button rotation="90 0 0" position="1.3 -0.3 0" onPress={handleResetClick} />

            {process.env.NODE_ENV === 'development' && (
                <>
                    <a-text value="FPS:" width="1" position="-1.48 .45 0"></a-text>
                    <a-entity fps-counter position="-0.85 .45 0" />
                </>
            )}

            <a-entity
                geometry="primitive: plane; height: 1; width: 3"
                material="roughness: 0.6; metalness: 0.9; sphericalEnvMap: #sky; color: gray;"
            ></a-entity>
        </a-entity>
    );
});
