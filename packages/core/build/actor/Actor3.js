"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor3 = void 0;
const uuid_1 = require("uuid");
const g_physics_1 = require("@cuboid3/g-physics");
const g_physics_2 = require("@cuboid3/g-physics");
class Actor3 {
    constructor(box, id = null) {
        this.name = 'Actor3';
        this.label = 'base-actor';
        // @todo: move to combatActor
        this.hitPoints = 15;
        this.invisible = false;
        this.wireframe = false;
        this.box = box;
        this.id = id || uuid_1.v4();
        this.shape = g_physics_1.Shape.Box;
        this.isActive = 1;
        this.color = 'white';
        this.invisible = false;
        this.previousPos = new g_physics_2.GVector3(box.origin.x, box.origin.y, box.origin.z);
        this.associatedActors = new Map();
        this.assocLabel = 'Actor';
        this.lastState = {};
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
    setz(val) {
        this.box.origin.z = val;
    }
    setx(val) {
        this.box.origin.x = val;
    }
    sety(val) {
        this.box.origin.y = val;
    }
    setr(val) {
        this.box.r = val;
    }
    setry(val) {
        this.box.r.y = val;
    }
    getComponent(componentName) {
        var _a;
        return (_a = this.components) === null || _a === void 0 ? void 0 : _a.get(componentName);
    }
    addComponent(componentName, component) {
        if (typeof this.components === "undefined") {
            this.components = new Map();
        }
        if (componentName && component) {
            this.components.set(componentName, component);
        }
    }
    setUsername(username) {
        this.username = username;
    }
    getPreviousPos() {
        return this.previousPos;
    }
    setPreviousPos(vec) {
        this.previousPos.set(vec.x, vec.y, vec.z);
    }
    setAssociatedActor(associationLabel, actor) {
        //console.log(actor);
        if (typeof actor === "undefined") {
            return;
        }
        if (this.associatedActors.get(associationLabel) !== undefined) {
            return;
        }
        //console.log('setting associated actor', actor.name, actor.label)
        this.associatedActors.set(associationLabel, actor);
        // set inverse association too
        //console.log('set inverse assoc', this.assocLabel)
        actor.setAssociatedActor(this.assocLabel, this);
    }
    getAssociatedActors() {
        return this.associatedActors;
    }
    getAssociatedActor(associationLabel) {
        return this.associatedActors.get(associationLabel);
    }
    getClientActorType() {
        return this.clientActorType;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getColor() {
        return this.color;
    }
    getCoordsAndDimensions() {
        //console.log('trying to get coords', this.box)
        return {
            x: this.box.origin.x,
            y: this.box.origin.y,
            z: this.box.origin.z,
            w: this.box.w,
            h: this.box.h,
            d: this.box.d
        };
    }
    getState() {
        return {};
    }
    setState(state) {
    }
    update() {
    }
    setOrientation(orientation) {
    }
    setLabel(label) {
        this.label = label;
    }
    setPositionHeight(targetHeight) {
        // delta = targetHeight - sourceHeight
        this.box.moveY(targetHeight - this.box.origin.y);
    }
    getLabel() {
        return this.label;
    }
    getX() {
        return this.box.origin.x;
    }
    getY() {
        return this.box.origin.y;
    }
    getZ() {
        return this.box.origin.z;
    }
    getW() {
        return this.box.w;
    }
    getH() {
        return this.box.h;
    }
    getD() {
        return this.box.d;
    }
    getR() {
        return this.box.r;
    }
    setZ(z) {
        this.box.origin.z = z;
    }
    isWithinMapLimits(GameOpts) {
        return (this.box.origin.x < GameOpts.maxX && this.box.origin.x > GameOpts.minX) &&
            (this.box.origin.z < GameOpts.maxZ && this.box.origin.z > GameOpts.minZ);
    }
    restoreLastPosition() {
        this.box.moveX(this.previousPos.x - this.box.origin.x);
        this.box.moveZ(this.previousPos.z - this.box.origin.z);
    }
}
exports.Actor3 = Actor3;
