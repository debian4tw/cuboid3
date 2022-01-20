"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(socketId, playerName, isBot = false) {
        this.id = socketId;
        this.socketId = socketId;
        this.name = this.sanitize(playerName);
        this.initialLives = 10;
        this.resetScore();
        this.resetLives();
        this.createdAt = new Date();
        this.isBot = isBot;
        this.lastState = {};
    }
    sanitize(playerName) {
        //let name =  playerName.replace(/[\W_]+/g,"");
        let name = playerName.replace(/[^a-zA-Z0-9_\(\)]+/g, "");
        return name;
    }
    setTeam(team) {
        console.log('set team v2', team);
        this.team = team;
    }
    isBotPlayer() {
        return this.isBot;
    }
    serialize() {
        return {
            id: this.id,
            name: this.name,
            lives: this.lives,
            color: this.color,
            team: this.team,
            score: this.score,
            kills: this.kills,
            deaths: this.deaths
        };
    }
    setLastState(state) {
        this.lastState = state;
    }
    getLastState() {
        return this.lastState;
    }
    setColor(color) {
        this.color = color;
    }
    getColor(color) {
        return this.color;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    addLive() {
        this.lives++;
    }
    removeLive() {
        this.lives--;
    }
    resetLives() {
        this.lives = this.initialLives;
    }
    getLives() {
        return this.lives;
    }
    getScore() {
        return this.score;
    }
    setScore(score) {
        this.score = score;
    }
    increaseKills() {
        this.kills++;
    }
    increaseDeaths() {
        this.deaths++;
    }
    resetScore() {
        this.setScore(0);
        this.kills = 0;
        this.deaths = 0;
    }
    playedTime(dateFuture) {
        const locale = "en-US";
        const localeOpts = {
            minimumIntegerDigits: 2,
            useGrouping: false
        };
        let delta = Math.abs(dateFuture.valueOf() - this.createdAt.valueOf()) / 1000;
        //calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        // what's left is seconds
        let seconds = Math.floor(delta % 60);
        return {
            minutes: minutes.toLocaleString(locale, localeOpts),
            seconds: seconds.toLocaleString(locale, localeOpts)
        };
    }
}
exports.Player = Player;
