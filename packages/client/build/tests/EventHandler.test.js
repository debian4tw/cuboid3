"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cubic-eng/core");
describe('only one instance', function () {
    let handler1 = core_1.EventHandler;
    let handler2 = core_1.EventHandler;
    it('handlers should match', function () {
        expect(handler1).toEqual(handler2);
    });
});
describe('pub-sub', function () {
    let b = 2;
    let c = 10;
    let d = 3;
    let f = { num: 3 };
    let h = 0;
    core_1.EventHandler.subscribe('sum', (c, d, f) => {
        f.num = c * d;
    });
    core_1.EventHandler.publish('sum', c, d, f);
    it('number should be added by event', function () {
        let h = f.num;
        expect(h).toEqual(30);
    });
});
