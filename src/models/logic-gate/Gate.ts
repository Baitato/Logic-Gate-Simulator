import { Coordinate } from "../../types/ICoordinate";
import { Placeable } from "../Placeable";
import { PlaceableType } from '../../enums/PlaceableType';

export abstract class Gate extends Placeable {
    type: PlaceableType;

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];

    constructor(x: number, y: number, type: PlaceableType, assetName: string) {
        super(x, y, assetName);
        this.type = type;
    }

    public override exportAsString(offsetX: number = 0, offsetY: number = 0): string {
        return `${this.type},${this.x + offsetX},${this.y + offsetY},${this.rotation},${this.placeableId}`;
    }
}