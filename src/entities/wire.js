import { viewport } from "../core/viewport";
import { Graphics } from "pixi.js";

export class Wire extends Graphics {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.drawWire();
    viewport.on("pointerMove", (event) => this.onPointerMove(event));
  }
    onPointerMove(event) {
      const { x, y } = event.global;
      const localPosition = viewport.toLocal({ x, y });
      console.log("Mouse Local Position:", localPosition.x, localPosition.y);
    }
    drawWire() {}
}
