import { Assets, Sprite, Texture } from 'pixi.js';
import { Dimension } from '../types/IDimension';

const assetsPath = "assets/56x56/";

const manifest = {
    bundles: [
        {
            name: "base-textures",
            assets: {
                switchEmpty: "assets/switch-empty.svg",
                andGate: "assets/and.svg",
                NandGate: "assets/nand.svg",
                orGate: "assets/or.svg",
                norGate: "assets/nor.svg",
                xorGate: "assets/xor.svg",
                xnorGate: "assets/xnor.svg",
                notGate: "assets/not.svg",
                bufferGate: "assets/buffer.svg",
                rotate: "assets/rotate.svg"
            }
        }
    ]
}

export async function preloadAssets(): Promise<void> {
    await Assets.init({ manifest });
    await Assets.loadBundle("base-textures");
}

export async function loadTexture(assetName: string, assetPath: string = assetsPath): Promise<Texture> {
    const texturePath = assetPath + assetName + ".svg";
    const texture = await Assets.load(texturePath);

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