import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class OrGate extends Gate {
    static type: PlaceableType = PlaceableType.OR;
    static assetName: string = "or";

    constructor(x: number, y: number) {
        super(x, y, OrGate.type);

        this.setUp(OrGate.assetName);
    }

    protected override getInputPoints(): Coordinate[] {
        return [
            { x: -25, y: -10 },
            { x: -25, y: 10 }
        ];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }
}