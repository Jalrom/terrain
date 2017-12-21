import { Injectable } from '@angular/core';

export const CURLING_STONE = 'curlingStone.json';

import * as THREE from 'three';

@Injectable()
export class JSONLoaderService {
    private jsonLoader: THREE.JSONLoader;
    private loadedModels: [string, THREE.Mesh][];

    public constructor() {
        this.jsonLoader = new THREE.JSONLoader();
        this.loadedModels = [];
    }

    /**
     * Renvoi une promesse lorsque tous les modeles sont charges
     */
    public loadModels(): Promise<void> {
        return new Promise<void>((resolve, error) => {
            this.loadModel(CURLING_STONE).then(() => {
                resolve();
            });
        });
    }

    /**
     * Charge un modele en lisant un ficher json
     */
    public loadModel(modelPath: string): Promise<THREE.Mesh> {
        return new Promise<THREE.Mesh>((resolve, error) => {
            this.jsonLoader.load('/assets/models/' + modelPath, (geometry, materials) => {
                if (geometry === undefined) {
                    error('Unable to load');
                } else {
                    const mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
                    this.loadedModels.push([modelPath, mesh]);
                    resolve(mesh);
                }
            });
        });
    }

    /**
     * Retourne un modele sans relire le fichier json
     */
    private copyModel(path: string): THREE.Object3D {
        for (let i = 0; i < this.loadedModels.length; i++) {
            if (this.loadedModels[i][0] === path) {
                return this.loadedModels[i][1].clone(true);
            }
        }
    }

    public getModel(modelPath: string): THREE.Object3D {
        return this.copyModel(modelPath);
    }
}
