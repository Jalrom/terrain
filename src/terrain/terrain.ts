import { TERRAIN_VERTEX_SHADER, TERRAIN_FRAGMENT_SHADER } from './../assets/customShaders/terrainShader';
import { Scene } from './../scene/scene';
import * as THREE from 'three';
import { WATER_OPACITY } from 'water/water';
// TODO: create typing
declare var ImprovedNoise: any;

const TERRAIN_HEIGHT = 100;

export class Terrain {

    private scene: THREE.Scene;
    private bufferSceneReflection: THREE.Scene;
    private bufferSceneRefraction: THREE.Scene;

    private data: Uint8Array;
    private width: number;
    private depth: number;

    private geometry: THREE.PlaneBufferGeometry;
    private material: THREE.ShaderMaterial;

    private mesh: THREE.Mesh;
    private meshReflection: THREE.Mesh;
    private meshRefraction: THREE.Mesh;

    private min = 500;
    private max = 0;

    constructor(depth: number, width: number) {
        this.scene = Scene.Instance.Scene;
        this.bufferSceneReflection = Scene.Instance.BufferSceneReflection;
        this.bufferSceneRefraction = Scene.Instance.BufferSceneRefraction;
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
            { clipPlane: { type: 'v4', value: new THREE.Vector4(0, 1, 0, -25.0) } },
            { waterHeight: { value: 0.0 } }
        ]);

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: TERRAIN_VERTEX_SHADER,
            fragmentShader: TERRAIN_FRAGMENT_SHADER,
            lights: true,
            fog: true,
        });
        this.material.uniforms.textureRock.value.needsUpdate = true;
        this.material.uniforms.textureGrass.value.needsUpdate = true;
        this.material.uniforms.textureDirt.value.needsUpdate = true;
        this.material.uniforms.clipPlane.value.needsUpdate = true;
    }

    private initMesh(): void {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = 'terrain';
        this.mesh.geometry.computeVertexNormals();

        this.meshReflection = new THREE.Mesh(this.geometry, this.material);
        this.meshReflection.name = 'terrainReflection';
        this.meshReflection.geometry.computeVertexNormals();
        this.meshReflection.scale.setY(-1.0);

        this.meshRefraction = new THREE.Mesh(this.geometry, this.material);
        this.meshRefraction.name = 'terrainRefraction';
        this.meshRefraction.geometry.computeVertexNormals();

        this.bufferSceneReflection.add(this.meshReflection);
        this.bufferSceneRefraction.add(this.meshRefraction);
        this.scene.add(this.mesh);
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public getMeshRefraction(): THREE.Mesh {
        return this.meshRefraction;
    }

    public getMeshReflection(): THREE.Mesh {
        return this.meshReflection;
    }

    public getMaterial(): THREE.ShaderMaterial {
        return this.material;
    }
    public update(): void {
    }
}
