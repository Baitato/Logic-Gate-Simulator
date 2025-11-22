import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class AndGate extends Gate {
    static type: PlaceableType = PlaceableType.AND;
    static assetName: string = "and";

    constructor(x: number, y: number) {
        super(x, y, AndGate.type);

        this.setUp(AndGate.assetName);
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