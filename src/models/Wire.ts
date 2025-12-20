import { Graphics } from "pixi.js";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { StateManager } from "../state/StateManager";
import { CYAN } from "../utils/constants";
import type { ConnectionPoint } from './ConnectionPoint';
import type { Placeable } from "./Placeable";
import { SimulationService } from "../core/simulator/SimulationService";
import { WireState } from "../state/WireState";
import { Value } from "../types/IValue";
import { ViewportWrapper } from "../core/ViewportWrapper";

export class Wire extends Graphics {
    targetPoint: ConnectionPoint;
    sourcePoint: ConnectionPoint;
    source: Placeable;
    target: Placeable;
    wireId!: number;
    viewport: ViewportWrapper;

    private value: Value;

    constructor(sourcePoint: ConnectionPoint, targetPoint: ConnectionPoint, viewport: ViewportWrapper) {
        super();
        this.zIndex = -Infinity;
        this.sourcePoint = sourcePoint;
        this.targetPoint = targetPoint;
        this.viewport = viewport;

        this.cursor = "pointer";
        this.eventMode = "static";

        this.setWireId();

        if (sourcePoint.type === ConnectionPointType.INPUT) {
            [this.sourcePoint, this.targetPoint] = [this.targetPoint, this.sourcePoint];
        }

        this.drawLine(0xffffff);

        this.source = this.sourcePoint.parentPlaceable;
        this.target = this.targetPoint.parentPlaceable;

        StateManager.wireById.set(this.wireId, this);

        SimulationService.getInstance().addEdge(this);
        this.render();

        this.on("pointerdown", (event) => WireState.getInstance().onSelect(event, this));
    }

    public saveWire(): Wire {
        this.setWireId();
        return this;
    }

    public destroy(): void {
        this.targetPoint.wires.delete(this);
        this.sourcePoint.wires.delete(this);

        SimulationService.getInstance().deleteEdge(this);

        StateManager.wireById.delete(this.wireId);
        super.destroy();
    }

    public exportAsString(): string {
        return `wire,${this.sourcePoint.parentPlaceable.placeableId},${this.sourcePoint.index},${this.targetPoint.parentPlaceable.placeableId},${this.targetPoint.index},${this.wireId}`;
    }

    public setValue(value: Value): void {
        this.value = value;
        this.render();
    }

    public getValue(): Value {
        return this.value;
    }

    public render(): void {
        const RED = 0xff0000;
        const GREEN = 0x00ff00;
        const WHITE = 0xffffff;

        let color;

        switch (this.value) {
            case 0:
                color = WHITE;
                break;
            case 1:
                color = GREEN;
                break;
            default:
                color = RED;
        }

        this.clear();
        this.drawLine(color);
    }

    public async drawLine(color: number): Promise<void> {
        const sourcePos = this.sourcePoint.getViewportPosition(this.viewport);
        const targetPos = this.targetPoint.getViewportPosition(this.viewport);

        this.position.set(0, 0);

        if (WireState.getInstance().selected === this) {
            color = CYAN;
        }

        this.moveTo(sourcePos.x, sourcePos.y)
            .lineTo(targetPos.x, targetPos.y)
            .stroke({ color: color, width: 2 });
    }

    private setWireId(): void {
        this.wireId = StateManager.generateWireId();
        StateManager.wireById.set(this.wireId, this);
    }

}