import { CameraHandler } from "../CameraHandler";
import { OrbitControls as THREEOrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { EventHandler } from "@cuboid3/core";
import * as THREE from "three";
import { ICanvasUIElementsManager } from ".";
// import Stats from 'three/examples/jsm/libs/stats.module.js';

export class RenderManager {
  private renderer : THREE.WebGLRenderer
  private cameraHandler: CameraHandler
  private scene : THREE.Scene
  private orbitControlsEnabled: boolean
  private inGameUiElements: THREE.Mesh[]
  // private stats: Stats
  private canvasUIElementsManager: ICanvasUIElementsManager

  renderCanvas: boolean
  constructor() {
    this.inGameUiElements = []
    this.orbitControlsEnabled = false
    this.renderCanvas = false
  }

  init(scene: THREE.Scene, cameraHandler: CameraHandler) {
    this.scene = scene
    this.cameraHandler = cameraHandler
    this.inGameUiElements = []
    // this.orbitControlsEnabled = true

    this.renderer = new THREE.WebGLRenderer( {antialias: false})
    this.renderer.setPixelRatio( window.devicePixelRatio );

    // @todo: gammaOutput deprecated?
    (this.renderer as any).gammaOutput = true

    this.renderer.autoClear = false;// testing for 2d canvas
    this.attachEvents()

    this.initCanvas()
    // this.initRenderLoop()
    this.animate()
  }

  attachEvents() {
    window.addEventListener( 'resize', () => this.onWindowResize(), false );

    EventHandler.subscribe('AddInGameUiElement', (mesh: THREE.Mesh) => {
      // console.log('AddInGameUiElement', mesh)
      this.inGameUiElements.push(mesh)
    })

    EventHandler.subscribe('RemoveInGameUiElement', (mesh: THREE.Mesh) => {
      this.inGameUiElements = this.inGameUiElements.filter((m) => m !== mesh)
    })
  }

  setSize(width: number, height: number) {
    this.renderer.setSize( width, height);
  }

  onWindowResize() {
    const {width, height} = this.calculateCanvassize()
    this.renderer.setSize( width, height);
    this.cameraHandler.getCamera().aspect = width / height;
    this.cameraHandler.getCamera().updateProjectionMatrix();

    this.canvasUIElementsManager?.setDimensions(width, height)
  }

  initCanvas() {
    const {width, height} = this.calculateCanvassize()
    this.renderer.setSize( width, height);

    const container = document.getElementById("game-container");
    if(container != null ) {
      this.renderer.domElement.id = 'game-canvas';
      container.appendChild( this.renderer.domElement );

      // this.stats = Stats();
      // this.stats.domElement.style.left = '210px';
      // container.appendChild( this.stats.domElement );
    } else {
      throw(new Error("div with id: game-container not found"));
    }



    if (this.orbitControlsEnabled) {
      const controls = new THREEOrbitControls(this.cameraHandler.getCamera(), this.renderer.domElement);
      controls.target.set(0, 100, 0);
      controls.update()
    }

    /*let animate = () => {
        requestAnimationFrame( animate );
        this.renderer.render( this.scene, this.camera );
    };*/
  }

  public initRenderLoop() {
    this.limitLoop(() => {
      // console.log(this.renderer.info.render.calls)
      const cameraQuaternion = this.cameraHandler.getCamera().quaternion
      this.inGameUiElements.forEach((uiElement: THREE.Mesh) => {
        uiElement.quaternion.copy(cameraQuaternion)
      })
      this.renderer.render( this.scene, this.cameraHandler.getCamera() )
      // this.stats.update();
      // console.log("calls", this.renderer.info.render.calls );
      // console.log("triangles", this.renderer.info.render.triangles );
      // this.effect.render(this.scene, this.camera)
    },30)
  }


  animate() {
    requestAnimationFrame( () => {this.animate()});
    /*let cameraQuaternion = this.cameraHandler.getCamera().quaternion
      this.inGameUiElements.forEach((uiElement: THREE.Mesh) => {
      uiElement.quaternion.copy(cameraQuaternion)
    })*/
    this.renderer.render( this.scene, this.cameraHandler.getCamera() )
    // console.log("calls", this.renderer.info.render.calls );
    // console.log("triangles", this.renderer.info.render.triangles );

    if (this.canvasUIElementsManager) {
      this.canvasUIElementsManager.updateUIElements()
      this.renderer.render( this.canvasUIElementsManager.sceneHUD, this.canvasUIElementsManager.cameraHUD )
    }
    // this.stats.update();

  }

  public limitLoop(fn: any, fpsArg: any) {

    let then = new Date().getTime();
    // custom fps, otherwise fallback to 60
    const fps = fpsArg || 30;
    const interval = 1000 / fps;
    let oldtime = +new Date;
    const that = this
    return (function loop(time){
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


  public calculateCanvassize() {
    /*const headerElem = document.getElementById("header")
    const gameStatusEleme = document.getElementById("game-status")
    const windowHeight = window.innerHeight
    const rendererHeight = windowHeight - (headerElem?.clientHeight || 0)

    const playerInfoElem = document.getElementById("players-info")
    const sidebarAdContainer = document.getElementById("ad-container")
    const windowWidth = window.innerWidth
    const rendererWidth = windowWidth - playerInfoElem?.clientWidth! - sidebarAdContainer?.clientWidth! 
    */
    const container = document.getElementById("game-container")
    if (!container) {
      console.log("missing game-container div")
    } else {
      console.log(container, container.clientWidth, container.clientHeight)
    }
    
    const rendererWidth = container?.clientWidth || 0;
    const rendererHeight = container?.clientHeight || 0;

    return {
      width: rendererWidth,
      height: rendererHeight
    }
  }


  clearThreeScene(obj: any) {
    while(obj.children.length > 0){
      this.clearThreeScene(obj.children[0])
      obj.remove(obj.children[0]);
    }
    if(obj.geometry) obj.geometry.dispose()
    if(obj.material) {
      // in case of map, bumpMap, normalMap, envMap ...
      Object.keys(obj.material).forEach(prop => {
        if(!obj.material[prop]){
          return
        }

        if(typeof obj.material[prop].dispose === 'function'){
          obj.material[prop].dispose()
        }

      })
      if (typeof obj.material.dispose === 'function') {
        obj.material.dispose()
      }
    }
  }

  addCanvas2D(canvas2DManager: ICanvasUIElementsManager) {
    this.canvasUIElementsManager = canvas2DManager
  }
}