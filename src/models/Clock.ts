import { placeableState } from "../core/instances";
import type { FunctionalGate } from "../core/simulator/FunctionalGate";
import { AssetName } from "../enums/AssetName";
import { PlaceableType } from "../enums/PlaceableType";
import { Coordinate } from "../types/ICoordinate";
import { ConnectionPoint } from "./ConnectionPoint";
import { Placeable } from "./Placeable";

export class Clock extends Placeable {
    type: PlaceableType = PlaceableType.CLOCK;
    static assetName = AssetName.CLOCK;
    inputPoints: ConnectionPoint[] = [];
    outputPoints: ConnectionPoint[] = [];
    private tickRate: number;

    constructor(x: number, y: number, tickRate: number = 1000, rotation: number = 0) {
        super(x, y, rotation);
        this.tickRate = tickRate;

        this.on("pointerdown", (event) => placeableState.onSelect(event, this));
    }

    protected override getInputPoints(): Coordinate[] {
        return [];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }

    public override async setUp(): Promise<Clock> {
        super.setUp(Clock.assetName);
        return this;
    }

    public setTickRate(nodes: Map<number, FunctionalGate>, tickRate: number): void {
        if (nodes.has(this.placeableId)) {
            nodes.get(this.placeableId)!.tickRate = tickRate;
        }

        this.tickRate = tickRate;
    }

    public getTickRate(): number {
        return this.tickRate;
    }

    public override exportAsString(offsetX: number = 0, offsetY: number = 0): string {
        return `clock,${this.x + offsetX},${this.y + offsetY},${this.rotation},${this.tickRate},${this.placeableId}`;
    }
}