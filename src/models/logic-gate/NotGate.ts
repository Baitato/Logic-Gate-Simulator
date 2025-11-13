import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class NotGate extends Gate {
    static type: string = PlaceableType.NOT;
    static assetName: string = "not";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUp(NotGate.assetName);
    }

    protected override getInputPoints(): Coordinate[] {
        return [{ x: -25, y: 0 }];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }
}