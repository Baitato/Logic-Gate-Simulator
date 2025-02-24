import { Sprite, Assets } from "pixi.js";

export class SideMenuButton {
  constructor(texturePath) {
    this.loadTexture(texturePath);
    this.sprite = new Sprite();
    this.sprite.width = 50;
    this.sprite.height = 50;
    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";
  }

  async loadTexture(texturePath) {
    const texture = await Assets.load({ src: texturePath });
    this.sprite.texture = texture;
  }

  getSprite() {
    return this.sprite;
  }
}
