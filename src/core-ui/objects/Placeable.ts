import { Assets, Size, Sprite } from "pixi.js";
import { Asset } from "../../type/Asset";

export class Placeable extends Sprite {
    constructor(asset: Asset, size: Size, position: { x: number, y: number }) {
        super();
        this.texture = Assets.get(asset.name);
        this.width = size.width;
        this.height = size.height
        this.position.set(position.x, position.y);
    }
}
