"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionSAT4 = void 0;
const GVector3_1 = require("../math/GVector3");
const GBox3_1 = require("../shape/GBox3");
class CollisionSAT4 {
    static rectanglesCollideSAT(rect1, rect2) {
        return CollisionSAT4.checkRectangleOverlapSat(rect1, rect2) &&
            CollisionSAT4.checkRectangleOverlapSat(rect2, rect1);
    }
    static checkRectangleOverlapSat(rect1, rect2) {
        let axisProy = [
            new GVector3_1.GVector3(rect1.getNode(GBox3_1.GBox3Vertex.LDB).z - rect1.getNode(GBox3_1.GBox3Vertex.LDF).z, rect1.getNode(GBox3_1.GBox3Vertex.LDB).y - rect1.getNode(GBox3_1.GBox3Vertex.LDF).y, rect1.getNode(GBox3_1.GBox3Vertex.LDB).x - rect1.getNode(GBox3_1.GBox3Vertex.LDF).x),
            new GVector3_1.GVector3(rect1.getNode(GBox3_1.GBox3Vertex.LUF).z - rect1.getNode(GBox3_1.GBox3Vertex.LDF).z, rect1.getNode(GBox3_1.GBox3Vertex.LUF).y - rect1.getNode(GBox3_1.GBox3Vertex.LDF).y, rect1.getNode(GBox3_1.GBox3Vertex.LUF).x - rect1.getNode(GBox3_1.GBox3Vertex.LDF).x),
            new GVector3_1.GVector3(rect1.getNode(GBox3_1.GBox3Vertex.RDF).z - rect1.getNode(GBox3_1.GBox3Vertex.LDF).z, rect1.getNode(GBox3_1.GBox3Vertex.RDF).y - rect1.getNode(GBox3_1.GBox3Vertex.LDF).y, rect1.getNode(GBox3_1.GBox3Vertex.RDF).x - rect1.getNode(GBox3_1.GBox3Vertex.LDF).x),
        ];
        for (let i = 0; i < axisProy.length; i++) {
            let min_r1 = Infinity, max_r1 = -Infinity;
            rect1.getNodes().forEach((v) => {
                let vec = new GVector3_1.GVector3(v[0], v[1], v[2]);
                let proyected = vec.dotProduct(axisProy[i]);
                min_r1 = Math.min(min_r1, proyected);
                max_r1 = Math.max(max_r1, proyected);
            });
            let min_r2 = Infinity, max_r2 = -Infinity;
            rect2.getNodes().forEach((v) => {
                let vec = new GVector3_1.GVector3(v[0], v[1], v[2]);
                let proyected = vec.dotProduct(axisProy[i]);
                min_r2 = Math.min(min_r2, proyected);
                max_r2 = Math.max(max_r2, proyected);
            });
            //console.log('MinMax', min_r1,max_r1, min_r2, max_r2)
            if (!(max_r2 >= min_r1 && max_r1 >= min_r2)) {
                return false;
            }
        }
        return true;
    }
}
exports.CollisionSAT4 = CollisionSAT4;
