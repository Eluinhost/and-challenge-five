import { MOVE_ROBOT_RELATIVE, TRIGGER_ROBOT_TILE } from '../state/actions';
import { store } from '../state/store';

import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fromEvent } from 'rxjs';
import { filter, map, tap, throttleTime } from 'rxjs/operators';

const AXIS_DEADZONE = 0.15;

// For chrome beta + index controller for VR. Found chrome to be better perf but too buggy,
// had to use master branch aframe (which in turn broke firefox) and then controllers were
// a little wonky and any kind of JS blocking caused UI to fade to steamvr home... Firefox
// was much nicer to deal with. Chrome still fine with 2D mode though
// const AXIS_INDEX_X = 0;
// const AXIS_INDEX_Y = 1;
// const Y_INVERTED = true;
// const ACTIVATION_BUTTON_INDEX = 1;

// For firefox + index controller
const AXIS_INDEX_X = 2;
const AXIS_INDEX_Y = 3;
const Y_INVERTED = false;
const ACTIVATION_BUTTON_INDEX = 4;

export const Controllers = React.memo(function Controllers() {
    const controlsRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        const axisSubscription = fromEvent(controlsRef.current, 'axismove')
            .pipe(
                // don't take events that don't have either axis changed or have both axis in the deadzone
                filter(
                    ({ detail: { changed, axis } }) =>
                        (changed[AXIS_INDEX_X] || changed[AXIS_INDEX_Y]) &&
                        (Math.abs(axis[AXIS_INDEX_X]) > AXIS_DEADZONE || Math.abs(axis[AXIS_INDEX_Y]) > AXIS_DEADZONE)
                ),
                // too many events be bad
                throttleTime(200),
                // only keep whichever axis is larger and turn it into a 1 or -1 depending on sign
                map((event) => {
                    if (Math.abs(event.detail.axis[AXIS_INDEX_X]) > Math.abs(event.detail.axis[AXIS_INDEX_Y])) {
                        return {
                            x: event.detail.axis[AXIS_INDEX_X] > 0 ? 1 : -1,
                            y: 0,
                        };
                    } else {
                        return {
                            x: 0,
                            y: event.detail.axis[AXIS_INDEX_Y] > 0 ? 1 : -1,
                        };
                    }
                }),
                tap((coords) => {
                    if (Y_INVERTED) {
                        coords.y *= -1;
                    }
                })
            )
            .subscribe((delta) => {
                dispatch(MOVE_ROBOT_RELATIVE(delta));
            });

        const buttonSubscription = fromEvent(controlsRef.current, 'buttondown')
            .pipe(filter((event) => event.detail.id === ACTIVATION_BUTTON_INDEX))
            .subscribe(() => {
                dispatch(TRIGGER_ROBOT_TILE());
            });

        const keys = fromEvent(document, 'keydown').pipe(map((event) => event.code));

        const moveRightSubscription = keys
            .pipe(
                filter((code) => code === 'ArrowRight'),
                throttleTime(200)
            )
            .subscribe(() => store.dispatch(MOVE_ROBOT_RELATIVE({ x: 1, y: 0 })));

        const moveLeftSubscription = keys
            .pipe(
                filter((code) => code === 'ArrowLeft'),
                throttleTime(200)
            )
            .subscribe(() => store.dispatch(MOVE_ROBOT_RELATIVE({ x: -1, y: 0 })));

        const moveUpSubscription = keys
            .pipe(
                filter((code) => code === 'ArrowUp'),
                throttleTime(200)
            )
            .subscribe(() => store.dispatch(MOVE_ROBOT_RELATIVE({ x: 0, y: 1 })));

        const moveDownSubscription = keys
            .pipe(
                filter((code) => code === 'ArrowDown'),
                throttleTime(200)
            )
            .subscribe(() => store.dispatch(MOVE_ROBOT_RELATIVE({ x: 0, y: -1 })));

        keys.pipe(filter((code) => code === 'Space')).subscribe(() => {
            store.dispatch(TRIGGER_ROBOT_TILE());
        });

        return () => {
            axisSubscription.unsubscribe();
            buttonSubscription.unsubscribe();
            moveLeftSubscription.unsubscribe();
            moveRightSubscription.unsubscribe();
            moveUpSubscription.unsubscribe();
            moveDownSubscription.unsubscribe();
        };
    }, [dispatch]);

    return (
        <a-entity>
            {/*<a-entity hand-controls="hand: left"></a-entity>*/}
            <a-entity
                ref={controlsRef}
                laser-controls="hand: right; model: false" // model broken and causes perf issues
                line="color: red; opacity: 0.75"
                raycaster="objects: .clickable; far: 30"
                tracked-controls="idPrefix: OpenVR; controller: 0;"
            />
        </a-entity>
    );
});
