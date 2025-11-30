import { AssetName } from "../../enums/AssetName";
import { PlaceableType } from "../../enums/PlaceableType";
import { Coordinate } from "../../types/ICoordinate";
import { Gate } from "./Gate";

export class NotGate extends Gate {
    static type: PlaceableType = PlaceableType.NOT;
    static assetName: string = AssetName.NOT;

    constructor(x: number, y: number, rotation: number = 0, id?: number) {
        super(x, y, NotGate.type, rotation, id);
    }

    public override async setUp() {
        return super.setUp(NotGate.assetName);
    }

    public static getAssetName(): string {  
        return NotGate.assetName;
    }

    protected override getInputPoints(): Coordinate[] {
        return [{ x: -25, y: 0 }];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }
}