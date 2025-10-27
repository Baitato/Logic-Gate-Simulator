import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class NotGate extends Gate {
    static assetName: string = "not";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(NotGate.assetName);
    }

    protected override getInputPoints(): Coordinate[] {
        return [{ x: -25, y: 0 }];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }
}