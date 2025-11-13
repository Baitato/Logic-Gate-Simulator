import { PlaceableType } from "../enums/PlaceableType";
import { Dimension } from "../types/IDimension";
import { BaseTool } from "./BaseTool";

const iconDimensions: Dimension = { x: 50, y: 50 };

export class PlaceableTool extends BaseTool {
    type: PlaceableType;

    constructor(type: PlaceableType) {
        super(type);
        this.type = type;

        this.width = iconDimensions.x
        this.height = iconDimensions.y;
        this.cursor = "pointer";
    }
}