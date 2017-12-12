import * as THREE from 'three';

export class Scene {
    private static _instance: Scene;
    private scene: THREE.Scene;
    private ambientLight: THREE.AmbientLight;
    private directionnalLight: THREE.DirectionalLight;

    private constructor() {
        this.scene = new THREE.Scene();
        this.ambientLight = new THREE.AmbientLight(0x333333);
        this.directionnalLight = new THREE.DirectionalLight(0xffffff);
        this.init();
    }

    private init(): void {
        this.directionnalLight.position.set(400, 400, 400);
        this.directionnalLight.intensity = 5.0;
        const dirLightHelper = new THREE.DirectionalLightHelper(this.directionnalLight);
        this.scene.add(dirLightHelper);
        this.scene.add(this.directionnalLight);
        this.scene.add(this.ambientLight);
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.FogExp2(0x000000, 0.0005);
    }

    public static get Instance() {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }

    public get Scene() {
        return this.scene;
    }
}
