declare class EventHandler {
    private static instance;
    private events;
    static getInstance(): EventHandler;
    private constructor();
    publish(eventName: string, ...args: any): void;
    subscribe(eventName: any, callback: Function): void;
    cleanEvent(eventName: any): void;
}
declare let handler: EventHandler;
export { handler as EventHandler };
