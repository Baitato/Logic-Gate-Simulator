import { Assets, Sprite, Texture } from 'pixi.js';
import { Dimension } from '../types/IDimension';

const assetsPath = "assets/56x56/";

export async function loadTexture(assetName: string, assetPath: string = assetsPath): Promise<Texture> {
    const texturePath = assetPath + assetName + ".svg";
    const texture = await Assets.load({ src: texturePath, data: { resolution: 4 } });

    return texture;
}

export async function loadSprite(assetName: string, dimensions: Dimension, assetPath: string = assetsPath): Promise<Sprite> {
    const sprite = new Sprite(await loadTexture(assetName, assetPath));

    sprite.anchor.set(0.5);
    sprite.width = dimensions.x;
    sprite.height = dimensions.y;
    sprite.eventMode = "static";
    sprite.cursor = "pointer";
    return sprite;
}