import { AssetName } from "../../enums/AssetName";
import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class XorGate extends Gate {
    static type: PlaceableType = PlaceableType.XOR;
    static assetName: string = AssetName.XOR;

    constructor(x: number, y: number, rotation: number = 0, id?: number) {
        super(x, y, XorGate.type, rotation, id);
    }

    public override async setUp() {
        return super.setUp(XorGate.assetName);
    }

    public static getAssetName(): string {
        return XorGate.assetName;
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