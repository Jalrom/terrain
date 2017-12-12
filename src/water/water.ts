import { Scene } from 'scene/scene';
import * as THREE from 'three';

export class Water {
    private scene: THREE.Scene;

    private width: number;
    private depth: number;

    private geometry: THREE.PlaneBufferGeometry;
    private material: THREE.MeshPhongMaterial;
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
        this.material = new THREE.MeshPhongMaterial({
            color: 0x0ec2ff
        });
    }

    private initMesh(): void {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.setY(25.0);
        this.mesh.geometry.computeVertexNormals();
        this.scene.add(this.mesh);
    }
}
