import { placeableState } from "../core/instances";
import { simulationService } from "../core/simulator/SimulationService";
import { AssetName } from "../enums/AssetName";
import { PlaceableType } from "../enums/PlaceableType";
import { Coordinate } from "../types/ICoordinate";
import { ConnectionPoint } from "./ConnectionPoint";
import { RotationHandler } from "./logic-gate/RotationHandler";
import { Placeable } from "./Placeable";

export class Clock extends Placeable {
    type: PlaceableType = PlaceableType.CLOCK;
    static assetName = AssetName.CLOCK;
    rotationHandler: RotationHandler = new RotationHandler(this);
    inputPoints: ConnectionPoint[] = [];
    outputPoints: ConnectionPoint[] = [];
    private tickRate: number;

    constructor(x: number, y: number, tickRate: number = 1000, rotation: number = 0, id?: number) {
        super(x, y, rotation, id);
        this.tickRate = tickRate;

        this.on("pointerdown", (event) => placeableState.onSelect(event, this, this.rotationHandler));
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

    public setTickRate(tickRate: number): void {
        if (simulationService.gates.has(this.placeableId)) {
            simulationService.gates.get(this.placeableId)!.tickRate = tickRate;
        }

        this.tickRate = tickRate;
    }

    public getTickRate(): number {
        return this.tickRate;
    }

    public override exportAsString(): string {
        return `clock,${this.x},${this.y},${this.rotation},${this.tickRate},${this.placeableId}`;
    }
}