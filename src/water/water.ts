import { Scene } from 'scene/scene';
import * as THREE from 'three';
import { WATER_VERTEX_SHADER, WATER_FRAGMENT_SHADER } from 'assets/customShaders/waterShader';

export class Water {
    private scene: THREE.Scene;

    private width: number;
    private depth: number;

    private geometry: THREE.PlaneBufferGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    constructor(width: number, depth: number) {
        this.scene = Scene.Instance.Scene;
        this.width = width;
        this.depth = depth;
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
            const uniforms = THREE.UniformsUtils.merge([
            THREE.ShaderLib.phong.uniforms,
            { tDiffuse: { type: 't', value: Scene.Instance.BufferTexture.texture } },
        ]);

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: WATER_VERTEX_SHADER,
            fragmentShader: WATER_FRAGMENT_SHADER,
            lights: true
        });

        uniforms.tDiffuse.value.needsUpdate = true;
    }

    private initMesh(): void {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = 'water';
        this.mesh.position.setY(25.0);
        this.mesh.geometry.computeVertexNormals();
        this.scene.add(this.mesh);
    }

    public update(): void {
        this.material.uniforms.tDiffuse.value = Scene.Instance.BufferTexture;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }
}
