import { AssetName } from "../../enums/AssetName";
import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class NandGate extends Gate {
    static type: PlaceableType = PlaceableType.NAND;
    static assetName: string = AssetName.NAND;

    constructor(x: number, y: number, rotation: number = 0) {
        super(x, y, NandGate.type, rotation);
    }

    public override async setUp() {
        return super.setUp(NandGate.assetName);
    }

    public static getAssetName(): string {
        return NandGate.assetName;
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