"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectangleCentered = void 0;
const GVector2_1 = require("../math/GVector2");
class RectangleCentered {
    constructor(origin, width, height, rotation = 0) {
        this.origin = origin;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.baseVerticesAngle = 0;
        this.calculateHypotenuse();
        this.calculateBaseVerticesAngle();
        //console.log('Angle:', this.height, this.hypotenuse, this.baseVerticesAngle);
    }
    calculateHypotenuse() {
        this.hypotenuse = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
    }
    calculateBaseVerticesAngle() {
        //console.log('soh', this.height / 2 / this.hypotenuse )
        //console.log('asin', Math.asin(this.height / 2 / this.hypotenuse ) )
        this.baseVerticesAngle = Math.round(((180 / Math.PI) * Math.asin(this.height / 2 / this.hypotenuse) + Number.EPSILON) * 100) / 100;
    }
    rotate(rotation) {
        this.rotation += rotation;
    }
    rotateOnPivot(pivot, rotation) {
        this.origin.add(pivot);
        this.origin.rotate(rotation);
        this.rotation += rotation;
    }
    getBottomLeft() {
        let vertexRot = this.baseVerticesAngle + 180;
        let currentRotation = (vertexRot + this.rotation) * Math.PI / 180;
        let x = this.origin.x + this.hypotenuse * Math.cos(currentRotation);
        let y = this.origin.y + this.hypotenuse * Math.sin(currentRotation);
        return new GVector2_1.GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100);
    }
    getTopLeft() {
        let vertexRot = 180 - this.baseVerticesAngle;
        let currentRotation = (vertexRot + this.rotation) * Math.PI / 180;
        let x = this.origin.x + this.hypotenuse * Math.cos(currentRotation);
        let y = this.origin.y + this.hypotenuse * Math.sin(currentRotation);
        //return new GRPENG.Vector2(x,y)
        return new GVector2_1.GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100);
    }
    getBottomRight() {
        let vertexRot = 360 - this.baseVerticesAngle;
        let currentRotation = (vertexRot + this.rotation) * Math.PI / 180;
        let x = this.origin.x + this.hypotenuse * Math.cos(currentRotation);
        let y = this.origin.y + this.hypotenuse * Math.sin(currentRotation);
        return new GVector2_1.GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100);
    }
    getTopRight() {
        let currentRotation = (this.baseVerticesAngle + this.rotation) * Math.PI / 180;
        let x = this.origin.x + this.hypotenuse * Math.cos(currentRotation);
        let y = this.origin.y + this.hypotenuse * Math.sin(currentRotation);
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
exports.RectangleCentered = RectangleCentered;
