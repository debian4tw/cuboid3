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
exports.FontManager = void 0;
const THREE = __importStar(require("three"));
class FontManager {
    constructor() {
        this.basePath = '/public/fonts/';
        this.loader = new THREE.FontLoader();
        this.loadedFonts = new Map();
    }
    static getInstance() {
        if (this.instance === null) {
            this.instance = new FontManager();
        }
        return this.instance;
    }
    loadFont(label, callback) {
        if (this.loadedFonts.get(label)) {
            callback(this.loadedFonts.get(label));
            return;
        }
        this.loader.load(`${this.basePath}${label}`, (font) => {
            this.loadedFonts.set(label, font);
            callback(font);
        });
    }
}
FontManager.instance = null;
const handler = FontManager.getInstance();
exports.FontManager = handler;
