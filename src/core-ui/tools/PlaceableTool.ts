import { BaseTool } from "./BaseTool";
import { Asset } from "../../type/Asset";
import { AssetMap } from "../../util/constants";
import { Size } from "pixi.js";

const PLACEABLE_ASSETS: Set<Asset> = new Set([
    AssetMap.NOT,
    AssetMap.AND,
    AssetMap.NAND,
    AssetMap.OR,
    AssetMap.NOR,
    AssetMap.XOR,
    AssetMap.XNOR,
    AssetMap.BUFFER,
])

export class PlaceableTool extends BaseTool {
    constructor(asset: Asset, size: Size) { 
        super(asset, size);
    }

    static supports(asset: Asset) {
        return PLACEABLE_ASSETS.has(asset);
    }
}