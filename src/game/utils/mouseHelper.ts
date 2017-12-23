import { Camera } from 'game/camera/camera';
import * as THREE from 'three';
import { Renderer } from 'game/renderer/renderer';

export class MouseHelper {
    private mouseDownPosition: THREE.Vector2;
    private mouseScreenPosition: THREE.Vector2;
    private projection: THREE.Vector3;
    private isMouseDown: boolean;

    constructor() {
        this.projection = new THREE.Vector3();
        this.isMouseDown = false;
        this.mouseDownPosition = new THREE.Vector2();
    }

    public onMouseDown(mouseEvent: MouseEvent): void {
        this.isMouseDown = true;
        this.mouseDownPosition.set(mouseEvent.clientX, mouseEvent.clientY);
    }

    public onMouseUp(mouseEvent: MouseEvent): void {
        this.isMouseDown = false;
    }

    public onMouseMove(mouseEvent: MouseEvent): void {
        if (this.isMouseDown) {
            this.projection.x = ( mouseEvent.clientX / Renderer.Instance.Renderer.domElement.width ) * 2 - 1;
            this.projection.y = - ( mouseEvent.clientY / Renderer.Instance.Renderer.domElement.height ) * 2 + 1;
            this.projection.z = 0.5;
            const res = this.projection.unproject(Camera.Instance.Camera);
            console.log(res);
            Camera.Instance.Camera.lookAt(res);
        }
    }
}
