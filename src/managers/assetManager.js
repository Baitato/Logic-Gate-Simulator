import { Assets, Sprite } from "pixi.js";

const assetsPath = "assets/56x56/";

export async function loadTexture(assetName) {
  const texturePath = assetsPath + assetName + ".svg";
  const texture = await Assets.load({ src: texturePath });

  return texture;
}

export async function loadSprite(assetName, size) {
  const sprite = new Sprite(await loadTexture(assetName));

  sprite.width = size;
  sprite.height = size;
  sprite.eventMode = "static";
  sprite.cursor = "pointer";
  sprite.gate = assetName;
  return sprite;
}
