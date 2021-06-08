"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseSensitivity = void 0;
const react_1 = __importStar(require("react"));
const core_1 = require("@cubic-eng/core");
exports.MouseSensitivity = () => {
    const [sensitivity, setSensitivity] = react_1.useState(1);
    const requestSetCameraParams = (sensi) => {
        if (typeof sensitivity !== "undefined") {
            setSensitivity(parseFloat(sensi));
        }
        core_1.EventHandler.publish('client:setMouseSensitivity', sensitivity);
    };
    return (react_1.default.createElement("div", { className: "mouseSensitivity" },
        react_1.default.createElement("p", null,
            react_1.default.createElement("b", null, "Mouse")),
        react_1.default.createElement("div", { className: "slidecontainer" },
            "Sensitivity: ",
            sensitivity,
            react_1.default.createElement("input", { onChange: (e) => { requestSetCameraParams(e.target.value); }, type: "range", min: "0.1", max: "2", defaultValue: "1", step: "0.1", value: sensitivity, id: "myRange" }))));
};
