import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class XnorGate extends Gate {
    static assetName: string = "xnor";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(XnorGate.assetName);
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