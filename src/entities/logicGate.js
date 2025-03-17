import { Container, Sprite } from "pixi.js";
import { loadTexture } from "../managers/assetManager";
import { ConnectionManager } from "../managers/connectionManager";
import { RotationHandler } from "./rotationHandler";
import { getKey } from "../managers/objectManager";

export class LogicGate extends Container {
  static selectedGate = null;

  constructor(type) {
    super();
    this.type = type;
    this.selected = false;
    this.gateSprite = null;

    this.connectionManager = new ConnectionManager(this);
    this.rotationHandler = new RotationHandler(this);

    this.setupGate();
  }

  async setupGate() {
    const texture = await loadTexture(this.type);
    this.gateSprite = new Sprite(texture);
    this.gateSprite.anchor.set(0.5);
    this.gateSprite.width = 50;
    this.gateSprite.height = 50;
    this.gateSprite.eventMode = "static";
    this.gateSprite.cursor = "pointer";
    this.gateSprite.on("pointerdown", this.onGateClick.bind(this));
    this.addChild(this.gateSprite);

    this.connectionManager.createConnectionPoints();
  }

  onGateClick() {
    if (LogicGate.selectedGate && LogicGate.selectedGate !== this) {
      LogicGate.selectedGate.deselect();
    }

    this.selected = !this.selected;
    this.updateSelectionUI();

    if (this.selected) {
      LogicGate.selectedGate = this;
    } else {
      LogicGate.selectedGate = null;
    }
  }

  deselect() {
    this.selected = false;
    this.updateSelectionUI();
  }

  async updateSelectionUI() {
    if (this.selected) {
      await this.rotationHandler.createRotationHandle();
    } else {
      this.rotationHandler.removeRotationHandle();
    }
  }

  initialize(x, y) {
    this.x = x;
    this.y = y;
    this.key = getKey(x, y);
  }

  get connectionPoints() {
    return this.connectionManager.connectionPoints;
  }
}
