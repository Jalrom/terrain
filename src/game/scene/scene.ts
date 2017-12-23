import * as THREE from 'three';
import { SCREEN } from 'game/app/app.component';

export class Scene {
    private static _instance: Scene;

    private scene: THREE.Scene;
    private bufferSceneRefraction: THREE.Scene;
    private bufferSceneReflection: THREE.Scene;

    private bufferTextureReflection: THREE.WebGLRenderTarget;
    private bufferTextureRefraction: THREE.WebGLRenderTarget;

    private ambientLight: THREE.AmbientLight;
    private directionnalLight: THREE.DirectionalLight;
    private buffAmbientLight: THREE.AmbientLight;
    private buffDirectionnalLight: THREE.DirectionalLight;

    private constructor() {
        this.scene = new THREE.Scene();
        const parameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBuffer: false
        };
        this.bufferSceneReflection = new THREE.Scene();
        this.bufferSceneRefraction = new THREE.Scene();
        this.bufferTextureReflection = new THREE.WebGLRenderTarget(SCREEN.width, SCREEN.height, parameters);
        this.bufferTextureRefraction = new THREE.WebGLRenderTarget(SCREEN.width, SCREEN.height, parameters);
        this.ambientLight = new THREE.AmbientLight(0x333333);
        this.directionnalLight = new THREE.DirectionalLight(0xffffff);
        this.buffAmbientLight = new THREE.AmbientLight(0x333333);
        this.buffDirectionnalLight = new THREE.DirectionalLight(0xffffff);
        this.init();
    }

    private init(): void {
        this.directionnalLight.position.set(0, 400, 0);
        this.directionnalLight.intensity = 5.0;
        const dirLightHelper = new THREE.DirectionalLightHelper(this.directionnalLight);
        this.scene.add(this.directionnalLight);
        this.scene.add(this.ambientLight);
        this.scene.background = new THREE.Color(0xbecce2);
        this.scene.fog = new THREE.FogExp2(0xbecce2, 0.0025);

        const refractionDirLight = new THREE.DirectionalLight(0xffffff);
        refractionDirLight.intensity = 5.0;
        refractionDirLight.position.set(0, 400, 0);

        const refractionAmbientLight = new THREE.AmbientLight(0x333333);
        this.bufferSceneRefraction.add(refractionDirLight);
        this.bufferSceneRefraction.add(refractionAmbientLight);
        this.bufferSceneRefraction.background = new THREE.Color(0xbecce2);
        this.bufferSceneRefraction.fog = new THREE.FogExp2(0xbecce2, 0.0025);

        const reflectionDirLight = new THREE.DirectionalLight(0xffffff);
        reflectionDirLight.intensity = 5.0;
        reflectionDirLight.position.set(0, 400, 0);

        const reflectionAmbientLight = new THREE.AmbientLight(0x333333);
        this.bufferSceneReflection.add(reflectionDirLight);
        this.bufferSceneReflection.add(reflectionAmbientLight);
        this.bufferSceneReflection.background = new THREE.Color(0xbecce2);
        this.bufferSceneRefraction.fog = new THREE.FogExp2(0xbecce2, 0.0025);
    }

    public static get Instance(): Scene {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }

    public get Scene(): THREE.Scene {
        return this.scene;
    }

    public get BufferSceneReflection(): THREE.Scene {
        return this.bufferSceneReflection;
    }

    public get BufferTextureReflection(): THREE.WebGLRenderTarget {
        return this.bufferTextureReflection;
    }

    public get BufferSceneRefraction(): THREE.Scene {
        return this.bufferSceneRefraction;
    }

    public get BufferTextureRefraction(): THREE.WebGLRenderTarget {
        return this.bufferTextureRefraction;
    }
}
