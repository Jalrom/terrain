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

  private controls: THREE.OrbitControls;

  constructor() {
    this.camera = Camera.Instance.Camera;
    this.scene = Scene.Instance.Scene;
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

    this.renderer.setSize(screen.width, screen.height, false);
    this.container.appendChild(this.renderer.domElement);

    const terrain = new Terrain(1000, 1000);
    const water = new Water(1000, 1000);
    this.render();
  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
    this.animate();
  }

  public animate(): void {
  }

  public onWindowResize(): void {
    SCREEN.width = window.innerWidth;
    SCREEN.height = window.innerHeight;
    this.camera.aspect = screen.width / screen.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(screen.width, screen.height);
  }
}
