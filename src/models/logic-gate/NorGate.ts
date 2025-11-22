import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class NorGate extends Gate {
    static type: PlaceableType = PlaceableType.NOR;
    static assetName: string = "nor";

    constructor(x: number, y: number) {
        super(x, y, NorGate.type);

        this.setUp(NorGate.assetName);
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