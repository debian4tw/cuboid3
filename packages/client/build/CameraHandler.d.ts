import * as THREE from "three";
import { ICameraStrategy } from '@cubic-eng/core';
import { IActor } from "@cubic-eng/core";
import { IScenarioDefinition } from "@cubic-eng/core";
export declare class CameraHandler {
    private camera;
    private followedMesh;
    private followedActor;
    private cameraStrategy;
    private folowedActorId;
    private strategies;
    constructor(camera: THREE.PerspectiveCamera);
    getCamera(): THREE.PerspectiveCamera;
    setFollowedActorId(actorId: string): void;
    getFollowedActorId(): string;
    updateCamera(): void;
    setCameraParams(params: object): void;
    registerStrategy(actorName: string, strategyClass: new () => ICameraStrategy): void;
    followSubject(actor: IActor, mesh: THREE.Mesh): void;
    findStrategyForActor(actorName: string): any;
    registerStrategies(scenariosDefinition: IScenarioDefinition[]): void;
    init(scenarios: IScenarioDefinition[]): void;
    attachEvents(): void;
    setDefaultCamera(): void;
    setCameraTop(): void;
    setCameraBehind(): void;
}
