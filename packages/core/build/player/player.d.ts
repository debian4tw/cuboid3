export declare class Player {
    private id;
    socketId: string;
    lives: number;
    initialLives: number;
    name: string;
    color: any;
    score: number;
    kills: number;
    deaths: number;
    team: number;
    private createdAt;
    private isBot;
    constructor(socketId: string, playerName: string, isBot?: boolean);
    sanitize(playerName: string): string;
    setTeam(team: number): void;
    isBotPlayer(): boolean;
    serialize(): {
        id: string;
        name: string;
        lives: number;
        color: any;
        team: number;
        score: number;
        kills: number;
        deaths: number;
    };
    setColor(color: any): void;
    getColor(color: any): any;
    getId(): string;
    getName(): string;
    addLive(): void;
    removeLive(): void;
    resetLives(): void;
    getLives(): number;
    getScore(): number;
    setScore(score: number): void;
    increaseKills(): void;
    increaseDeaths(): void;
    resetScore(): void;
    playedTime(dateFuture: Date): {
        minutes: string;
        seconds: string;
    };
}
