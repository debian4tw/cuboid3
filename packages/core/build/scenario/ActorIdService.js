"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorIdService = void 0;
class ActorIdService {
    constructor() {
        this.actorId = 1;
    }
    getNextActorId() {
        this.actorId++;
        return this.actorId;
    }
}
exports.ActorIdService = ActorIdService;
