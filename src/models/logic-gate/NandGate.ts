import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class NandGate extends Gate {
    static assetName: string = "nand";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(NandGate.assetName);
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