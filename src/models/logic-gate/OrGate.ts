import { AssetName } from "../../enums/AssetName";
import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class OrGate extends Gate {
    static type: PlaceableType = PlaceableType.OR;
    static assetName: string = AssetName.OR;

    constructor(x: number, y: number) {
        super(x, y, OrGate.type);
    }

    public override setUp() {
        return super.setUp(OrGate.assetName);
    }

    public static getAssetName(): string {
        return OrGate.assetName;
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