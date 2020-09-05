import { utils } from 'aframe';
import React, { useEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';
import { Vector3 } from 'three';

const PRESS_VECTOR = new Vector3(0, -0.015, 0);

export const Button = React.memo(function Button(props) {
    const { onPress, ...others } = props;

    const ref = useRef();

    useEffect(() => {
        const mouseenter = fromEvent(ref.current, 'mouseenter').subscribe(() => {
            utils.entity.setComponentProperty(ref.current, 'material.opacity', 0.6);
        });
        const mouseleave = fromEvent(ref.current, 'mouseleave').subscribe(() => {
            utils.entity.setComponentProperty(ref.current, 'material.opacity', 1);
        });

        const mousedown = fromEvent(ref.current, 'mousedown').subscribe(() => {
            ref.current.object3D.position.add(PRESS_VECTOR);
        });

        const mouseup = fromEvent(ref.current, 'mouseup').subscribe(() => {
            ref.current.object3D.position.sub(PRESS_VECTOR);
        });

        return () => {
            mouseenter.unsubscribe();
            mouseleave.unsubscribe();
            mousedown.unsubscribe();
            mouseup.unsubscribe();
        };
    }, []);

    return (
        <a-entity {...others}>
            <a-entity ref={ref} class="clickable" mixin="button-top" onClick={onPress} />
            <a-entity mixin="button-base" />
        </a-entity>
    );
});
