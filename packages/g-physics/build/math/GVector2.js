"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GVector2 = void 0;
class GVector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getX() {
        return this.x;
    }
    sumScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
    }
    dotProduct(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    clone() {
        return new GVector2(this.x, this.y);
    }
    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }
    magnitude() {
        let mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        console.log('magnitude', this.x, this.y, mag);
        return mag;
    }
    angle() {
        return Math.atan(this.y / this.x) * (180 / Math.PI);
    }
    rotate(angle) {
        let magnitude = this.magnitude();
        let currentAngle = this.angle();
        this.x = Math.round((magnitude * Math.cos((currentAngle + angle) * Math.PI / 180) + Number.EPSILON) * 100) / 100;
        this.y = Math.round((magnitude * Math.sin((currentAngle + angle) * Math.PI / 180) + Number.EPSILON) * 100) / 100;
    }
    rotate2D(angle) {
        //x' = x cos θ − y sin θ
        let radAng = angle * Math.PI / 180;
        let x = this.x * Math.cos(radAng) - this.y * Math.sin(radAng);
        //y' = x sin θ + y cos θ
        let y = this.x * Math.sin(radAng) + this.y * Math.cos(radAng);
        this.x = Math.round((x + Number.EPSILON) * 100) / 100;
        this.y = Math.round((y + Number.EPSILON) * 100) / 100;
    }
}
exports.GVector2 = GVector2;
