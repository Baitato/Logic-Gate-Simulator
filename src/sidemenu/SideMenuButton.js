import { Sprite, Assets } from "pixi.js";
import { app } from "../app";
import { viewport } from "../viewportModule";

const assetsPath = "assets/56x56/";
const gridSize = 50;
var current;

export class SideMenuButton {
  constructor(sideMenuElement) {
    this.element = sideMenuElement;
    this.sprite = new Sprite();
    this.loadTexture(assetsPath + this.element + ".svg", this.sprite);
    this.sprite.width = 50;
    this.sprite.height = 50;
    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";

    this.sprite.on("pointerdown", this.onSelect.bind(this));
  }

  moveRelativeToMouseOnViewport(event) {
    const worldPos = viewport.toWorld(event.global);

    this.selectedSprite.x =
      Math.floor(worldPos.x / gridSize) * gridSize + gridSize / 2;
    this.selectedSprite.y =
      Math.floor(worldPos.y / gridSize) * gridSize + gridSize / 2;
  }

  onSelect(event) {
    if (event.target !== this.sprite) return;

    if (current != null) {
      viewport.off("pointermove", current.onMove, current);
      viewport.off("pointerdown", current.onPlace, current);

      viewport.removeChild(current);
      current.destroy({ children: true });
      current = null;
    }

    this.selectedSprite = new Sprite();
    current = this.selectedSprite;
    this.loadTexture(assetsPath + this.element + ".svg", this.selectedSprite);

    const worldPos = viewport.toWorld(event.global);

    this.selectedSprite.x = worldPos.x;
    this.selectedSprite.y = worldPos.y;

    this.selectedSprite.anchor.set(0.5);
    this.selectedSprite.alpha = 0.6;
    this.selectedSprite.eventMode = "dynamic";
    this.selectedSprite.cursor = "pointer";

    this.selectedSprite.width = 50;
    this.selectedSprite.height = 50;

    viewport.addChild(this.selectedSprite);

    viewport.on("pointermove", this.onMove, this);
  }

  onMove(event) {
    if (!this.selectedSprite) return;
    this.moveRelativeToMouseOnViewport(event);
    viewport.on("pointerdown", this.onPlace.bind(this));
  }

  onPlace(event) {
    if (!this.selectedSprite) return;

    this.moveRelativeToMouseOnViewport(event);

    this.selectedSprite.alpha = 1;

    viewport.off("pointermove", this.onMove, this);
    viewport.off("pointerdown", this.onPlace, this);
    this.selectedSprite = null;
    current = null;
  }

  async loadTexture(texturePath, sprite) {
    const texture = await Assets.load({ src: texturePath });
    sprite.texture = texture;
  }

  cleanUpOnIconSwitch() {}

  getElement() {
    return this.element;
  }

  getSprite() {
    return this.sprite;
  }
}
