import { CYCLE_FLAG } from '../state/actions';

import { utils } from 'aframe';
import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { fromEvent } from 'rxjs';

const TEXT_COLOURS = ['', '#3E007A', '#FF0072', '#680097', '#F100C3', '#21004F', 'green', 'orange', 'red'];

export const Tile = React.memo(function Tile({
    cell: {
        flag,
        position: { x, y },
        adjacent,
        isActivated,
    },
}) {
    const planeRef = useRef();
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        dispatch(CYCLE_FLAG({ x, y }));
    }, [dispatch, x, y]);

    const minOpacity = useMemo(() => {
        if (isActivated) {
            return 0.2;
        }

        if (flag) {
            return 0.4;
        }

        return 0;
    }, [isActivated, flag]);

    useEffect(() => {
        utils.entity.setComponentProperty(planeRef.current, 'material.opacity', minOpacity);

        const sub1 = fromEvent(planeRef.current, 'mouseenter').subscribe(() => {
            utils.entity.setComponentProperty(planeRef.current, 'material.opacity', 0.6);
        });
        const sub2 = fromEvent(planeRef.current, 'mouseleave').subscribe(() => {
            utils.entity.setComponentProperty(planeRef.current, 'material.opacity', minOpacity);
        });

        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
        };
    }, [minOpacity]);

    return (
        <a-entity class="tile" position="0 0 -0.45">
            {flag && (
                <a-text
                    class="flag"
                    align="center"
                    wrap-count="1"
                    width="0.75"
                    height="0.75"
                    color="red"
                    font="monoid"
                    value={flag}
                    position="0 0 0.04"
                />
            )}
            {adjacent > 0 && isActivated && (
                <a-text
                    value={adjacent}
                    align="center"
                    wrap-count="1"
                    width="0.75"
                    height="0.75"
                    color={TEXT_COLOURS[adjacent]}
                    font="monoid"
                    position="0 0 0.04"
                />
            )}
            <a-plane
                ref={planeRef}
                class={isActivated ? 'activated' : 'clickable'}
                onClick={handleClick}
                width="0.95"
                height="0.95"
                material={`color: ${flag ? 'black' : 'gray'}`}
                position="0 0 0.02"
            />
        </a-entity>
    );
});
