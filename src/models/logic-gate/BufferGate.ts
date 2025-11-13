import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class BufferGate extends Gate {
    static type: string = PlaceableType.BUFFER;
    static assetName: string = "buffer";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUp(BufferGate.assetName);
    }

    protected override getInputPoints(): Coordinate[] {
        return [{ x: -25, y: 0 }];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }
}