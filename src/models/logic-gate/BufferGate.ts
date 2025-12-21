import { AssetName } from "../../enums/AssetName";
import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class BufferGate extends Gate {
    static type: PlaceableType = PlaceableType.BUFFER;
    static assetName: string = AssetName.BUFFER;

    constructor(x: number, y: number) {
        super(x, y, BufferGate.type);
    }

    public override setUp() {
        return super.setUp(BufferGate.assetName);
    }

    public static getAssetName(): string {
        return BufferGate.assetName;
    }

    protected override getInputPoints(): Coordinate[] {
        return [{ x: -25, y: 0 }];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }
}