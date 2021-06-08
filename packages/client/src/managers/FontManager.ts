import * as THREE from "three"

class FontManager {

  private static instance: FontManager | null = null
  private loader: THREE.FontLoader
  private loadedFonts: Map<string, THREE.Font>
  private basePath = '/public/fonts/'

  private constructor() {
    this.loader = new THREE.FontLoader()
    this.loadedFonts = new Map()
  }

  public static getInstance() {
    if (this.instance === null) {
      this.instance = new FontManager()
    }
    return this.instance
  }

  public loadFont(label: string, callback: Function) {

    if (this.loadedFonts.get(label)) {
      callback(this.loadedFonts.get(label))
      return
    }

    this.loader.load( `${this.basePath}${label}`, (font: THREE.Font) => {
      this.loadedFonts.set(label, font)
      callback(font)
    })
  }

}

const handler = FontManager.getInstance()
export {handler as FontManager}
