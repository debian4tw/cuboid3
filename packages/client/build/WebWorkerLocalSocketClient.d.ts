export declare class WebWorkerLocalSocketClient {
    private worker;
    private eventResolvers;
    id: string;
    constructor(worker: Worker);
    connect(name: string, gameId: string): void;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string): void;
    emit(name: string, ...args: any[]): void;
    disconnect(): void;
}
