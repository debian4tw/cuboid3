"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientActorFactory = void 0;
const core_1 = require("@cubic-eng/core");
const _1 = require(".");
class ClientActorFactory {
    constructor(clientDefs) {
        this.cliActors = new Map();
        clientDefs.forEach((cliDef) => {
            var _a;
            (_a = cliDef.clientActors) === null || _a === void 0 ? void 0 : _a.forEach((cliAct) => {
                this.registerClientActorType(cliAct.label, cliAct.cliActor);
            });
        });
    }
    createClientActorType(actor) {
        //console.log("creating ClientActorType", actor.getClientActorType())
        if (this.cliActors.get(actor.getClientActorType())) {
            //console.log(actor.name, "CLiActorType found on map", actor.getClientActorType())
            const clientActorConstructor = this.cliActors.get(actor.getClientActorType());
            //console.log("Constructor", clientActorConstructor)
            if (clientActorConstructor) {
                //console.log("Returning cliActorConstructor")
                return new clientActorConstructor(actor);
            }
        }
        else {
            // console.log(actor.getClientActorType(), "not found on map")
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
        return new _1.ClientSingleActor(actor);
    }
    registerClientActorType(label, cliActor) {
        this.cliActors.set(label, cliActor);
    }
}
exports.ClientActorFactory = ClientActorFactory;
