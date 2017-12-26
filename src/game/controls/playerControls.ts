import * as THREE from 'three';
import { Player } from 'game/controls/player';
import { Camera } from 'game/camera/camera';

const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;
const ARROW_LEFT_KEY = 37;
const ARROW_RIGHT_KEY = 39;
const W_KEY = 87;
const S_KEY = 83;
const A_KEY = 65;
const D_KEY = 68;

const SPEED = 0.3;

export class PlayerControls {
    private player: Player;
    private keys: boolean[];

    constructor(player: Player) {
        this.player = player;
        this.keys = [];
        this.init();
    }

    private init(): void {
    }

    public onKeyDown(keyboardEvent: KeyboardEvent): void {
        const keyCode = keyboardEvent.keyCode;
        if (keyCode === ARROW_UP_KEY) {
            this.keys[keyCode] = true;
        } else if (keyCode === ARROW_DOWN_KEY) {
            this.keys[keyCode] = true;
        } else if (keyCode === ARROW_LEFT_KEY) {
            this.keys[keyCode] = true;
        } else if (keyCode === ARROW_RIGHT_KEY) {
            this.keys[keyCode] = true;
        } else if (keyCode === W_KEY) {
            this.keys[keyCode] = true;
        } else if (keyCode === S_KEY) {
            this.keys[keyCode] = true;
        } else if (keyCode === A_KEY) {
            this.keys[keyCode] = true;
        } else if (keyCode === D_KEY) {
            this.keys[keyCode] = true;
        }
    }

    public onKeyUp(keyboardEvent: KeyboardEvent): void {
        const keyCode = keyboardEvent.keyCode;
        if (keyCode === ARROW_UP_KEY) {
            this.keys[keyCode] = false;
        } else if (keyCode === ARROW_DOWN_KEY) {
            this.keys[keyCode] = false;
        } else if (keyCode === ARROW_LEFT_KEY) {
            this.keys[keyCode] = false;
        } else if (keyCode === ARROW_RIGHT_KEY) {
            this.keys[keyCode] = false;
        } else if (keyCode === W_KEY) {
            this.keys[keyCode] = false;
        } else if (keyCode === S_KEY) {
            this.keys[keyCode] = false;
        } else if (keyCode === A_KEY) {
            this.keys[keyCode] = false;
        } else if (keyCode === D_KEY) {
            this.keys[keyCode] = false;
        }
    }

    public update(): void {
        const direction = Camera.Instance.Yaw;
        if (this.keys[ARROW_UP_KEY] || this.keys[W_KEY]) {
            this.player.Mesh.position.add(new THREE.Vector3(
                SPEED * Math.cos(direction),
                0.0,
                SPEED * Math.sin(direction)));
            this.player.Mesh.rotation.y = - direction + Math.PI;
        }
        if (this.keys[ARROW_DOWN_KEY] || this.keys[S_KEY]) {
            this.player.Mesh.position.add(new THREE.Vector3(
                -SPEED * Math.cos(direction),
                0.0,
                -SPEED * Math.sin(direction)));
            this.player.Mesh.rotation.y = - direction;
        }
        if (this.keys[ARROW_LEFT_KEY] || this.keys[A_KEY]) {
            this.player.Mesh.position.add(new THREE.Vector3(
                -SPEED * Math.cos(direction + Math.PI / 2.0),
                0.0,
                -SPEED * Math.sin(direction + Math.PI / 2.0)));
            this.player.Mesh.rotation.y = - direction - Math.PI / 2;
        }
        if (this.keys[ARROW_RIGHT_KEY] || this.keys[D_KEY]) {
            this.player.Mesh.position.add(new THREE.Vector3(
                SPEED * Math.cos(direction + Math.PI / 2.0),
                0.0,
                SPEED * Math.sin(direction + Math.PI / 2.0)));
            this.player.Mesh.rotation.y = - direction + Math.PI / 2;
        }
    }
}
