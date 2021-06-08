"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = void 0;
const GVector2_1 = require("../math/GVector2");
class Rectangle {
    constructor(origin, width, height, rotation = 0) {
        this.origin = origin;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }
    rotate(rotation) {
        this.rotation += rotation;
    }
    getBottomLeft() {
        return this.origin;
    }
    getTopLeft() {
        let x = this.origin.x + this.height * Math.cos((this.rotation + 90) * Math.PI / 180);
        let y = this.origin.y + this.height * Math.sin((this.rotation + 90) * Math.PI / 180);
        return new GVector2_1.GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100);
    }
    getBottomRight() {
        //let x = this.origin.x + this.width * Math.round(Math.cos((this.rotation * Math.PI / 180) + Number.EPSILON) * 100 ) / 100
        //let y = this.origin.y + this.width * Math.round(Math.sin((this.rotation * Math.PI / 180)  + Number.EPSILON)* 100 ) / 100
        let x = this.origin.x + this.width * Math.cos(this.rotation * Math.PI / 180);
        let y = this.origin.y + this.width * Math.sin(this.rotation * Math.PI / 180);
        //return new GRPENG.Vector2(x,y)
        return new GVector2_1.GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100);
    }
    getTopRight() {
        let x = this.getBottomRight().x + this.height * Math.cos((this.rotation + 90) * Math.PI / 180);
        let y = this.getBottomRight().y + this.height * Math.sin((this.rotation + 90) * Math.PI / 180);
        //return new GRPENG.Vector2(x,y)
        return new GVector2_1.GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100);
    }
    getVertices() {
        return {
            'bottomLeft': this.getBottomLeft(),
            'bottomRight': this.getBottomRight(),
            'topRight': this.getTopRight(),
            'topLeft': this.getTopLeft()
        };
    }
    getVerticesArray() {
        return [
            this.getBottomLeft(),
            this.getBottomRight(),
            this.getTopRight(),
            this.getTopLeft()
        ];
    }
}
exports.Rectangle = Rectangle;
