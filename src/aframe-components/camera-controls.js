import { registerComponent } from 'aframe';
import { isEmpty } from 'ramda';
import * as THREE from 'three';

const MAX_DELTA = 0.2;
const CLAMP_VELOCITY = 0.00001;

const CONTROLS = ['KeyA', 'KeyD', 'KeyS', 'KeyW'];

registerComponent('camera-controls', {
    schema: {
        enabled: { default: true },
        minX: { default: Number.NEGATIVE_INFINITY },
        maxX: { default: Number.POSITIVE_INFINITY },
        minZ: { default: Number.NEGATIVE_INFINITY },
        maxZ: { default: Number.POSITIVE_INFINITY },
        acceleration: { default: 100 },
        easing: { default: 1.1 },
    },
    init: function () {
        this.pressedKeys = {};
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.directionVector = new THREE.Vector3(0, 0, 0);
        this.rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    },
    remove: function () {
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('keydown', this.onKeyDown);
    },
    onKeyDown: function (event) {
        if (CONTROLS.includes(event.code)) {
            this.pressedKeys[event.code] = true;
        }
    },
    onKeyUp: function (event) {
        if (CONTROLS.includes(event.code)) {
            delete this.pressedKeys[event.code];
        }
    },
    tick: function (time, delta) {
        if (!this.data.enabled) {
            return;
        }

        if (!this.velocity.x && !this.velocity.z && isEmpty(this.pressedKeys)) {
            return;
        }

        delta = delta / 1000;
        this.updateVelocity(delta);

        if (!this.velocity.x && !this.velocity.z) {
            return;
        }

        this.directionVector.copy(this.velocity);
        this.directionVector.multiplyScalar(delta);

        const rotation = this.el.getAttribute('rotation');

        this.rotationEuler.set(0, THREE.MathUtils.degToRad(rotation.y), 0);
        this.directionVector.applyEuler(this.rotationEuler);

        this.el.object3D.position.add(this.directionVector);

        if (this.el.object3D.position.x > this.data.maxX) {
            this.el.object3D.position.setX(this.data.maxX);
        } else if (this.el.object3D.position.x < this.data.minX) {
            this.el.object3D.position.setX(this.data.minX);
        }

        if (this.el.object3D.position.z > this.data.maxZ) {
            this.el.object3D.position.setZ(this.data.maxZ);
        } else if (this.el.object3D.position.z < this.data.minZ) {
            this.el.object3D.position.setZ(this.data.minZ);
        }
    },
    updateVelocity: function (delta) {
        if (delta > MAX_DELTA) {
            this.velocity.x = 0;
            this.velocity.z = 0;
            return;
        }

        // TODO movement 'floatyness' seems to be FPS dependant
        const scaledEasing = Math.pow(1 / this.data.easing, delta * 30);

        if (this.velocity.x !== 0) {
            this.velocity.x -= this.velocity.x * scaledEasing;
        }
        if (this.velocity.z !== 0) {
            this.velocity.z -= this.velocity.z * scaledEasing;
        }

        if (Math.abs(this.velocity.x) < CLAMP_VELOCITY) {
            this.velocity.x = 0;
        }
        if (Math.abs(this.velocity.z) < CLAMP_VELOCITY) {
            this.velocity.z = 0;
        }

        const accelerationDelta = this.data.acceleration * delta;

        if (this.pressedKeys.KeyA) {
            this.velocity.x -= accelerationDelta;
        }
        if (this.pressedKeys.KeyD) {
            this.velocity.x += accelerationDelta;
        }
        if (this.pressedKeys.KeyW) {
            this.velocity.z -= accelerationDelta;
        }
        if (this.pressedKeys.KeyS) {
            this.velocity.z += accelerationDelta;
        }
    },
});
