import { Terrain } from './../terrain/terrain';
import { Renderer } from './../renderer/renderer';
import { Scene } from './../scene/scene';
import { Camera } from './../camera/camera';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import { Water } from 'game/water/water';
import { JSONLoaderService, CURLING_STONE } from 'game/utils/jsonLoader.service';
import { Player } from 'game/controls/player';

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
  private loading: boolean;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;

  private bufferSceneRefraction: THREE.Scene;
  private bufferTextureRefraction: THREE.WebGLRenderTarget;

  private bufferSceneReflection: THREE.Scene;
  private bufferTextureReflection: THREE.WebGLRenderTarget;

  private terrain: Terrain;
  private water: Water;
  private player: Player;

  constructor(private jsonLoaderService: JSONLoaderService) {
    this.loading = true;
    this.camera = Camera.Instance.Camera;
    this.scene = Scene.Instance.Scene;
    this.bufferSceneRefraction = Scene.Instance.BufferSceneRefraction;
    this.bufferTextureRefraction = Scene.Instance.BufferTextureRefraction;
    this.bufferSceneReflection = Scene.Instance.BufferSceneReflection;
    this.bufferTextureReflection = Scene.Instance.BufferTextureReflection;
    this.renderer = Renderer.Instance.Renderer;
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

    this.terrain = new Terrain(1001, 1001);
    this.water = new Water(1001, 1001);
    this.jsonLoaderService.loadModels().then(
      () => {
        this.player = new Player(this.jsonLoaderService, this.terrain);
        this.scene.add(this.player.Mesh);
        this.loading = false;
        this.render();
      }
    );
  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    this.water.update();

    // Render Terrain Reflection
    this.renderer.render(this.bufferSceneReflection, this.camera, this.bufferTextureReflection);

    // Render Terrain Refraction
    this.renderer.render(this.bufferSceneRefraction, this.camera, this.bufferTextureRefraction);

    // Render Terrain
    this.renderer.render(this.scene, this.camera);

    this.update();
  }

  public update(): void {
    this.player.update();
  }

  public onWindowResize(): void {
    SCREEN.width = window.innerWidth;
    SCREEN.height = window.innerHeight;
    this.camera.aspect = SCREEN.width / SCREEN.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(SCREEN.width, SCREEN.height);
  }

  public onKeyDown(keyboardEvent: KeyboardEvent): void {
    if (!this.loading) {
      this.player.onKeyDown(keyboardEvent);
    }
  }

  public onKeyUp(keyboardEvent: KeyboardEvent): void {
    if (!this.loading) {
      this.player.onKeyUp(keyboardEvent);
    }
  }
}
