import { Assets, Sprite, Texture } from 'pixi.js';
import { Dimension } from '../types/IDimension';
import { AssetName } from '../enums/AssetName';

const assetsPath = "assets/56x56/";

const textureCache = new Map<string, Texture>();
let connectionPointNormalTexture: Texture | null = null;
let connectionPointHoverTexture: Texture | null = null;

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

    // Create cached textures for connection points
    createConnectionPointTextures();
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

function createConnectionPointTextures(): void {
    // Create normal state texture (radius 3)
    connectionPointNormalTexture = createCircleTexture(3);

    // Create hover state texture (radius 4.5)
    connectionPointHoverTexture = createCircleTexture(4.5);
}

function createCircleTexture(radius: number): Texture {
    const size = Math.ceil(radius * 2 + 2);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
    ctx.fill();

    return Texture.from(canvas);
}

export function getConnectionPointTexture(hover: boolean): Texture {
    const texture = hover ? connectionPointHoverTexture : connectionPointNormalTexture;
    if (!texture) {
        throw new Error('Connection point textures not initialized. Call preloadAllAssets() first.');
    }
    return texture;
}
