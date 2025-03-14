import { Container, Graphics } from "pixi.js";
import { viewport } from "../core/viewport";
import { Wire } from "./wire";

export class ConnectionPoint extends Container {
  constructor(type) {
    super();
    this.type = type;
    this.pointGraphics = null;
    this.isConnected = false;
    this.isHovered = false;
    this.isConnectionPoint = true;
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
    this.pointGraphics.isConnectionPointGraphic = true;

    this.pointGraphics.on("pointerover", this.onHoverStart.bind(this));
    this.pointGraphics.on("pointerout", this.onHoverEnd.bind(this));
    this.pointGraphics.on("pointerdown", this.onPointerDown.bind(this));

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
    new Wire(this.getViewportPosition());
    console.log("Connection point clicked:", this.getViewportPosition());
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

  setConnected(isConnected) {
    this.isConnected = isConnected;
    this.updateVisuals();
  }
}
