import * as THREE from 'three';
import { WATER_VERTEX_SHADER, WATER_FRAGMENT_SHADER } from 'assets/customShaders/waterShader';
import { Scene } from 'game/scene/scene';
import { Camera } from 'game/camera/camera';

export const WATER_OPACITY = 0.1;
export const WATER_HEIGHT = 25.0001;
const WAVE_SPEED = 0.002;
export class Water {
    private scene: THREE.Scene;

    private width: number;
    private depth: number;
    private height: number;

    private geometry: THREE.PlaneBufferGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    private dudvMap: THREE.Texture;
    private normalMap: THREE.Texture;
    private moveFactor: number;
    constructor(width: number, depth: number) {
        this.scene = Scene.Instance.Scene;
        this.width = width;
        this.depth = depth;
        this.height = 25.0;
        this.moveFactor = 0.0;
        this.init();
    }

    private init(): void {
        this.initGeometry();
        this.initMaterial();
        this.initMesh();
    }

    private initGeometry(): void {
        this.geometry = new THREE.PlaneBufferGeometry(3000, 3000, this.width - 1, this.depth - 1);
        this.geometry.rotateX(- Math.PI / 2);
    }

    private initMaterial(): void {
        const textureLoader = new THREE.TextureLoader();
        this.dudvMap = textureLoader.load('assets/textures/waterDuDv.jpg');
        this.dudvMap.wrapS = this.dudvMap.wrapT = THREE.RepeatWrapping;
        this.normalMap = textureLoader.load('assets/textures/normalMap.png');
        this.normalMap.wrapS = this.normalMap.wrapT = THREE.RepeatWrapping;
        const uniforms = THREE.UniformsUtils.merge([
            THREE.ShaderLib.phong.uniforms,
            { reflectionTexture: { type: 't', value: Scene.Instance.BufferTextureReflection.texture } },
            { refractionTexture: { type: 't', value: Scene.Instance.BufferTextureRefraction.texture } },
            { dudvMap: { type: 't', value: this.dudvMap } },
            { normalMap: { type: 't', value: this.normalMap } },
            { moveFactor: { value: this.moveFactor } },
            { opacity: { value: WATER_OPACITY } },
            { camPos: { type: 'v3', value: Camera.Instance.Camera.position } }
        ]);

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: WATER_VERTEX_SHADER,
            fragmentShader: WATER_FRAGMENT_SHADER,
            lights: true,
            transparent: true,
            fog: true
        });
        this.material.uniforms.reflectionTexture.value.needsUpdate = true;
        this.material.uniforms.refractionTexture.value.needsUpdate = true;
        this.material.uniforms.dudvMap.value.needsUpdate = true;
        this.material.uniforms.normalMap.value.needsUpdate = true;
        this.material.uniforms.camPos.value.needsUpdate = true;
    }

    private initMesh(): void {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = 'water';
        this.mesh.position.setY(this.height);
        this.mesh.geometry.computeVertexNormals();
        this.scene.add(this.mesh);
    }

    public update(): void {
        this.material.uniforms.reflectionTexture.value = Scene.Instance.BufferTextureReflection;
        this.material.uniforms.refractionTexture.value = Scene.Instance.BufferTextureRefraction;
        this.material.uniforms.dudvMap.value = this.dudvMap;
        this.material.uniforms.normalMap.value = this.normalMap;
        this.moveFactor += WAVE_SPEED * 0.001;
        this.moveFactor %= 1;
        this.material.uniforms.moveFactor.value = this.moveFactor;
        this.material.uniforms.camPos.value = Camera.Instance.Camera.position;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public getHeight(): number {
        return this.height;
    }
}
