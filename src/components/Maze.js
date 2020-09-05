import { INITIAL_MAP } from '../initial-map';
import { INITIALISE_MAP_FROM_STRING } from '../state/actions';
import { getCells, getFloorOffset, getMapCentreX } from '../state/selectors';

import { Cell } from './Cell';
import { MazeBackground } from './MazeBackground';
import { Robot } from './Robot';

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const Maze = React.memo(function Maze() {
    const ref = useRef();
    const cells = useSelector(getCells);
    const centreX = useSelector(getMapCentreX);
    const floorOffset = useSelector(getFloorOffset);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(INITIALISE_MAP_FROM_STRING(INITIAL_MAP));
    }, [dispatch]);

    useEffect(() => {
        ref.current.object3D.position.set(-centreX, floorOffset, -20);
    }, [centreX, floorOffset]);

    const renderedCells = cells.map((cell) => <Cell cell={cell} key={`${cell.position.x},${cell.position.y}`} />);

    return (
        <a-entity ref={ref} class="maze">
            <Robot />
            {renderedCells}
            <MazeBackground />
        </a-entity>
    );
});
