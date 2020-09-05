import { getRobotPosition } from '../state/selectors';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MathUtils } from 'three';

export const Robot = React.memo(function Robot() {
    const ref = useRef();
    const previousRot = useRef(0);
    const pos = useSelector(getRobotPosition);

    useEffect(() => {
        ref.current.setAttribute('animation__pos', `property: position; to: ${pos.x} ${pos.y} 0; dur: 200;`);
    }, [pos.x, pos.y]);

    useEffect(() => {
        let fromDeg = previousRot.current;
        let toDeg = MathUtils.radToDeg(pos.rotation);

        if (fromDeg === 270 && toDeg === 0) {
            toDeg = 360;
        } else if (fromDeg === 0 && toDeg === 270) {
            fromDeg = 360;
        }

        ref.current.setAttribute(
            'animation__rot',
            `property: rotation; from: 90 ${fromDeg} 0; to: 90 ${toDeg} 0; dur: 100;`
        );
        previousRot.current = toDeg;
    }, [pos.rotation]);

    return <a-gltf-model class="robot" ref={ref} src="#android-gltf" scale="0.25 0.25 0.25"></a-gltf-model>;
});
