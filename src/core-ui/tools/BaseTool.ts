import { Assets, Size, Sprite } from "pixi.js";
import { Asset } from "../../type/Asset";

export abstract class BaseTool extends Sprite {

    constructor(asset: Asset, size: Size) {
        super();

        this.texture = Assets.get(asset.name);
        this.setSize(size);
    }
}