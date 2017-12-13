import { Terrain } from './../terrain/terrain';
import { Renderer } from './../renderer/renderer';
import { Scene } from './../scene/scene';
import { Camera } from './../camera/camera';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import { Water } from 'water/water';

export const SCREEN = {
  width: window.innerWidth,
  height: window.innerHeight
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('container') elementRef: ElementRef;
  private container: HTMLElement;

  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;

  private bufferScene: THREE.Scene;
  private bufferTexture: THREE.WebGLRenderTarget;

  private terrain: Terrain;
  private water: Water;
  private controls: THREE.OrbitControls;

  constructor() {
    this.camera = Camera.Instance.Camera;
    this.scene = Scene.Instance.Scene;
    this.bufferScene = Scene.Instance.BufferScene;
    this.bufferTexture = Scene.Instance.BufferTexture;
    this.renderer = Renderer.Instance.Renderer;
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }

  ngOnInit() {
    this.container = this.elementRef.nativeElement;
    this.init();
  }

  public init(): void {
    this.scene.add(this.camera);
    this.scene.add(new THREE.AxisHelper(1));

    this.renderer.setSize(SCREEN.width, SCREEN.height, false);
    this.container.appendChild(this.renderer.domElement);

    this.terrain = new Terrain(1000, 1000);
    this.water = new Water(1000, 1000);
    this.render();
  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    this.water.update();
    this.renderer.clear();
    this.renderer.render(this.bufferScene, this.camera, this.bufferTexture);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
    this.animate();
  }

  public animate(): void {
  }

  public onWindowResize(): void {
    SCREEN.width = window.innerWidth;
    SCREEN.height = window.innerHeight;
    this.camera.aspect = SCREEN.width / SCREEN.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(SCREEN.width, SCREEN.height);
  }
}
