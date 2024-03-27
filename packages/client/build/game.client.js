"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameClient = void 0;
const io = __importStar(require("socket.io-client"));
const THREE = __importStar(require("three"));
const core_1 = require("@cuboid3/core");
const core_2 = require("@cuboid3/core");
const core_3 = require("@cuboid3/core");
const ClientActorRegistry_1 = require("./client-actors/ClientActorRegistry");
const InputHandler_1 = require("./InputHandler");
const CameraHandler_1 = require("./CameraHandler");
const RenderManager_1 = require("./managers/RenderManager");
const WebWorkerLocalSocketClient_1 = require("./WebWorkerLocalSocketClient");
class GameClient {
    constructor(url, scenarioDefs, clientDefs) {
        this.clientScenarios = {};
        this.url = url;
        this.scenarioDefs = scenarioDefs;
        this.clientStepManagers = [];
        // tslint:disable-next-line:no-console
        console.log("%c CubicEngine Started", "color: white;font-weight:bold;background-color: black; padding:10px;");
        this.registerClientScenarios(clientDefs);
    }
    registerClientScenarios(importedScenarios) {
        importedScenarios.forEach((scenarioDefinition) => {
            this.clientScenarios[scenarioDefinition.name] = scenarioDefinition;
        });
    }
    setCanvasUIElementsManager(canvasUIElementsManager) {
        this.canvasUIElementsManager = canvasUIElementsManager;
    }
    connectLocal(worker, name, gameId) {
        this.sock = new WebWorkerLocalSocketClient_1.WebWorkerLocalSocketClient(worker);
        this.sock.connect(name, gameId);
        this.onClientConnect(gameId);
    }
    connect(name, gameId) {
        const params = {
            name,
            gameId,
        };
        const queryString = Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&");
        this.sock = io.connect(this.url, {
            query: queryString,
        });
        this.onClientConnect(gameId);
    }
    onClientConnect(gameId) {
        this.sock.on("connect_error", () => {
            // tslint:disable-next-line:no-console
            console.log("connect error");
            core_2.EventHandler.publish("client:connectError");
        });
        this.sock.on("connect", () => {
            core_2.EventHandler.publish("client:connected", name);
            this.attachNetworkEvents();
            this.scene = new THREE.Scene();
            this.game = new core_1.Game(gameId, this.scenarioDefs, null);
            // console.log("creating clientActorRegistry", this.clientScenarios)
            this.clientActorRegistry = new ClientActorRegistry_1.ClientActorRegistry(this.game, this.scene, Object.values(this.clientScenarios));
            this.renderManager = new RenderManager_1.RenderManager();
            const { width, height } = this.renderManager.calculateCanvassize();
            this.cameraHandler = new CameraHandler_1.CameraHandler(new THREE.PerspectiveCamera(60, width / height, 0.1, 12000));
            this.cameraHandler.init(this.scenarioDefs);
            this.inputHandler = new InputHandler_1.InputHandler(this.sock, document, this.clientScenarios);
            this.inputHandler.init();
            if (this.canvasUIElementsManager) {
                this.renderManager.addCanvas2D(new this.canvasUIElementsManager(width, height, this.cameraHandler.getCamera()));
            }
            this.renderManager.init(this.scene, this.cameraHandler);
        });
        this.sock.on("disconnect", () => {
            // console.log("client disconnected from server")
        });
    }
    disconnect() {
        if (typeof this.sock !== "undefined") {
            this.sock.disconnect();
        }
    }
    setUrl(url) {
        this.url = url;
    }
    onSocketGameEvents(events) {
        if (typeof events === "undefined" || events.length === 0) {
            return;
        }
        const scenarioName = this.game.getScenario().getName();
        if (scenarioName &&
            typeof this.clientScenarios[scenarioName] !== "undefined" &&
            typeof this.clientScenarios[scenarioName].resolveRemoteGameEvent !==
                "undefined") {
            events.forEach((event) => {
                this.clientScenarios[scenarioName].resolveRemoteGameEvent(event);
            });
        }
    }
    clientScenarioChange(status) {
        var _a;
        this.clientActorRegistry.clean();
        this.renderManager.clearThreeScene(this.scene);
        const scenarioId = this.game.scenariosNameMap[status.type];
        const scenarioDef = this.game.scenarios[scenarioId];
        if (!scenarioDef) {
            return;
        }
        this.game.setScenario(scenarioId);
        if (typeof scenarioDef.initScene !== "undefined") {
            //scenarioDef.initScene(this.scene);
        }
        if (typeof this.clientScenarios[scenarioDef.name] !== "undefined") {
            core_2.EventHandler.publish("client:cleanUIComponents");
            const cliScenarioDef = this.clientScenarios[scenarioDef.name];
            if (typeof cliScenarioDef.initScene !== "undefined") {
                cliScenarioDef.initScene(this.scene);
            }
            (_a = cliScenarioDef.uiComps) === null || _a === void 0 ? void 0 : _a.forEach((comp) => {
                core_2.EventHandler.publish("client:addUIComponent", comp);
            });
            // @todo: clean clientManagers and instantiate new ones
            if (typeof cliScenarioDef.clientStepManagers !== "undefined") {
                cliScenarioDef.clientStepManagers.forEach((clientManager) => {
                    this.clientStepManagers.push(new clientManager(this.scene, this.clientActorRegistry));
                });
            }
        }
        if (typeof scenarioDef.opts.lockScreen !== "undefined" &&
            scenarioDef.opts.lockScreen === true) {
            core_2.EventHandler.publish("client:lockScreen");
        }
        else {
            core_2.EventHandler.publish("client:unlockScreen");
        }
    }
    onSocketStatus(status) {
        var _a;
        status = JSON.parse(core_3.NetworkUtils.decodeString(status));
        // console.log("onSocketStatus", status)
        this.onSocketGameEvents(status.events);
        if (status.type !== this.game.getScenarioName()) {
            this.clientScenarioChange(status);
        }
        if (typeof status.state === "undefined" || status.state.length === 0) {
            return;
        }
        status.state.forEach((remoteObj) => {
            this.processRemoteActorObj(remoteObj);
        });
        this.cameraHandler.updateCamera();
        (_a = this.clientStepManagers) === null || _a === void 0 ? void 0 : _a.forEach((clientStepManager) => {
            clientStepManager.update();
        });
        this.cleanupOldActorsObj(status);
    }
    onSocketDiff(status) {
        var _a;
        status = JSON.parse(core_3.NetworkUtils.decodeString(status));
        // console.log("onSocketDiff", status)
        this.onSocketGameEvents(status.events);
        if (status.type !== this.game.getScenarioName()) {
            this.clientScenarioChange(status);
        }
        if (typeof status.state === "undefined" || status.state.length === 0) {
            return;
        }
        status.state.forEach((remoteObj) => {
            this.processRemoteActorDiffObj(remoteObj);
        });
        if (status.removed) {
            status.removed.forEach((removedId) => {
                this.clientActorRegistry.deleteById(removedId);
            });
        }
        this.cameraHandler.updateCamera();
        (_a = this.clientStepManagers) === null || _a === void 0 ? void 0 : _a.forEach((clientStepManager) => {
            clientStepManager.update();
        });
    }
    cleanupOldActorsObj(status) {
        if (status.state.length < this.clientActorRegistry.getArr().length) {
            this.clientActorRegistry.getArr().forEach((cliAct) => {
                const found = status.state.find((remoteObj) => remoteObj.id === cliAct.id);
                if (!found) {
                    this.clientActorRegistry.delete(cliAct);
                }
            });
        }
    }
    processRemoteActorObj(remoteObj) {
        // console.log(remoteObj);
        if (!this.validateRemoteObj(remoteObj)) {
            return;
        }
        const cliAct = this.clientActorRegistry.findById(remoteObj.id);
        if (typeof cliAct === "undefined") {
            this.clientActorRegistry
                .create(this.game.getScenario().addRemoteActor(remoteObj))
                .then((newCliAct) => {
                if (remoteObj.id === this.cameraHandler.getFollowedActorId()) {
                    this.onPrimaryActorAdded(newCliAct.id);
                }
            });
        }
        if (typeof cliAct !== "undefined") {
            cliAct.updateActor(remoteObj);
            // @todo: update should be independent of receiving msg
            // probably should be called by render loop
            cliAct.update();
        }
    }
    processRemoteActorDiffObj(remoteObj) {
        if (typeof remoteObj.id === "undefined") {
            return;
        }
        const cliAct = this.clientActorRegistry.findById(remoteObj.id);
        if (typeof cliAct !== "undefined") {
            cliAct.getActor().setProps(remoteObj);
            // @todo: update should be independent of receiving msg
            // probably should be called by render loop
            cliAct.update();
        }
        else {
            if (this.validateRemoteObj(remoteObj)) {
                // console.log("diff did not exist - creating", remoteObj.label, remoteObj)
                this.clientActorRegistry
                    .create(this.game.getScenario().addRemoteActor(remoteObj))
                    .then((newCliAct) => {
                    newCliAct.getActor().setProps(remoteObj);
                    newCliAct.update();
                });
            }
        }
        // fow now ignoring if it doesnt exist,
        // it should probabl;y ask to the server for fullState of actor
    }
    validateRemoteObj(remoteObj) {
        if (typeof remoteObj.id === "undefined") {
            // tslint:disable-next-line:no-console
            console.log("id not defined on remoteObj");
            return false;
        }
        if (typeof remoteObj.label === "undefined") {
            // tslint:disable-next-line:no-console
            console.log("label not defined on remoteObj", remoteObj);
            return false;
        }
        if (typeof remoteObj.name === "undefined") {
            // tslint:disable-next-line:no-console
            console.log("name not defined on remoteObj");
            return false;
        }
        return true;
    }
    onGameStatus(gameStatus) {
        // console.log(gameStatus);
        this.game.setGameState(gameStatus);
        core_2.EventHandler.publish("gameStatus", gameStatus);
    }
    onPrimaryActorAdded(actorId) {
        console.log("onPrimaryActorAdded", actorId);
        this.cameraHandler.setFollowedActorId(actorId);
        const cliActor = this.clientActorRegistry.findById(actorId);
        console.log("cliActor mesh?", cliActor === null || cliActor === void 0 ? void 0 : cliActor.getMesh());
        if (cliActor && cliActor.getMesh()) {
            this.cameraHandler.followSubject(cliActor.getActor(), cliActor.getMesh());
            core_2.EventHandler.publish("attachAudioListener", cliActor.getMesh());
            //this three events shoyld be the same, only one
            core_2.EventHandler.publish("client:primaryActorTypeAdded", cliActor.getActor().name);
            core_2.EventHandler.publish("client:primaryActorAdded", cliActor.getActor());
            core_2.EventHandler.publish("client:primaryClientActorAdded", cliActor);
        }
        else {
            // tslint:disable-next-line:no-console
            console.log("onPrimaryActorAdded: actor or mesh not found, rescheduling", actorId);
            // console.log(this.game.getScenario().getState())
            setTimeout(() => {
                this.onPrimaryActorAdded(actorId);
            }, 800);
        }
        // EventHandler.cleanEvent('client:actorDashed')
        core_2.EventHandler.subscribe("client:actorDashed", (actId) => {
            if (actorId === actId) {
                core_2.EventHandler.publish("client:dashReload");
            }
        });
        core_2.EventHandler.cleanEvent("client:playerLostLive");
        core_2.EventHandler.subscribe("client:playerLostLive", (actId) => {
            if (actorId === actId) {
                core_2.EventHandler.publish("client:displayRespawnOverlay");
                core_2.EventHandler.publish("client:resetStatsPanel");
            }
        });
    }
    onTeamWon(team) {
        core_2.EventHandler.publish("client:teamWon", team);
    }
    attachNetworkEvents() {
        this.sock.off("status");
        this.sock.off("pong");
        this.sock.off("gameStatus");
        this.sock.off("primaryActorAdded");
        this.sock.off("teamWon");
        this.sock.off("scenarioStatus");
        this.sock.off("pickRole");
        this.sock.off("levelIncreased");
        this.sock.off("scenarioDiff");
        this.sock.off("servMessage");
        this.sock.on("gameStatus", (gameStatus) => {
            this.onGameStatus(gameStatus);
        });
        this.sock.on("scenarioStatus", (status) => {
            this.onSocketStatus(status);
        });
        this.sock.on("scenarioDiff", (status) => {
            this.onSocketDiff(status);
        });
        this.sock.on("primaryActorAdded", (status) => {
            this.onPrimaryActorAdded(status.actorId);
        });
        this.sock.on("teamWon", (team) => {
            // console.log('team won')
            this.onTeamWon(team);
        });
        this.sock.on("displayPickRole", () => {
            core_2.EventHandler.publish("client:displayPickRole");
        });
        this.sock.on("pong", (ms) => {
            const latency = ms;
            const container = document.getElementById("latency");
            if (container !== null) {
                container.innerHTML = latency;
            }
        });
        this.sock.on("levelIncreased", () => {
            core_2.EventHandler.publish("client:levelIncreased");
        });
        this.sock.on("servMessage", (msg) => {
            // console.log("received servMessage", msg)
            core_2.EventHandler.publish("client:" + msg.name, msg.data);
        });
    }
}
exports.GameClient = GameClient;
