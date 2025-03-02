import { Assets, Sprite } from "pixi.js";

const assetsPath = "assets/56x56/";

export async function loadTexture(gate) {
  const texturePath = assetsPath + gate + ".svg";
  const texture = await Assets.load({ src: texturePath });

  return texture;
}

export async function loadSprite(gate, size) {
  const sprite = new Sprite(await loadTexture(gate));

  sprite.width = size;
  sprite.height = size;
  sprite.eventMode = "static";
  sprite.cursor = "pointer";
  sprite.gate = gate;
  return sprite;
}
