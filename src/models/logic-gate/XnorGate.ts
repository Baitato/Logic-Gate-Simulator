import { AssetName } from "../../enums/AssetName";
import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class XnorGate extends Gate {
    static type: PlaceableType = PlaceableType.XNOR;
    static assetName: string = AssetName.XNOR;

    constructor(x: number, y: number, rotation: number = 0) {
        super(x, y, XnorGate.type, rotation);
    }

    public override async setUp() {
        return super.setUp(XnorGate.assetName);
    }

    public static getAssetName(): string {
        return XnorGate.assetName;
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