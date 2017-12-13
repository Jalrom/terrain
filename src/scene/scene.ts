import * as THREE from 'three';
import { SCREEN } from 'app/app.component';

export class Scene {
    private static _instance: Scene;
    private scene: THREE.Scene;
    private bufferScene: THREE.Scene;
    private bufferTexture: THREE.WebGLRenderTarget;
    private ambientLight: THREE.AmbientLight;
    private directionnalLight: THREE.DirectionalLight;

    private constructor() {
        this.scene = new THREE.Scene();
        const parameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBuffer: false
        };
        this.bufferScene = new THREE.Scene();
        this.bufferTexture = new THREE.WebGLRenderTarget(SCREEN.width, SCREEN.height, parameters);
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
        this.scene.background = new THREE.Color(0xffffff);
        this.scene.fog = new THREE.FogExp2(0xffffff, 0.0000);
    }

    public static get Instance(): Scene {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }

    public get Scene(): THREE.Scene {
        return this.scene;
    }

    public get BufferScene(): THREE.Scene {
        return this.bufferScene;
    }

    public get BufferTexture(): THREE.WebGLRenderTarget {
        return this.bufferTexture;
    }
}
