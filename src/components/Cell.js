import { CELL_TYPES } from '../state/cell-types';

import { Exit } from './Exit';
import { Mine } from './Mine';
import { Tile } from './Tile';
import { Wall } from './Wall';

import React, { useEffect, useRef } from 'react';

export const Cell = React.memo(function Cell({ cell }) {
    const ref = useRef();

    useEffect(() => {
        ref.current.object3D.position.set(cell.position.x, cell.position.y, 0);
    }, [cell.position.x, cell.position.y]);

    let contents;

    if (cell.type === CELL_TYPES.WALL) {
        contents = <Wall />;
    } else if (cell.type === CELL_TYPES.EXIT) {
        contents = <Exit />;
    } else if (cell.type === CELL_TYPES.MINE) {
        contents = <Mine cell={cell} />;
    } else {
        contents = <Tile cell={cell} />;
    }

    return (
        <a-entity class="cell" ref={ref}>
            {contents}
        </a-entity>
    );
});
