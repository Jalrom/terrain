import * as THREE from 'three';

const VIEW = {
    angle: 45,
    aspect: screen.width / screen.height,
    near: 0.3,
    far: 100000
};

export class Camera {
    private static _instance: Camera;
    private camera: THREE.PerspectiveCamera;

    private constructor() {
        this.camera = new THREE.PerspectiveCamera(VIEW.angle, VIEW.aspect, VIEW.near, VIEW.far);
        this.init();
    }

    private init(): void {
        this.camera.position.set(0, 4000, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    public static get Instance() {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }

    public get Camera() {
        return this.camera;
    }
}
