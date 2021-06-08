"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpawnLocation_manager_1 = require("../scenario/SpawnLocation.manager");
const SpawnLocations_1 = require("../scenario/SpawnLocations");
describe('SpawnLocationManager test', function () {
    const manager = new SpawnLocation_manager_1.SpawnLocationManager(SpawnLocations_1.spawnLocations);
    const slotsAmount = SpawnLocations_1.spawnLocations.length;
    it('all slots should be free', function () {
        const freeSlots = manager.getSlots().filter(slot => slot.busy === false);
        expect(freeSlots.length).toBe(slotsAmount);
    });
    it('one slot should be busy', function () {
        manager.getNextAvailable();
        const freeSlots = manager.getSlots().filter(slot => slot.busy === false);
        expect(freeSlots.length).toBe(slotsAmount - 1);
    });
    it('two slots should be busy', function () {
        manager.getNextAvailable();
        const freeSlots = manager.getSlots().filter(slot => slot.busy === false);
        expect(freeSlots.length).toBe(slotsAmount - 2);
    });
});
describe('SpawnLocationManager test with all busy slots', function () {
    const manager = new SpawnLocation_manager_1.SpawnLocationManager(SpawnLocations_1.spawnLocations);
    const slotsAmount = SpawnLocations_1.spawnLocations.length;
    manager.getNextAvailable();
    manager.getNextAvailable();
    manager.getNextAvailable();
    manager.getNextAvailable();
    manager.getNextAvailable();
    manager.getNextAvailable();
    manager.getNextAvailable();
    it('all slots should be busy', function () {
        const freeSlots = manager.getSlots().filter(slot => slot.busy === false);
        expect(freeSlots.length).toBe(0);
    });
    it('should return a slot, even all are busy', function () {
        const location = manager.getNextAvailable();
        expect(location).toHaveProperty("loc");
        expect(location).toHaveProperty("rot");
    });
    it('slots should be busy after 3s', () => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(res => setTimeout(() => {
            const freeSlots = manager.getSlots().filter(slot => slot.busy === false);
            console.log("freeSlots 3s", freeSlots);
            expect(freeSlots.length).toBe(0);
            res();
        }, 3 * 1000));
    }), 3 * 1000);
    it('slots should stop being busy after 8s', () => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(res => setTimeout(() => {
            const freeSlots = manager.getSlots().filter(slot => slot.busy === false);
            console.log("freeSlots 8s", freeSlots);
            expect(freeSlots.length).toBe(slotsAmount);
            res();
        }, 10 * 1000));
    }), 10 * 1000);
});
