import { AssetName } from "../../enums/AssetName";
import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class NorGate extends Gate {
    static type: PlaceableType = PlaceableType.NOR;
    static assetName: string = AssetName.NOR;

    constructor(x: number, y: number, rotation: number = 0, id?: number) {
        super(x, y, NorGate.type, rotation, id);
    }

    public override async setUp() {
        return super.setUp(NorGate.assetName);
    }

    public static getAssetName(): string {
        return NorGate.assetName;
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