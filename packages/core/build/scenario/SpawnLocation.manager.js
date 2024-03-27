"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnLocationManager = void 0;
const util_1 = require("../util");
class SpawnLocationManager {
    constructor(spawnLocations) {
        this.busyTime = 8 * 1000; // 8s
        this.spawnLocations = [];
        spawnLocations.forEach((spawnLoc) => {
            this.spawnLocations.push({
                busy: false,
                slot: spawnLoc,
            });
        });
        this.spawnLocationsCount = spawnLocations.length;
    }
    getNextAvailable(team) {
        const loc = this.getFreeSlot();
        loc.busy = true;
        setTimeout(() => {
            loc.busy = false;
        }, this.busyTime);
        return loc.slot;
    }
    getFreeSlot() {
        let loc;
        loc =
            this.spawnLocations[util_1.Random.getRandomInt(this.spawnLocationsCount - 1, 0)];
        if (loc.busy === true) {
            loc = this.spawnLocations.find((item) => item.busy === false);
            if (!loc) {
                loc =
                    this.spawnLocations[util_1.Random.getRandomInt(this.spawnLocationsCount - 1, 0)];
            }
        }
        return loc;
    }
    getSlots() {
        return this.spawnLocations;
    }
}
exports.SpawnLocationManager = SpawnLocationManager;
