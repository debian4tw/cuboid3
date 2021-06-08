"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GBox4 = void 0;
const GVector3_1 = require("../math/GVector3");
const GBox3_1 = require("./GBox3");
class GBox4 {
    constructor(origin, w, h, d, r = null) {
        this.origin = origin;
        let { x, y, z } = origin.getPosition();
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
            x: this.origin.getPosition().x,
            y: this.origin.getPosition().y,
            z: this.origin.getPosition().z,
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
            case GBox3_1.GBox3Vertex.RUF:
                ret = this.nodes[0];
                break;
            case GBox3_1.GBox3Vertex.RDF:
                ret = this.nodes[1];
                break;
            case GBox3_1.GBox3Vertex.LUF:
                ret = this.nodes[2];
                break;
            case GBox3_1.GBox3Vertex.LDF:
                ret = this.nodes[3];
                break;
            case GBox3_1.GBox3Vertex.RUB:
                ret = this.nodes[4];
                break;
            case GBox3_1.GBox3Vertex.RDB:
                ret = this.nodes[5];
                break;
            case GBox3_1.GBox3Vertex.LUB:
                ret = this.nodes[6];
                break;
            case GBox3_1.GBox3Vertex.LDB:
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
    moveNodes(x, y, z) {
        this.moveX(x, false);
        this.moveY(y, false);
        this.moveZ(z, false);
    }
    moveX(x, moveOrigin = true) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i][0] += x;
        }
        //this.origin.x += x
        if (moveOrigin) {
            this.origin.setPosition(this.origin.getPosition().x + x, this.origin.getPosition().y, this.origin.getPosition().z);
        }
    }
    moveY(y, moveOrigin = false) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i][1] += y;
        }
        //this.origin.y +=y
        if (moveOrigin) {
            this.origin.setPosition(this.origin.getPosition().x, this.origin.getPosition().y + y, this.origin.getPosition().z);
        }
    }
    moveZ(z, moveOrigin = false) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i][2] += z;
        }
        //this.origin.z +=z
        if (moveOrigin) {
            this.origin.setPosition(this.origin.getPosition().x, this.origin.getPosition().y, this.origin.getPosition().z + z);
        }
    }
    round(n) {
        return (Math.round((n + Number.EPSILON) * 100) / 100) + 0;
    }
    /*public rotateOnPivot2(pivot: GVector3, angle: number, axis: Axis) {
      let orig = this.origin.copy()
      this.move(0-this.origin.x,0-this.origin.y,0-this.origin.z)
      this.rotate(angle, axis)
      orig.subtract(pivot)
      orig.rotate3D(angle, axis)
      //console.log('rotated pivot', orig)
      this.move(orig.x+pivot.x, orig.y+pivot.y, orig.z+pivot.z)
    }*/
    rotate(angle, axis) {
        let orig = this.origin.copy();
        this.move(0 - this.origin.getPosition().x, 0 - this.origin.getPosition().y, 0 - this.origin.getPosition().z);
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
        this.move(orig.getPosition().x, orig.getPosition().y, orig.getPosition().z);
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
            return 360 - angle;
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
        //this.origin.add(pivot)
        //this.origin.rotate3D(angle, axis)
        //this.rotation += rotation
        this.rotate(angle, axis);
    }
    rotateOnPivot2(pivot, angle, axis) {
    }
}
exports.GBox4 = GBox4;
