"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
const uuid_1 = require("uuid");
const g_physics_1 = require("@cubic-eng/g-physics");
const ClientActorType_1 = require("./ClientActorType");
class Actor {
    constructor(x, y, id = null, z = 0) {
        this.name = 'Actor';
        this.label = 'base-actor';
        this.id = id || uuid_1.v4();
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = 100;
        this.h = 100;
        this.d = 50;
        this.r = { x: 0, y: 0, z: 0 };
        this.clientActorType = ClientActorType_1.ClientActorType.ClientSingleActor;
        this.isActive = 1;
        this.multiple = false;
        this.shape = g_physics_1.Shape.Box;
        this.wireframe = false;
        this.invisible = false;
        this.createdAt = Date.now();
        this.associatedActors = new Map();
        this.lastState = {};
    }
    // adding for compatibility with actor3 as of now it has no effect
    setPositionHeight(targetHeight) {
        //
    }
    setLastState(state) {
        this.lastState = state;
    }
    getLastState() {
        return this.lastState;
    }
    setProp(prop, value) {
        if (typeof this['set' + prop] !== "undefined") {
            this['set' + prop](value);
        }
        else {
            this[prop] = value;
        }
    }
    setProps(obj) {
        Object.keys(obj).forEach((key) => {
            this.setProp(key, obj[key]);
        });
    }
    getClientActorType() {
        // console.log("clientActorType", this.name, this.clientActorType)
        return this.clientActorType;
    }
    getAssociatedActors() {
        return this.associatedActors;
    }
    getAssociatedActor(associationLabel) {
        return this.associatedActors.get(associationLabel);
    }
    setAssociatedActor(associationLabel, actor) {
        this.associatedActors.set(associationLabel, actor);
    }
    setColor(color) {
        this.color = color;
    }
    setOrientation(orientation) {
        this.orientation = orientation;
    }
    getColor() {
        return this.color;
    }
    getState() {
        const state = { id: this.id, name: this.name, x: this.x, y: this.y };
        return state;
    }
    update() {
        //
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    setState(state) {
        //
    }
    setLabel(label) {
        this.label = label;
    }
    getLabel() {
        return this.label;
    }
    getX() {
        return this.x;
    }
    getY() {
        // console.log('getY', this.y);
        return this.y;
    }
    getZ() {
        return this.z;
    }
    getW() {
        return this.w;
    }
    getH() {
        return this.h;
    }
    getD() {
        return this.d;
    }
    getR() {
        return this.r;
    }
    setZ(z) {
        this.z = z;
    }
    getCoordsAndDimensions() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            w: this.w,
            h: this.h,
            d: this.d
        };
    }
    getIndexCoordsAndDimensions(i) {
        return this.getCoordsAndDimensions();
    }
    setUsername(username) {
        this.username = username;
    }
}
exports.Actor = Actor;
