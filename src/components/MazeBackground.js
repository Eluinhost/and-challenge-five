import { getMapCentreX, getMapCentreY, getMapHeight, getMapWidth } from '../state/selectors';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export const MazeBackground = React.memo(function MazeBackground() {
    const ref = useRef();

    const centreX = useSelector(getMapCentreX);
    const centreY = useSelector(getMapCentreY);
    const width = useSelector(getMapWidth);
    const height = useSelector(getMapHeight);

    useEffect(() => {
        ref.current.object3D.position.set(centreX, centreY, -0.5);
    }, [centreX, centreY]);

    return (
        <a-entity ref={ref} class="maze-background">
            <a-plane
                // need to set a key here because aframe doesn't update the repeat numbers properly so this forces react
                // to create a new element in the DOM when it changes as opposed to reusing the old one
                key={`${width}x${height}`}
                class="maze-background_grid"
                width={width}
                height={height}
                material={`src: #grid-full; transparent: true; roughness: 0.4; sphericalEnvMap: #sky; alphaTest: 0.05; repeat: ${width} ${height}`}
            />
            <a-plane
                class="maze-background_block"
                width={width}
                height={height}
                material="color: white; opacity: 0.2; transparent: true;"
            />
        </a-entity>
    );
});
