import { TERRAIN_VERTEX_SHADER, TERRAIN_FRAGMENT_SHADER } from './../assets/customShaders/terrainShader';
import { Scene } from './../scene/scene';
import * as THREE from 'three';
import { WATER_TRANSPARENCY } from "water/water";
// TODO: create typing
declare var ImprovedNoise: any;

const TERRAIN_HEIGHT = 100;

export class Terrain {

    private scene: THREE.Scene;
    private bufferScene: THREE.Scene;

    private data: Uint8Array;
    private width: number;
    private depth: number;

    private geometry: THREE.PlaneBufferGeometry;
    private material: THREE.ShaderMaterial;
    private materialReflection: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    private meshReflection: THREE.Mesh;

    private min = 10000;
    private max = 0;

    constructor(depth: number, width: number) {
        this.scene = Scene.Instance.Scene;
        this.bufferScene = Scene.Instance.BufferScene;
        this.depth = depth;
        this.width = width;
        this.init();
    }

    private init(): void {
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
        const textureLoader = new THREE.TextureLoader();
        const textureRock = textureLoader.load('assets/textures/rockTexture.jpg');
        const textureGrass = textureLoader.load('assets/textures/grassTexture.jpg');
        const textureDirt = textureLoader.load('assets/textures/dirtTexture.jpg');
        textureRock.wrapS = textureRock.wrapT = THREE.RepeatWrapping;
        textureGrass.wrapS = textureGrass.wrapT = THREE.RepeatWrapping;
        textureDirt.wrapS = textureDirt.wrapT = THREE.RepeatWrapping;
        textureRock.minFilter = THREE.LinearMipMapLinearFilter;
        textureRock.magFilter = THREE.NearestFilter;
        textureGrass.minFilter = THREE.LinearMipMapLinearFilter;
        textureGrass.magFilter = THREE.NearestFilter;
        textureDirt.minFilter = THREE.LinearMipMapLinearFilter;
        textureDirt.magFilter = THREE.NearestFilter;
        const uniformsReflection = THREE.UniformsUtils.merge([
            THREE.ShaderLib.phong.uniforms,
            { minVal: { value: this.min } },
            { maxVal: { value: this.max } },
            { shininess: { value: 0.1 } },
            { textureRock: { type: 't', value: textureRock } },
            { textureGrass: { type: 't', value: textureGrass } },
            { textureDirt: { type: 't', value: textureDirt } },
            { textureRockRepeat: { value: 200 } },
            { textureGrassRepeat: { value: 200 } },
            { textureDirtRepeat: { value: 200 } },
            { reflection: { value: 1.0 } }
        ]);

        const uniforms = THREE.UniformsUtils.merge([
            THREE.ShaderLib.phong.uniforms,
            { minVal: { value: this.min } },
            { maxVal: { value: this.max } },
            { shininess: { value: 0.1 } },
            { textureRock: { type: 't', value: textureRock } },
            { textureGrass: { type: 't', value: textureGrass } },
            { textureDirt: { type: 't', value: textureDirt } },
            { textureRockRepeat: { value: 200 } },
            { textureGrassRepeat: { value: 200 } },
            { textureDirtRepeat: { value: 200 } },
            { reflection: { value: 0.0 } },
        ]);

        this.materialReflection = new THREE.ShaderMaterial({
            uniforms: uniformsReflection,
            vertexShader: TERRAIN_VERTEX_SHADER,
            fragmentShader: TERRAIN_FRAGMENT_SHADER,
            lights: true,
            fog: true,
            side: THREE.DoubleSide
        });
        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: TERRAIN_VERTEX_SHADER,
            fragmentShader: TERRAIN_FRAGMENT_SHADER,
            lights: true,
            fog: true
        });
        console.log(this.material);
        this.material.uniforms.textureRock.value.needsUpdate = true;
        this.material.uniforms.textureGrass.value.needsUpdate = true;
        this.material.uniforms.textureDirt.value.needsUpdate = true;
        this.materialReflection.uniforms.textureRock.value.needsUpdate = true;
        this.materialReflection.uniforms.textureGrass.value.needsUpdate = true;
        this.materialReflection.uniforms.textureDirt.value.needsUpdate = true;
    }

    private initMesh(): void {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.meshReflection = new THREE.Mesh(this.geometry, this.materialReflection);
        this.mesh.name = 'terrain';
        this.mesh.geometry.computeVertexNormals();
        this.meshReflection.name = 'terrainReflection';
        this.meshReflection.geometry.computeVertexNormals();
        this.meshReflection.scale.setY(-1.0);
        this.meshReflection.geometry.computeVertexNormals();
        this.bufferScene.add(this.meshReflection);
        this.scene.add(this.mesh);
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public getMeshReflection(): THREE.Mesh {
        return this.meshReflection;
    }

    public update(): void {
        //
    }
}
