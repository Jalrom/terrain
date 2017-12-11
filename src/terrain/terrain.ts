import { TERRAIN_VERTEX_SHADER, TERRAIN_FRAGMENT_SHADER } from './../assets/customShaders/terrainShader';
import { Scene } from './../scene/scene';
import * as THREE from 'three';
// TODO: create typing
declare var ImprovedNoise: any;

const TERRAIN_HEIGHT = 100;

export class Terrain {

    private scene: THREE.Scene;

    private data: Uint8Array;
    private width: number;
    private depth: number;

    private geometry: THREE.PlaneBufferGeometry;
    private material: THREE.Material;
    private mesh: THREE.Mesh;

    private min = 10000;
    private max = 0;

    constructor(depth: number, width: number) {
        this.scene = Scene.Instance.Scene;
        this.depth = depth;
        this.width = width;
        this.initData();
        this.initGeometry();
        this.initMaterial();
        this.initMesh();
    }

    private initData(): void {
        const size = this.width * this.depth;
        this.data = new Uint8Array(size);

        const perlin = new ImprovedNoise();
        let quality = 1;
        const z = Math.random() * TERRAIN_HEIGHT;
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < size; i++) {
                // ~~ faster than floor
                const x = i % this.width, y = ~~(i / this.width);
                this.data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
                if (this.data[i] < this.min) {
                    this.min = this.data[i];
                }
                if (this.data[i] > this.max) {
                    this.max = this.data[i];
                }
            }
            quality *= 5;
        }
        // Smooth terrain
        // for (let i = 0; i < size; i ++) {
        //     const x = i % this.width, y = ~~(i / this.width);
        //     try {
        //         this.data[i] = (this.data[i] + this.data[x - 1 + y * this.width] + this.data[x + 1 + y * this.width] +
        //                     this.data[x + (y - 1) * this.width] + this.data[x + (y + 1) * this.width]) / 5;

        //     } catch (e) {
        //         console.log("ERROR");
        //     }
        // }
    }

    private initGeometry(): void {
        this.geometry = new THREE.PlaneBufferGeometry(3000, 3000, this.width - 1, this.depth - 1);
        this.geometry.rotateX(- Math.PI / 2);

        const vertices = (this.geometry.attributes as any).position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 1] = this.data[i / 3];
        }
    }

    private initMaterial(): void {
        const uniforms = THREE.UniformsUtils.merge([
            THREE.ShaderLib.phong.uniforms,
            { minVal: { value: this.min }},
            { maxVal: { value: this.max }},
            {shininess: { value: 0.1}}
        ]);

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: TERRAIN_VERTEX_SHADER,
            fragmentShader: TERRAIN_FRAGMENT_SHADER,
            lights: true,
            fog: true
        }
        );
        // this.material = new THREE.MeshPhongMaterial({
        //     color: 0xffffff,
        //     wireframe: false
        // });
    }

    private initMesh(): void {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.geometry.computeVertexNormals();
        this.scene.add(this.mesh);
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }
}
