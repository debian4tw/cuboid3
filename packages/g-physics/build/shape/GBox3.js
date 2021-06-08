"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GBox3 = exports.GBox3Vertex = void 0;
const GVector3_1 = require("../math/GVector3");
var GBox3Vertex;
(function (GBox3Vertex) {
    GBox3Vertex[GBox3Vertex["RUF"] = 0] = "RUF";
    GBox3Vertex[GBox3Vertex["RDF"] = 1] = "RDF";
    GBox3Vertex[GBox3Vertex["LUF"] = 2] = "LUF";
    GBox3Vertex[GBox3Vertex["LDF"] = 3] = "LDF";
    GBox3Vertex[GBox3Vertex["RUB"] = 4] = "RUB";
    GBox3Vertex[GBox3Vertex["RDB"] = 5] = "RDB";
    GBox3Vertex[GBox3Vertex["LUB"] = 6] = "LUB";
    GBox3Vertex[GBox3Vertex["LDB"] = 7] = "LDB";
})(GBox3Vertex = exports.GBox3Vertex || (exports.GBox3Vertex = {}));
class GBox3 {
    constructor(origin, w, h, d, r = null) {
        this.origin = origin;
        let x = origin.x;
        let y = origin.y;
        let z = origin.z;
        this.w = w;
        this.h = h;
        this.d = d;
        this.r = { x: 0, y: 0, z: 0 };
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.nodes = [
            [x + w / 2, y + h / 2, z + d / 2],
            [x + w / 2, y - h / 2, z + d / 2],
            [x - w / 2, y + h / 2, z + d / 2],
            [x - w / 2, y - h / 2, z + d / 2],
            [x + w / 2, y + h / 2, z - d / 2],
            [x + w / 2, y - h / 2, z - d / 2],
            [x - w / 2, y + h / 2, z - d / 2],
            [x - w / 2, y - h / 2, z - d / 2] //LDB
        ];
        if (r !== null && (r.x !== 0 || r.y !== 0 || r.z !== 0)) {
            this.setRotation(r);
        }
    }
    serialize() {
        return {
            x: this.origin.x,
            y: this.origin.y,
            z: this.origin.z,
            r: {
                x: this.r.x,
                y: this.r.y,
                z: this.r.z
            },
            w: this.w,
            h: this.h,
            d: this.d
        };
    }
    setRotation(r) {
        this.rotate(r.x, GVector3_1.Axis.X);
        this.rotate(r.y, GVector3_1.Axis.Y);
        this.rotate(r.z, GVector3_1.Axis.Z);
    }
    getNodes() {
        return this.nodes;
    }
    getNode(vertex) {
        let ret;
        switch (vertex) {
            case GBox3Vertex.RUF:
                ret = this.nodes[0];
                break;
            case GBox3Vertex.RDF:
                ret = this.nodes[1];
                break;
            case GBox3Vertex.LUF:
                ret = this.nodes[2];
                break;
            case GBox3Vertex.LDF:
                ret = this.nodes[3];
                break;
            case GBox3Vertex.RUB:
                ret = this.nodes[4];
                break;
            case GBox3Vertex.RDB:
                ret = this.nodes[5];
                break;
            case GBox3Vertex.LUB:
                ret = this.nodes[6];
                break;
            case GBox3Vertex.LDB:
                ret = this.nodes[7];
                break;
        }
        return new GVector3_1.GVector3(this.round(ret[0]), this.round(ret[1]), this.round(ret[2]));
    }
    move(x, y, z) {
        this.moveX(x);
        this.moveY(y);
        this.moveZ(z);
    }
    moveX(x) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i][0] += x;
        }
        this.origin.x += x;
    }
    moveY(y) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i][1] += y;
        }
        this.origin.y += y;
    }
    moveZ(z) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i][2] += z;
        }
        this.origin.z += z;
    }
    round(n) {
        return (Math.round((n + Number.EPSILON) * 100) / 100) + 0;
    }
    rotateOnPivot2(pivot, angle, axis) {
        let orig = this.origin.copy();
        this.move(0 - this.origin.x, 0 - this.origin.y, 0 - this.origin.z);
        this.rotate(angle, axis);
        orig.subtract(pivot);
        orig.rotate3D(angle, axis);
        //console.log('rotated pivot', orig)
        this.move(orig.x + pivot.x, orig.y + pivot.y, orig.z + pivot.z);
    }
    rotate(angle, axis) {
        let orig = this.origin.copy();
        this.move(0 - this.origin.x, 0 - this.origin.y, 0 - this.origin.z);
        switch (axis) {
            case GVector3_1.Axis.X:
                this.rotateX(angle);
                break;
            case GVector3_1.Axis.Y:
                this.rotateY(angle);
                break;
            case GVector3_1.Axis.Z:
                this.rotateZ(angle);
                break;
        }
        this.move(orig.x, orig.y, orig.z);
    }
    rotateZ(theta) {
        var sinTheta = Math.sin(theta * Math.PI / 180);
        var cosTheta = Math.cos(theta * Math.PI / 180);
        for (var n = 0; n < this.nodes.length; n++) {
            var node = this.nodes[n];
            var x = node[0];
            var y = node[1];
            node[0] = x * cosTheta - y * sinTheta;
            node[1] = y * cosTheta + x * sinTheta;
        }
        this.r.z += theta;
        this.r.z = this.capAngle(this.r.z);
    }
    rotateX(theta) {
        var sinTheta = Math.sin(theta * Math.PI / 180);
        var cosTheta = Math.cos(theta * Math.PI / 180);
        for (var n = 0; n < this.nodes.length; n++) {
            var node = this.nodes[n];
            var y = node[1];
            var z = node[2];
            node[1] = y * cosTheta - z * sinTheta;
            node[2] = z * cosTheta + y * sinTheta;
        }
        this.r.x += theta;
        this.r.x = this.capAngle(this.r.x);
    }
    capAngle(angle) {
        if (angle > 360) {
            return angle - 360;
        }
        if (angle < -360) {
            return 360 + angle;
        }
        return angle;
    }
    rotateY(theta) {
        var sinTheta = Math.sin(theta * Math.PI / 180);
        var cosTheta = Math.cos(theta * Math.PI / 180);
        for (var n = 0; n < this.nodes.length; n++) {
            var node = this.nodes[n];
            var x = node[0];
            var z = node[2];
            node[0] = x * cosTheta + z * sinTheta;
            node[2] = z * cosTheta - x * sinTheta;
        }
        this.r.y += theta;
        this.r.y = this.capAngle(this.r.y);
    }
    rotateOnPivot(pivot, angle, axis) {
        this.origin.add(pivot);
        this.origin.rotate3D(angle, axis);
        //this.rotation += rotation
        this.rotate(angle, axis);
    }
}
exports.GBox3 = GBox3;
