// import { Sprite } from "pixi.js";
// import { LogicGate } from "./LogicGate";
// import { loadTexture } from "../utils/assetLoader";

// export class RotationHandler extends Sprite {
//     parentGate: LogicGate;

//     constructor(parentGate: LogicGate) {
//         super();
//         this.parentGate = parentGate;
//         this.setupRotationHandler();
//     }

//     async setupRotationHandler() {
//         this.texture = await loadTexture("rotate");

//         this.y = -(this.parentGate.sprite?.height ?? 0) / 2 - 10;
//         this.width = 10;
//         this.height = 10;
//         this.eventMode = "static";
//         this.cursor = "pointer";
//         this.zIndex = -10;
//         this.on("pointerdown", this.onRotationHandlerClick.bind(this));
//     }

//     onRotationHandlerClick() {
//     }
// }