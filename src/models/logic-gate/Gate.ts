import { Coordinate } from "../../types/ICoordinate";
import { ConnectionPoint } from "../ConnectionPoint";
import { RotationHandler } from "./RotationHandler";
import { Placeable } from "../Placeable";
import { PlaceableType } from '../../enums/PlaceableType';
import { placeableState } from "../../core/instances";

export abstract class Gate extends Placeable {
    rotationHandler: RotationHandler = new RotationHandler(this);
    outputPoints: ConnectionPoint[] = [];
    inputPoints: ConnectionPoint[] = [];
    type: PlaceableType;

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];

    constructor(x: number, y: number, type: PlaceableType, rotation: number = 0, id?: number) {
        super(x, y, rotation, id);

        this.type = type;
        this.on("pointerdown", (event) => placeableState.onSelect(event, this, this.rotationHandler));
    }

    public override exportAsString(): string {
        return `${this.type},${this.x},${this.y},${this.rotation},${this.placeableId}`;
    }
}