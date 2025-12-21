import { Assets, Sprite, Texture } from 'pixi.js';
import { Dimension } from '../types/IDimension';
import { AssetName } from '../enums/AssetName';

const assetsPath = "assets/56x56/";

const textureCache = new Map<string, Texture>();

export async function preloadAllAssets(onProgress: (current: number, total: number, asset: string) => void): Promise<void> {
    const assetNames = getAssetNames();
    const allAssets = [...assetNames];

    for (let i = 0; i < allAssets.length; i++) {
        const assetName = allAssets[i];
        const texturePath = assetsPath + assetName + ".svg";
        const texture = await Assets.load({ src: texturePath, data: { resolution: 4 } });
        textureCache.set(assetName, texture);
        onProgress(i + 1, allAssets.length, assetName);
    }
}

export function getAssetNames(): string[] {
    const assetNames = Object.values(AssetName) as string[];
    return assetNames;
}

export function getPreloadedTexture(assetName: string): Texture {
    const texture = textureCache.get(assetName);
    if (!texture) {
        throw new Error(`Texture "${assetName}" not found in cache. Did you call preloadAllAssets()?`);
    }
    return texture;
}

export function createSprite(assetName: string, dimensions: Dimension): Sprite {
    const sprite = new Sprite(getPreloadedTexture(assetName));

    sprite.anchor.set(0.5);
    sprite.width = dimensions.x;
    sprite.height = dimensions.y;
    sprite.eventMode = "static";
    sprite.cursor = "pointer";
    return sprite;
}
