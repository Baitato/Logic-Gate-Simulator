import { AssetName } from "../enums/AssetName";
import { PlaceableType } from "../enums/PlaceableType";
import { Coordinate } from "../types/ICoordinate";
import { Placeable } from "./Placeable";

export class Clock extends Placeable {
    type: PlaceableType = PlaceableType.CLOCK;
    static assetName = AssetName.CLOCK;
    private tickRate: number = 1000;

    constructor(x: number, y: number) {
        super(x, y, Clock.assetName);
    }

    protected override getInputPoints(): Coordinate[] {
        return [];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }

    public setTickRate(tickRate: number): Clock {
        console.log(tickRate);
        const nodes = this.simulationService.gates;

        if (nodes.has(this.placeableId)) {
            nodes.get(this.placeableId)!.tickRate = tickRate;
        }

        this.tickRate = tickRate;
        return this
    }

    public getTickRate(): number {
        return this.tickRate;
    }

    public override exportAsString(offsetX: number = 0, offsetY: number = 0): string {
        return `clock,${this.x + offsetX},${this.y + offsetY},${this.rotation},${this.tickRate},${this.placeableId}`;
    }
}