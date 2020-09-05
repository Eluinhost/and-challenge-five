import { getFloorOffset, getMapCentreY } from '../state/selectors';

import { Display } from './Display';

import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const Platform = React.memo(function Platform() {
    const ref = useRef();
    const floorOffset = useSelector(getFloorOffset);
    const centerY = useSelector(getMapCentreY);

    useEffect(() => {
        ref.current.object3D.position.set(0, floorOffset + centerY, 0);
    }, [floorOffset, centerY]);

    return (
        <a-entity class="platform" ref={ref}>
            <a-entity
                class="platform_floor"
                geometry="primitive: plane; height: 3; width: 3;"
                material="depthTest: false; color: gray; opacity: 0.4; alphaTest: 0.05;"
                rotation="-90 0 0"
            ></a-entity>

            <a-entity class="control-panel" position="0 0.359 -1.849" rotation="-45 0 0">
                <Display />
            </a-entity>
        </a-entity>
    );
});
