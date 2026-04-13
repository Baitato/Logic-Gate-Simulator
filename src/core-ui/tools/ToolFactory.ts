import { Size } from "pixi.js";
import { Asset } from "../../type/Asset";
import { PlaceableTool } from "./PlaceableTool";
import { BaseTool } from "./BaseTool";

export class ToolFactory {
    constructor() {}

    static getToolList() {
        return [
            PlaceableTool,
        ];
    }

    static createTool(asset: Asset, size: Size): BaseTool {
        for (const toolClass of ToolFactory.getToolList())
            if (toolClass.supports(asset))
                return new toolClass(asset, size);


        throw new Error(`No tool found for asset: ${asset.name}`);
    }
}