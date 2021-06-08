"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientActorType = void 0;
var ClientActorType;
(function (ClientActorType) {
    ClientActorType[ClientActorType["ClientMultipleActor"] = 0] = "ClientMultipleActor";
    ClientActorType[ClientActorType["ClientCharacterActor"] = 1] = "ClientCharacterActor";
    ClientActorType[ClientActorType["ClientAnimatedCharacterActor"] = 2] = "ClientAnimatedCharacterActor";
    ClientActorType[ClientActorType["ClientSingleActor"] = 3] = "ClientSingleActor";
    ClientActorType[ClientActorType["ClientCurveActor"] = 4] = "ClientCurveActor";
    ClientActorType[ClientActorType["ClientSingleCenteredActor"] = 5] = "ClientSingleCenteredActor";
    ClientActorType[ClientActorType["ClientAnimatedCharacterCenteredActor"] = 6] = "ClientAnimatedCharacterCenteredActor";
    ClientActorType[ClientActorType["ClientAnimatedUnifiedActor"] = 7] = "ClientAnimatedUnifiedActor";
    ClientActorType[ClientActorType["ClientSingleTranslatedActor"] = 8] = "ClientSingleTranslatedActor";
})(ClientActorType = exports.ClientActorType || (exports.ClientActorType = {}));
