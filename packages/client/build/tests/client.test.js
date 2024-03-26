"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_client_1 = require("../game.client");
/*
let game = new Game("323", [], null);
game.setScenario(1);

let scene = new THREE.Scene();
*/
describe("client with local worker", () => {
    it("should create client with local worker", () => {
        const client = new game_client_1.GameClient("local", [], []);
    });
});
