import { Assets, Sprite } from "pixi.js";

const assetsPath = "assets/56x56/";

export async function loadTexture(asset) {
  const texturePath = assetsPath + asset + ".svg";
  const texture = await Assets.load({ src: texturePath });

  return texture;
}

export async function loadSprite(asset, size) {
  const sprite = new Sprite(await loadTexture(asset));

  sprite.width = size;
  sprite.height = size;
  sprite.eventMode = "static";
  sprite.cursor = "pointer";
  sprite.gate = asset;
  return sprite;
}
