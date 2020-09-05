import React from 'react';

export const Wall = React.memo(function Wall() {
    return <a-entity class="wall" mixin="wall-box"></a-entity>;
});
