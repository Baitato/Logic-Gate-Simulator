import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class NorGate extends Gate {
    static assetName: string = "nor";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(NorGate.assetName);
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