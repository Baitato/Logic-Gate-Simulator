import { Assets } from "pixi.js";
import { AssetMap } from "./constants";

export async function preloadAssets(): Promise<void> {
    Assets.addBundle('preload',
        Object.values(AssetMap).map(a => ({
            alias: a.name,
            src: a.path,
            data: { resolution: 4 }
        }))
    );
    await Assets.loadBundle('preload');
}