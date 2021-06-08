"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientActorFactory = void 0;
const core_1 = require("@cubic-eng/core");
const _1 = require(".");
class ClientActorFactory {
    static createClientActorType(actor) {
        switch (actor.getClientActorType()) {
            case core_1.ClientActorType.ClientMultipleActor:
                return new _1.ClientMultipleActor(actor);
            case core_1.ClientActorType.ClientSingleCenteredActor:
                return new _1.ClientSingleCenteredActor(actor);
            case core_1.ClientActorType.ClientSingleTranslatedActor:
                return new _1.ClientSingleTranslatedActor(actor);
            default:
                return new _1.ClientSingleActor(actor);
        }
    }
}
exports.ClientActorFactory = ClientActorFactory;
