import { AssetName } from "../../enums/AssetName";
import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class AndGate extends Gate {
    static type: PlaceableType = PlaceableType.AND;
    static assetName: string = AssetName.AND;

    constructor(x: number, y: number, rotation: number = 0) {
        super(x, y, AndGate.type, rotation);
    }

    public override async setUp() {
        return super.setUp(AndGate.assetName);
    }

    public static getAssetName(): string {
        return AndGate.assetName;
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