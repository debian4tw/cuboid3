import { GameEvent } from './GameEvent';
export declare class GameEventBus {
    private events;
    constructor();
    addEvent(event: GameEvent): void;
    popEvents(): GameEvent[];
    flush(): void;
}
