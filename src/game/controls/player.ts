import { JSONLoaderService, CURLING_STONE } from 'game/utils/jsonLoader.service';
import { Terrain, TERRAIN_DIMENSION } from 'game/terrain/terrain';
import { WATER_HEIGHT } from 'game/water/water';
import { Camera } from 'game/camera/camera';
import * as THREE from 'three';
import { PlayerControls } from 'game/controls/playerControls';

export class Player {
    private mesh: THREE.Object3D;
    private terrain: Terrain;
    private controls: PlayerControls;

    constructor(private jsonLoaderService: JSONLoaderService, terrain: Terrain) {
        this.terrain = terrain;
        this.mesh = this.jsonLoaderService.getModel(CURLING_STONE);
        this.mesh.position.set(1.0, 0.0, 1.0);
        this.controls = new PlayerControls(this);
    }

    public get Mesh(): THREE.Object3D {
        return this.mesh;
    }

    public update(): void {
        const terrainSegmentLength = TERRAIN_DIMENSION / this.terrain.Width;
        const col = ~~((this.mesh.position.x + (TERRAIN_DIMENSION / 2.0) - terrainSegmentLength / 2.0) / terrainSegmentLength);
        const row = ~~((this.mesh.position.z + (TERRAIN_DIMENSION / 2.0) - terrainSegmentLength / 2.0) / terrainSegmentLength);
        const idx = col % this.terrain.Width + row * this.terrain.Width;

        const vertices = ((this.terrain.Terrain.geometry as any).attributes as any).position.array;

        const p1x = vertices[idx * 3];
        const p2x = vertices[(idx + 1) * 3];
        const p3x = vertices[(idx + this.terrain.Width) * 3];
        const p4x = vertices[(idx + this.terrain.Width + 1) * 3];

        const p1y = vertices[idx * 3 + 1];
        const p2y = vertices[(idx + 1) * 3 + 1];
        const p3y = vertices[(idx + this.terrain.Width) * 3 + 1];
        const p4y = vertices[(idx + this.terrain.Width + 1) * 3 + 1];

        const p1z = vertices[idx * 3 + 2];
        const p2z = vertices[(idx + 1) * 3 + 2];
        const p3z = vertices[(idx + this.terrain.Width) * 3 + 2];
        const p4z = vertices[(idx + this.terrain.Width + 1) * 3 + 2];

        // Uper Left Point
        const p1 = new THREE.Vector3(p1x, p1y, p1z);
        // Uper Right Point
        const p2 = new THREE.Vector3(p2x, p2y, p2z);
        // Lower Left Point
        const p3 = new THREE.Vector3(p3x, p3y, p3z);
        // Lower Right Point
        const p4 = new THREE.Vector3(p4x, p4y, p4z);

        // Player position with unknown y
        const posPlayer = new THREE.Vector3(this.mesh.position.x, 0, this.mesh.position.z);

        // Caluclate if point is inside or outside of triangle
        const v0 = new THREE.Vector2(p3.x, p3.z).sub(new THREE.Vector2(p1.x, p1.z));
        const v1 = new THREE.Vector2(p2.x, p2.z).sub(new THREE.Vector2(p1.x, p1.z));
        const v2 = new THREE.Vector2(posPlayer.x, posPlayer.z).sub(new THREE.Vector2(p1.x, p1.z));

        const dot00 = new THREE.Vector2().copy(v0).dot(v0);
        const dot01 = new THREE.Vector2().copy(v0).dot(v1);
        const dot02 = new THREE.Vector2().copy(v0).dot(v2);
        const dot11 = new THREE.Vector2().copy(v1).dot(v1);
        const dot12 = new THREE.Vector2().copy(v1).dot(v2);

        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const ve = (dot00 * dot12 - dot01 * dot02) * invDenom;

        let n: THREE.Vector3;
        let v: THREE.Vector3;
        if ((u >= 0) && (ve >= 0) && (u + ve < 1)) {
            console.log('inside');
            n = new THREE.Vector3().copy(p2).sub(p3).cross(new THREE.Vector3().copy(p1).sub(p3));
            v = new THREE.Vector3().copy(p3).sub(posPlayer);

        } else {
            console.log('outside');
            n = new THREE.Vector3().copy(p4).sub(p3).cross(new THREE.Vector3().copy(p2).sub(p3));
            v = new THREE.Vector3().copy(p3).sub(posPlayer);
        }
        const vy = -((n.z * v.z) + (n.x * v.x)) / n.y;
        let y = p3y - vy;
        if (y < WATER_HEIGHT) {
            y = WATER_HEIGHT;
        }

        this.mesh.position.setY(y);
        this.controls.update();

        Camera.Instance.Camera.position.set(this.mesh.position.x, this.mesh.position.y + 1.0, this.mesh.position.z + 5.0);
        Camera.Instance.Camera.lookAt(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z - 100.0));
    }

    public onKeyDown(keyboardEvent: KeyboardEvent): void {
        this.controls.onKeyDown(keyboardEvent);
    }

    public onKeyUp(keyboardEvent: KeyboardEvent): void {
        this.controls.onKeyUp(keyboardEvent);
    }
}
