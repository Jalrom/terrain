import * as THREE from 'three';
import { Player } from 'game/controls/player';

const ARROW_LEFT_KEY = 37;
const ARROW_UP_KEY = 38;
const ARROW_RIGHT_KEY = 39;
const ARROW_DOWN_KEY = 40;

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
        }
    }

    public update(): void {
        if (this.keys[ARROW_UP_KEY]) {
            this.player.Mesh.position.add(new THREE.Vector3(0, 0, -0.05));
        }  if (this.keys[ARROW_DOWN_KEY]) {
            this.player.Mesh.position.add(new THREE.Vector3(0, 0, 0.05));
        }  if (this.keys[ARROW_LEFT_KEY]) {
            this.player.Mesh.position.add(new THREE.Vector3(-0.05, 0, 0));
        }  if (this.keys[ARROW_RIGHT_KEY]) {
            this.player.Mesh.position.add(new THREE.Vector3(0.05, 0, 0));
        }
    }
}
