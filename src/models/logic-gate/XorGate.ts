import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class XorGate extends Gate {
    static type: PlaceableType = PlaceableType.XOR;
    static assetName: string = "xor";

    constructor(x: number, y: number) {
        super(x, y, XorGate.type);

        this.setUp(XorGate.assetName);
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