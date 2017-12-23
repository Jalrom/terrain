import * as THREE from 'three';
import { MouseHelper } from 'game/utils/mouseHelper';

const VIEW = {
    angle: 45,
    aspect: screen.width / screen.height,
    near: 0.1,
    far: 1000
};
export const DISTANCE_PLAYER = 4.0;
export const DISTANCE_ABOVE_PLAYER = 1.0;
const MOUSE_SENSITIVITY = 0.001;
export class Camera {
    private static _instance: Camera;
    private camera: THREE.PerspectiveCamera;

    private yaw: number;
    private pitch: number;

    private isFirstMouse: boolean;
    private isMouseDown: boolean;
    private lastX: number;
    private lastY: number;

    private constructor() {
        this.camera = new THREE.PerspectiveCamera(VIEW.angle, VIEW.aspect, VIEW.near, VIEW.far);
        this.yaw = 0.0;
        this.pitch = 0.0;
        this.isFirstMouse = true;
        this.init();
    }

    private init(): void {
    }

    public static get Instance() {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }

    public update(): void {
        this.camera.lookAt(new THREE.Vector3(
            Math.cos(this.yaw) * Math.cos(this.pitch) + this.camera.position.x,
            Math.sin(this.pitch) + this.camera.position.y,
            Math.sin(this.yaw) * Math.cos(this.pitch) + this.camera.position.z
        ));
    }

    public get Camera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public get Pitch(): number {
        return this.pitch;
    }

    public get Yaw(): number {
        return this.yaw;
    }

    public onMouseUp(mouseEvent: MouseEvent): void {
        this.isMouseDown = false;
        this.isFirstMouse = true;
    }

    public onMouseDown(mouseEvent: MouseEvent): void {
        this.isMouseDown = true;
    }

    public onMouseMove(mouseEvent: MouseEvent): void {
        if (this.isMouseDown) {
            if (this.isFirstMouse) {
                this.lastX = mouseEvent.clientX;
                this.lastY = mouseEvent.clientY;
                this.isFirstMouse = false;
            }

            let xOffset = this.lastX - mouseEvent.clientX;
            let yOffset = mouseEvent.clientY - this.lastY;

            this.lastX = mouseEvent.clientX;
            this.lastY = mouseEvent.clientY;

            xOffset *= MOUSE_SENSITIVITY;
            yOffset *= MOUSE_SENSITIVITY;

            this.yaw += xOffset;
            this.pitch += yOffset;

            if (this.pitch > 89.0 * Math.PI / 180.0) {
                this.pitch = 89.0 * Math.PI / 180.0;
            }
            if (this.pitch < -89.0 * Math.PI / 180.0) {
                this.pitch = -89.0 * Math.PI / 180.0;
            }
        }
    }
}
