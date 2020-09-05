import { Camera } from './Camera';
import { Maze } from './Maze';
import { Platform } from './Platform';

import React from 'react';

export const Scene = React.memo(function Scene() {
    return (
        <a-scene stats={process.env.NODE_ENV === 'development' ? '' : undefined}>
            <a-assets>
                <img id="sky" alt="sky" src="sky.jpg" crossOrigin="anonymous" />
                <img id="grid" alt="grid texture" src="grid.png" crossOrigin="anonymous" />
                <img id="grid-full" alt="grid texture" src="grid-full.png" crossOrigin="anonymous" />

                <a-asset-item id="android-gltf" src="android.gltf" />
                <a-asset-item id="mine-gltf" src="mine.gltf" />
                <a-asset-item
                    id="numberFont"
                    src="https://cdn.glitch.com/c719c986-c0c5-48b8-967c-3cd8b8aa17f3%2FdawningOfANewDayRegular.typeface.json?1490305922844"
                />

                <a-mixin
                    id="wall-box"
                    geometry="primitive: box; width: 1; height: 1; depth: 1;"
                    material="roughness: 0.4; metalness: 0.9; sphericalEnvMap: #sky; color: gray;"
                />
                <a-mixin id="mine-model" gltf-model="#mine-gltf" scale="0.01 0.01 0.01" />
                <a-mixin
                    id="button-top"
                    geometry="primitive: box; width: 0.18; height: 0.025; depth: 0.18;"
                    position="0 0.02 0"
                    material="color: red"
                />
                <a-mixin
                    id="button-base"
                    geometry="primitive: cone; radiusTop: 0.15; radiusBottom: 0.19; height: 0.02; segmentsRadial: 4; segmentsHeight: 1"
                    material="color: white"
                    rotation="0 45 0"
                />
            </a-assets>

            <Camera />

            <Maze />

            <Platform />

            {/* Ground. */}
            <a-entity
                geometry="primitive: plane; width: 10000; height: 10000;"
                rotation="-90 0 0"
                material="src: #grid; offset: .5 .5; repeat: 10000 10000; transparent: true; shader: standard; roughness: 0.4; sphericalEnvMap: #sky; alphaTest: 0.05"
            ></a-entity>

            {/* Background sky. */}
            <a-sky src="#sky" rotation="0 -90 0"></a-sky>

            {/* Lighting  */}
            <a-entity light="type: directional; color: #EEE; intensity: 0.5" position="-1 1 0"></a-entity>
            <a-entity light="color: #ffaaff; intensity: 1.5" position="5 5 5"></a-entity>
            <a-entity light="color: white; intensity: 0.5" position="-5 5 15"></a-entity>
            <a-entity light="color: white; type: ambient;"></a-entity>
        </a-scene>
    );
});
