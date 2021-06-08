/// <reference types="socket.io-client" />
export declare class InputHandler {
    private sock;
    private document;
    private currentMouseCoord;
    private screenLocked;
    private mouseSensitivity;
    private clientScenarioDefs;
    constructor(socket: SocketIOClient.Socket, document: Document, clientScenarioDefs: any);
    init(): void;
    lockScreenOnCanvasClick(): void;
    unlockScreen(): void;
    setMouseSensitivity(sensitivity: number): void;
    defaultAttachInputEvents(): void;
}
