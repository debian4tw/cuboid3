export declare class WebWorkerLocalSocket {
    private eventResolvers;
    id: string;
    rooms: Record<string, any>;
    handshake: Record<string, any>;
    setHandshake(name: string, gameId: any): void;
    constructor();
    join(gameId: string): void;
    attachOnMessage(): void;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string): void;
    emit(name: string, ...args: any[]): void;
    disconnect(): void;
}
