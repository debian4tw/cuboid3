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
exports.RenderManager = void 0;
const OrbitControls_js_1 = require("three/examples/jsm/controls/OrbitControls.js");
const core_1 = require("@cubic-eng/core");
const THREE = __importStar(require("three"));
// import Stats from 'three/examples/jsm/libs/stats.module.js';
class RenderManager {
    constructor() {
        this.inGameUiElements = [];
        this.orbitControlsEnabled = false;
        this.renderCanvas = false;
    }
    init(scene, cameraHandler) {
        this.scene = scene;
        this.cameraHandler = cameraHandler;
        this.inGameUiElements = [];
        // this.orbitControlsEnabled = true
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // @todo: gammaOutput deprecated?
        this.renderer.gammaOutput = true;
        this.renderer.autoClear = false; // testing for 2d canvas
        this.attachEvents();
        this.initCanvas();
        // this.initRenderLoop()
        this.animate();
    }
    attachEvents() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
        core_1.EventHandler.subscribe('AddInGameUiElement', (mesh) => {
            // console.log('AddInGameUiElement', mesh)
            this.inGameUiElements.push(mesh);
        });
        core_1.EventHandler.subscribe('RemoveInGameUiElement', (mesh) => {
            this.inGameUiElements.filter((m) => m !== mesh);
        });
    }
    setSize(width, height) {
        this.renderer.setSize(width, height);
    }
    onWindowResize() {
        const { width, height } = this.calculateCanvassize();
        this.renderer.setSize(width, height);
        this.cameraHandler.getCamera().aspect = width / height;
        this.cameraHandler.getCamera().updateProjectionMatrix();
    }
    initCanvas() {
        const { width, height } = this.calculateCanvassize();
        this.renderer.setSize(width, height);
        const container = document.getElementById("game-container");
        if (container != null) {
            this.renderer.domElement.id = 'game-canvas';
            container.appendChild(this.renderer.domElement);
            // this.stats = Stats();
            // this.stats.domElement.style.left = '210px';
            // container.appendChild( this.stats.domElement );
        }
        else {
            throw (new Error("div with id: game-container not found"));
        }
        if (this.orbitControlsEnabled) {
            const controls = new OrbitControls_js_1.OrbitControls(this.cameraHandler.getCamera(), this.renderer.domElement);
            controls.target.set(0, 100, 0);
            controls.update();
        }
        /*let animate = () => {
            requestAnimationFrame( animate );
            this.renderer.render( this.scene, this.camera );
        };*/
    }
    initRenderLoop() {
        this.limitLoop(() => {
            // console.log(this.renderer.info.render.calls)
            const cameraQuaternion = this.cameraHandler.getCamera().quaternion;
            this.inGameUiElements.forEach((uiElement) => {
                uiElement.quaternion.copy(cameraQuaternion);
            });
            this.renderer.render(this.scene, this.cameraHandler.getCamera());
            // this.stats.update();
            // console.log("calls", this.renderer.info.render.calls );
            // console.log("triangles", this.renderer.info.render.triangles );
            // this.effect.render(this.scene, this.camera)
        }, 30);
    }
    animate() {
        requestAnimationFrame(() => { this.animate(); });
        /*let cameraQuaternion = this.cameraHandler.getCamera().quaternion
          this.inGameUiElements.forEach((uiElement: THREE.Mesh) => {
          uiElement.quaternion.copy(cameraQuaternion)
        })*/
        this.renderer.render(this.scene, this.cameraHandler.getCamera());
        // console.log("calls", this.renderer.info.render.calls );
        // console.log("triangles", this.renderer.info.render.triangles );
        // this.stats.update();
    }
    limitLoop(fn, fpsArg) {
        let then = new Date().getTime();
        // custom fps, otherwise fallback to 60
        const fps = fpsArg || 30;
        const interval = 1000 / fps;
        let oldtime = +new Date;
        const that = this;
        return (function loop(time) {
            // console.log(that)
            requestAnimationFrame(loop);
            // again, Date.now() if it's available
            const now = new Date().getTime();
            const delta = now - then;
            if (delta > interval) {
                // Update time
                // now - (delta % interval) is an improvement over just
                // using then = now, which can end up lowering overall fps
                // console.log(delta);
                oldtime = time;
                then = now - (delta % interval);
                // call the fn
                fn();
            }
        }(0));
    }
    calculateCanvassize() {
        /*const headerElem = document.getElementById("header")!
        // const gameStatusEleme = document.getElementById("game-status")
        const windowHeight = window.innerHeight
        const rendererHeight = windowHeight - headerElem?.clientHeight
    
        const playerInfoElem = document.getElementById("players-info")!
        const sidebarAdContainer = document.getElementById("ad-container")!
        const windowWidth = window.innerWidth
    
        // tslint:disable-next-line:no-console
        console.log("Renderer dimensions", windowWidth, windowHeight)
        const rendererWidth = windowWidth - playerInfoElem?.clientWidth - sidebarAdContainer?.clientWidth
        // tslint:disable-next-line:no-console
        console.log("rendererWidth rendererHeight", rendererWidth, rendererHeight)
        */
        const container = document.getElementById('game-container');
        return {
            width: (container === null || container === void 0 ? void 0 : container.clientWidth) || 800,
            height: (container === null || container === void 0 ? void 0 : container.clientHeight) || 600
        };
    }
    clearThreeScene(obj) {
        while (obj.children.length > 0) {
            this.clearThreeScene(obj.children[0]);
            obj.remove(obj.children[0]);
        }
        if (obj.geometry)
            obj.geometry.dispose();
        if (obj.material) {
            // in case of map, bumpMap, normalMap, envMap ...
            Object.keys(obj.material).forEach(prop => {
                if (!obj.material[prop]) {
                    return;
                }
                if (typeof obj.material[prop].dispose === 'function') {
                    obj.material[prop].dispose();
                }
            });
            obj.material.dispose();
        }
    }
}
exports.RenderManager = RenderManager;
