import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class XorGate extends Gate {
    static assetName: string = "xor";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(XorGate.assetName);
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