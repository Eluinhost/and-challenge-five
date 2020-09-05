import { getFloorOffset, getMapCentreY } from '../state/selectors';

import { Controllers } from './Controllers';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export const Camera = React.memo(function Camera() {
    const ref = useRef();

    const floorOffset = useSelector(getFloorOffset);
    const centerY = useSelector(getMapCentreY);

    useEffect(() => {
        ref.current.object3D.position.set(0, floorOffset + centerY, 0);
    }, [floorOffset, centerY]);

    return (
        <a-entity class="rig" ref={ref}>
            <Controllers />
            <a-camera
                cursor="rayOrigin: mouse"
                raycaster="objects: .clickable; far: 30"
                id="camera"
                fov="75"
                camera-controls="enabled: true; minX: -1.4; maxX: 1.4; minZ: -1.4; maxZ: 1.4; acceleration: 30; easing: 300"
                wasd-controls="enabled: false"
            />
        </a-entity>
    );
});
