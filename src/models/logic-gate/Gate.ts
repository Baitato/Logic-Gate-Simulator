import { Coordinate } from "../../types/ICoordinate";
import { ConnectionPoint } from "../ConnectionPoint";
import { Placeable } from "../Placeable";
import { PlaceableType } from '../../enums/PlaceableType';
import { placeableState } from "../../core/instances";

export abstract class Gate extends Placeable {
    outputPoints: ConnectionPoint[] = [];
    inputPoints: ConnectionPoint[] = [];
    type: PlaceableType;

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];

    constructor(x: number, y: number, type: PlaceableType, rotation: number = 0) {
        super(x, y, rotation);

        this.type = type;
        this.on("pointerdown", (event) => placeableState.onSelect(event, this));
    }

    public override exportAsString(offsetX: number = 0, offsetY: number = 0): string {
        return `${this.type},${this.x + offsetX},${this.y + offsetY},${this.rotation},${this.placeableId}`;
    }
}