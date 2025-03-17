import { viewport } from "../core/viewport";
import { Container, Graphics } from "pixi.js";

export class Wire extends Container {
  constructor(sourcePoint) {
    super();
    this.sourcePoint = sourcePoint;
    this.targetPoint = null;

    this.line = new Graphics();
    this.zIndex = -Infinity;
    this.addChild(this.line);

    const sourcePos = sourcePoint.getViewportPosition();
    this.x = sourcePos.x;
    this.y = sourcePos.y;

    this.onMove = (event) => this.onPointerMove(event);
    this.onClick = null;

    viewport.on("pointermove", this.onMove);
  }

  onPointerMove(event) {
    this.line.clear();

    const { x, y } = event.global;
    const worldPos = viewport.toWorld(x, y);

    const endX = worldPos.x - this.x;
    const endY = worldPos.y - this.y;

    this.line.moveTo(0, 0);
    this.line.lineTo(endX, endY);
    this.line.stroke({
      color: 0xffffff,
      width: 2,
    });

    if (this.onClick === null) {
      this.onClick = (event) => this.onClickEvent(event);
      viewport.on("clicked", this.onClick);
    }
  }

  onClickEvent(event) {
    let connectionPoint = event.event.target;

    while (connectionPoint && !connectionPoint.isConnectionPoint) {
      connectionPoint = connectionPoint.parent;
    }

    if (!connectionPoint || this.sourcePoint.type === connectionPoint.type) {
      this.destroy({ children: true, texture: true, baseTexture: true });
      this.cleanUp();

      return;
    }

    this.targetPoint = connectionPoint;
    this.updatePosition();

    this.sourcePoint.on("moved", this.updatePosition.bind(this));
    this.targetPoint.on("moved", this.updatePosition.bind(this));
    this.onClick = null;

    this.cleanUp();
  }

  cleanUp() {
    viewport.off("pointermove", this.onMove);
    viewport.off("clicked", this.onClick);
    this.onClick = null;
  }

  updatePosition() {
    const sourcePos = this.sourcePoint.getViewportPosition();
    this.x = sourcePos.x;
    this.y = sourcePos.y;

    if (this.targetPoint) {
      const targetPos = this.targetPoint.getViewportPosition();
      const endX = targetPos.x - this.x;
      const endY = targetPos.y - this.y;

      this.line.clear();
      this.line.moveTo(0, 0);
      this.line.lineTo(endX, endY);
      this.line.stroke({
        color: 0xffffff,
        width: 2,
      });
    }
  }
}
