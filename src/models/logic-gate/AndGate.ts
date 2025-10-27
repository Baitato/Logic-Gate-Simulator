import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class AndGate extends Gate {
    static assetName: string = "and";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(AndGate.assetName);
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