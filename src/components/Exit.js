import { getIsMapSolved } from '../state/selectors';

import { Wall } from './Wall';

import React from 'react';
import { useSelector } from 'react-redux';

export const Exit = React.memo(function Exit() {
    const isAllMinesFlagged = useSelector(getIsMapSolved);

    if (!isAllMinesFlagged) {
        return <Wall />;
    }

    return <a-entity></a-entity>;
});
