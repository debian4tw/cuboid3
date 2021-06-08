declare class FontManager {
    private static instance;
    private loader;
    private loadedFonts;
    private basePath;
    private constructor();
    static getInstance(): FontManager;
    loadFont(label: string, callback: Function): void;
}
declare const handler: FontManager;
export { handler as FontManager };
