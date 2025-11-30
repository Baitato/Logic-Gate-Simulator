import { AssetName } from "../enums/AssetName";
import { BaseTool } from "./BaseTool";

export abstract class MiscTool extends BaseTool {
    asset: AssetName;

    constructor(assetName: AssetName) {
        super(assetName);

        this.asset = assetName;
    }

    public abstract onClick(): void;
}