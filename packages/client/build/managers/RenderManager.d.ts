import { CameraHandler } from "../CameraHandler";
import * as THREE from "three";
import { ICanvasUIElementsManager } from ".";
export declare class RenderManager {
    private renderer;
    private cameraHandler;
    private scene;
    private orbitControlsEnabled;
    private inGameUiElements;
    private canvasUIElementsManager;
    renderCanvas: boolean;
    constructor();
    init(scene: THREE.Scene, cameraHandler: CameraHandler): void;
    attachEvents(): void;
    setSize(width: number, height: number): void;
    onWindowResize(): void;
    initCanvas(): void;
    initRenderLoop(): void;
    animate(): void;
    limitLoop(fn: any, fpsArg: any): void;
    calculateCanvassize(): {
        width: number;
        height: number;
    };
    clearThreeScene(obj: any): void;
    addCanvas2D(canvas2DManager: ICanvasUIElementsManager): void;
}
