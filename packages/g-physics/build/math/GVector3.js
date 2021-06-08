"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GVector3 = exports.Axis = void 0;
var Axis;
(function (Axis) {
    Axis[Axis["X"] = 0] = "X";
    Axis[Axis["Y"] = 1] = "Y";
    Axis[Axis["Z"] = 2] = "Z";
})(Axis = exports.Axis || (exports.Axis = {}));
class GVector3 {
    constructor(x, y, z) {
        this.precision = 100000;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy() {
        return new GVector3(this.x, this.y, this.z);
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    serialize() {
        return {
            x: this.x,
            y: this.y,
            z: this.z
        };
    }
    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    }
    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;
        return this;
    }
    addScaledVector(vector, scale) {
        this.x += (vector.x * scale);
        this.y += (vector.y * scale);
        this.z += (vector.z * scale);
        //this.x += Math.round(((vector.x * scale) + Number.EPSILON) * 1000) / 1000
        //this.y += Math.round(((vector.y * scale) + Number.EPSILON) * 1000) / 1000
        //this.z += Math.round(((vector.z * scale) + Number.EPSILON) * 1000) / 1000
        //Math.round(((vector.x * scale) + Number.EPSILON) * 100) / 100
        this.x = Math.round(((this.x) + Number.EPSILON) * this.precision) / this.precision;
        this.y = Math.round(((this.y) + Number.EPSILON) * this.precision) / this.precision;
        this.z = Math.round(((this.z) + Number.EPSILON) * this.precision) / this.precision;
    }
    multiply(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
        this.z *= vec.z;
    }
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.x = Math.round(((this.x) + Number.EPSILON) * this.precision) / this.precision;
        this.y = Math.round(((this.y) + Number.EPSILON) * this.precision) / this.precision;
        this.z = Math.round(((this.z) + Number.EPSILON) * this.precision) / this.precision;
        return this;
    }
    divideScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        this.x = Math.round(((this.x) + Number.EPSILON) * this.precision) / this.precision;
        this.y = Math.round(((this.y) + Number.EPSILON) * this.precision) / this.precision;
        this.z = Math.round(((this.z) + Number.EPSILON) * this.precision) / this.precision;
        return this;
    }
    magnitude() {
        let mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
        //console.log('magnitude', this.x, this.y, this.z, mag)
        mag = Math.round(((mag) + Number.EPSILON) * this.precision) / this.precision;
        return mag;
    }
    normalize() {
        //@todo: maybe return other thing instead of 0
        if (this.magnitude() === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        }
        else {
            return this.multiplyScalar(1 / this.magnitude());
        }
    }
    calculateAngleWithVector(vec) {
        let res = Math.acos(this.dotProduct(vec) / (this.magnitude() * vec.magnitude()));
        res = res * (180 / Math.PI);
        return Math.round((res + Number.EPSILON) * 100) / 100;
    }
    calculateAngleOnPlaneXZ(vec) {
        let normA = this.copy().normalize();
        let normB = vec.copy().normalize();
        //console.log("normalized", normA, normB)
        let angle = (180 / Math.PI) * (Math.atan2(normA.x, normA.z) - Math.atan2(normB.x, normB.z));
        if (angle < -180) {
            angle += 360;
        }
        return angle;
    }
    dotProduct(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }
    crossProduct(vec) {
        return new GVector3(Math.round(((this.y * vec.z - this.z * vec.y) + Number.EPSILON) * 100) / 100, Math.round(((this.z * vec.x - this.x * vec.z) + Number.EPSILON) * 100) / 100, Math.round(((this.x * vec.y - this.y * vec.x) + Number.EPSILON) * 100) / 100);
    }
    angleOnAxis(axis) {
        switch (axis) {
            case Axis.Z:
                return Math.atan(this.y / this.x) * (180 / Math.PI);
            case Axis.Y:
                return Math.atan(this.y / this.x) * (180 / Math.PI);
            case Axis.X:
                return Math.atan(this.y / this.x) * (180 / Math.PI);
        }
    }
    rotate3D(angle, axis) {
        switch (axis) {
            case Axis.Z:
                return this.rotateOnZ(angle);
            case Axis.X:
                return this.rotateOnX(angle);
            case Axis.Y:
                return this.rotateOnY(angle);
        }
    }
    rotateOnZ(angle) {
        let radAng = angle * Math.PI / 180;
        let x = this.x * Math.cos(radAng) - this.y * Math.sin(radAng);
        let y = this.x * Math.sin(radAng) + this.y * Math.cos(radAng);
        this.x = Math.round((x + Number.EPSILON) * 100) / 100;
        this.y = Math.round((y + Number.EPSILON) * 100) / 100;
    }
    rotateOnX(angle) {
        let radAng = angle * Math.PI / 180;
        let y = this.y * Math.cos(radAng) - this.z * Math.sin(radAng);
        let z = this.y * Math.sin(radAng) + this.z * Math.cos(radAng);
        this.y = Math.round((y + Number.EPSILON) * 100) / 100;
        this.z = Math.round((z + Number.EPSILON) * 100) / 100;
    }
    rotateOnY(angle) {
        let radAng = angle * Math.PI / 180;
        let x = this.x * Math.cos(radAng) + this.z * Math.sin(radAng);
        let z = -1 * this.x * Math.sin(radAng) + this.z * Math.cos(radAng);
        this.x = Math.round((x + Number.EPSILON) * 100) / 100;
        this.z = Math.round((z + Number.EPSILON) * 100) / 100;
    }
}
exports.GVector3 = GVector3;
