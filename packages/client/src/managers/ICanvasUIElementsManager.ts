export interface ICanvasUIElementsManager {
  sceneHUD: any
  cameraHUD: any
  updateUIElements(): void
  setDimensions(width: number, height: number): void
}


interface ICanvasUIElementsManagerClass {
  constructor: new() => ICanvasUIElementsManager
}