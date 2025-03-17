import { Container, Graphics } from "pixi.js";
import { viewport } from "../core/viewport";
import { Wire } from "./wire";

export class ConnectionPoint extends Container {
  constructor(type) {
    super();
    this.type = type;
    this.pointGraphics = null;
    this.isConnectionPoint = true;
    this.isHovered = false;
    this.pointerDownCallback = (event) => {
      this.onPointerDown(event);
    };
    this.createPoint();
  }

  createPoint() {
    this.pointGraphics = new Graphics();

    this.pointGraphics.clear();

    this.pointGraphics.fill({ color: 0xffffff });
    this.pointGraphics.circle(0, 0, 3);
    this.pointGraphics.fill();

    this.pointGraphics.eventMode = "static";
    this.pointGraphics.cursor = "pointer";

    this.pointGraphics.on("pointerover", this.onHoverStart.bind(this));
    this.pointGraphics.on("pointerout", this.onHoverEnd.bind(this));
    this.pointGraphics.on("pointerdown", this.pointerDownCallback);

    this.addChild(this.pointGraphics);
  }

  onHoverStart() {
    this.isHovered = true;
    this.updateVisuals();
  }

  onHoverEnd() {
    this.isHovered = false;
    this.updateVisuals();
  }

  onPointerDown(event) {
    const wire = new Wire(this);
    viewport.addChild(wire);
  }

  getViewportPosition() {
    return viewport.toLocal(this.getGlobalPosition({ x: this.x, y: this.y }));
  }

  updateVisuals() {
    this.pointGraphics.clear();

    this.pointGraphics.fill({ color: 0xffffff });
    this.pointGraphics.circle(0, 0, this.isHovered ? 4.5 : 3);
    this.pointGraphics.fill();
  }
}
