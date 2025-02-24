import { Sprite, Assets } from "pixi.js";
import { app } from "../app";
const assetsPath = "assets/56x56/";

export class SideMenuButton {
  constructor(sideMenuElement) {
    this.element = sideMenuElement;
    this.loadTexture(assetsPath + this.element + ".svg");
    this.sprite = new Sprite();
    this.sprite.width = 50;
    this.sprite.height = 50;
    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";

    this.sprite.on("pointerdown", this.onSelect.bind(this)); // Click to select
    // this.sprite.on("pointerdown", this.onDragStart.bind(this)); // Drag to move
    // this.app.stage.on("pointerdown", this.onPlace.bind(this)); // Click to place
  }

  onSelect(event) {
    if (event.target !== this.sprite) return;

    this.selectedSprite = new Sprite(
      this.loadTexture(assetsPath + this.element + ".svg")
    );

    this.selectedSprite.x = event.global.x;
    this.selectedSprite.y = event.global.y;

    this.selectedSprite.anchor.set(0.5);
    this.selectedSprite.alpha = 0.6; // Semi-transparent preview
    this.selectedSprite.eventMode = "none"; // Avoid conflicts

    console.log("Placing at:", this.selectedSprite.x, this.selectedSprite.y);

    app.stage.addChild(this.selectedSprite);
  }

  async loadTexture(texturePath) {
    const texture = await Assets.load({ src: texturePath });
    this.sprite.texture = texture;
  }

  getElement() {
    return this.element;
  }

  getSprite() {
    return this.sprite;
  }
}
