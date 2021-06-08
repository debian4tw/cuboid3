"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraHandler = void 0;
const core_1 = require("@cubic-eng/core");
class CameraHandler {
    constructor(camera) {
        this.strategies = {};
        this.camera = camera;
        this.followedMesh = false;
    }
    getCamera() {
        return this.camera;
    }
    setFollowedActorId(actorId) {
        this.folowedActorId = actorId;
    }
    getFollowedActorId() {
        return this.folowedActorId;
    }
    updateCamera() {
        if (!this.followedMesh) {
            return;
        }
        if (this.cameraStrategy !== false) {
            this.cameraStrategy.updateCamera(this.camera);
        }
    }
    setCameraParams(params) {
        if (!this.followedMesh) {
            return;
        }
        if (this.cameraStrategy !== false) {
            this.cameraStrategy.setCameraParams(params);
        }
    }
    registerStrategy(actorName, strategyClass) {
        this.strategies[actorName] = strategyClass;
    }
    followSubject(actor, mesh) {
        // console.log('CameraHandler:attaching followed subject', mesh)
        this.followedActor = actor;
        this.followedMesh = mesh;
        this.setCameraTop();
        const strategyForActor = this.findStrategyForActor(actor.name);
        if (!strategyForActor) {
            // tslint:disable-next-line:no-console
            console.log("cameraStrategy not found");
            this.cameraStrategy = false;
            this.followedMesh = false;
        }
        else {
            this.cameraStrategy = new strategyForActor(this.followedMesh, this.followedActor);
            if (this.cameraStrategy !== false) {
                this.cameraStrategy.setupCamera(this.camera);
            }
        }
    }
    findStrategyForActor(actorName) {
        if (typeof this.strategies[actorName] === "undefined") {
            return false;
        }
        return this.strategies[actorName];
    }
    registerStrategies(scenariosDefinition) {
        scenariosDefinition.forEach((scenarioDef) => {
            if (scenarioDef.cameraStrategy) {
                if (scenarioDef.cameraStrategy instanceof Array) {
                    scenarioDef.cameraStrategy.forEach((camStrategy) => {
                        this.registerStrategy(camStrategy.actorName, camStrategy.strategy);
                    });
                }
                else {
                    this.registerStrategy(scenarioDef.cameraStrategy.actorName, scenarioDef.cameraStrategy.strategy);
                }
            }
        });
    }
    init(scenarios) {
        // tslint:disable-next-line:no-console
        console.log("init cameraHandler");
        this.registerStrategies(scenarios);
        this.setDefaultCamera();
        this.attachEvents();
    }
    attachEvents() {
        core_1.EventHandler.subscribe('scenarioChanged', () => {
            this.setDefaultCamera();
        });
        core_1.EventHandler.subscribe('setCameraParams', (params) => {
            this.setCameraParams(params);
        });
    }
    setDefaultCamera() {
        this.setCameraTop();
        this.setCameraBehind();
    }
    setCameraTop() {
        const centerX = 400;
        const centerY = 300;
        this.camera.position.x = centerX;
        this.camera.position.y = centerY;
        this.camera.position.z = 800;
        this.camera.rotation.x = 0;
        this.camera.rotation.y = 0;
        this.camera.rotation.z = 0;
    }
    setCameraBehind() {
        this.camera.position.x = -4800;
        this.camera.position.y = 1400;
        this.camera.position.z = -1800;
        this.camera.lookAt(0, 100, 400);
        return;
    }
}
exports.CameraHandler = CameraHandler;
