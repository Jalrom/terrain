import * as THREE from 'three';

export class Renderer {
    private static _instance: Renderer;
    private renderer: THREE.WebGLRenderer;

    private constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, devicePixelRatio: window.devicePixelRatio });
        this.init();
    }

    private init(): void {

    }

    public static get Instance() {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }

    public get Renderer() {
        return this.renderer;
    }
}