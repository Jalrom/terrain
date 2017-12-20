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

  private bufferSceneRefraction: THREE.Scene;
  private bufferTextureRefraction: THREE.WebGLRenderTarget;

  private bufferSceneReflection: THREE.Scene;
  private bufferTextureReflection: THREE.WebGLRenderTarget;

  private terrain: Terrain;
  private water: Water;
  private controls: THREE.OrbitControls;

  constructor() {
    this.camera = Camera.Instance.Camera;
    this.scene = Scene.Instance.Scene;
    this.bufferSceneRefraction = Scene.Instance.BufferSceneRefraction;
    this.bufferTextureRefraction = Scene.Instance.BufferTextureRefraction;
    this.bufferSceneReflection = Scene.Instance.BufferSceneReflection;
    this.bufferTextureReflection = Scene.Instance.BufferTextureReflection;
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
    // Render Terrain Reflection
    this.terrain.getMaterial().side = THREE.BackSide;
    this.terrain.getMaterial().uniforms.waterHeight.value = 25.0;
    this.terrain.getMaterial().uniforms.clipPlane.value = new THREE.Vector4(0.0, 1.0, 0.0, -this.water.getHeight());
    this.renderer.render(this.bufferSceneReflection, this.camera, this.bufferTextureReflection);
    this.terrain.getMaterial().uniforms.waterHeight.value = 0.0;
    this.terrain.getMaterial().side = THREE.FrontSide;

    // Render Terrain Refraction
    this.terrain.getMaterial().uniforms.clipPlane.value = new THREE.Vector4(0.0, -1.0, 0.0, this.water.getHeight());
    this.renderer.render(this.bufferSceneRefraction, this.camera, this.bufferTextureRefraction);

    // Render Terrain
    this.terrain.getMaterial().uniforms.clipPlane.value = new THREE.Vector4(0.0, 1.0, 0.0, -this.water.getHeight());
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
