import { GateType } from "../enums/GateType";
import { Dimension } from "../types/IDimension";
import { BaseTool } from "./BaseTool";

const gateIconDimensions: Dimension = { x: 50, y: 50 };

export class GateTool extends BaseTool {
    type: GateType;

    constructor(type: GateType) {
        super(type);
        this.type = type;

        this.width = gateIconDimensions.x
        this.height = gateIconDimensions.y;
        this.cursor = "pointer";
    }
}