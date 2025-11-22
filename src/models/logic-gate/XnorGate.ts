import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class XnorGate extends Gate {
    static type: PlaceableType = PlaceableType.XNOR;
    static assetName: string = "xnor";

    constructor(x: number, y: number) {
        super(x, y, XnorGate.type);

        this.setUp(XnorGate.assetName);
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