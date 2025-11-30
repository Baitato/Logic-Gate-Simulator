import { AssetName } from "../enums/AssetName";
import { PlaceableType } from "../enums/PlaceableType";
import { BaseTool } from "./BaseTool";


export class PlaceableTool extends BaseTool {
    asset: AssetName;
    type: PlaceableType;

    constructor(assetName: AssetName, type: PlaceableType) {
        super(assetName);
        this.asset = assetName;
        this.type = type;
    }
}