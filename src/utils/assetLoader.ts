import { Assets, Sprite, Texture } from 'pixi.js';
import { Dimension } from '../types/IDimension';

const assetsPath = "assets/56x56/";

const manifest = {
    bundles: [
        {
            name: "base-textures",
            assets: {
                switchEmpty: "assets/56x56/switch-empty.svg",
                andGate: "assets/56x56/and.svg",
                NandGate: "assets/56x56/nand.svg",
                orGate: "assets/56x56/or.svg",
                norGate: "assets/56x56/nor.svg",
                xorGate: "assets/56x56/xor.svg",
                xnorGate: "assets/56x56/xnor.svg",
                notGate: "assets/56x56/not.svg",
                bufferGate: "assets/56x56/buffer.svg",
                rotate: "assets/56x56/rotate.svg"
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