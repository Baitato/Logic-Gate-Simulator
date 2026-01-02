import { FederatedPointerEvent, Graphics } from "pixi.js";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import type { ConnectionPoint } from './ConnectionPoint';
import type { Placeable } from "./Placeable";
import { SimulationService } from "../core/simulator/SimulationService";
import { Value } from "../types/IValue";
import { ViewportWrapper } from "../core/ViewportWrapper";
import { WireListener, WirePublisher } from '../observer/WireObserver';
import { DeletionService } from "../services/DeletionService";
import { CYAN } from "../utils/constants";

export class Wire extends Graphics implements WirePublisher {
    public targetPoint: ConnectionPoint;
    public sourcePoint: ConnectionPoint;
    public source: Placeable;
    public target: Placeable;
    public wireId!: number;
    public selected: boolean = false;

    public static wireById: Map<number, Wire> = new Map<number, Wire>();

    private viewport: ViewportWrapper;
    private value: Value;

    private static wireListeners: WireListener[] = [];
    constructor(sourcePoint: ConnectionPoint, targetPoint: ConnectionPoint, viewport: ViewportWrapper) {
        super();
        this.zIndex = -Infinity;
        this.sourcePoint = sourcePoint;
        this.targetPoint = targetPoint;
        this.viewport = viewport;

        this.cursor = "pointer";
        this.eventMode = "static";

        if (sourcePoint.type === ConnectionPointType.INPUT) {
            [this.sourcePoint, this.targetPoint] = [this.targetPoint, this.sourcePoint];
        }

        this.drawLine(0xffffff);

        this.source = this.sourcePoint.parentPlaceable;
        this.target = this.targetPoint.parentPlaceable;

        this.on("pointerdown", (event) => this.onPointerDown(event));
        Wire.wireListeners.push(DeletionService.getInstance());
    }

    public addWireListener(listener: WireListener): void {
        if (!Wire.wireListeners.includes(listener))
            Wire.wireListeners.push(listener);
    }

    private onPointerDown(event: FederatedPointerEvent): void {
        event.stopPropagation();
        Wire.wireListeners.forEach((listener) => {
            listener.onWireClick(this);
        });
    }

    public saveWire(): Wire {
        this.setWireId();
        SimulationService.getInstance().addEdge(this);
        this.render();
        return this;
    }

    public destroy(): void {
        this.targetPoint.wires.delete(this);
        this.sourcePoint.wires.delete(this);

        // Only remove from SimulationService if the wire was saved (has an ID)
        if (this.wireId !== undefined) {
            SimulationService.getInstance().deleteEdge(this);
            Wire.wireById.delete(this.wireId);
        }

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

        if (this.selected) {
            color = CYAN;
        }

        this.drawLine(color);
    }

    public drawLine(color: number): void {
        this.clear();
        const sourcePos = this.sourcePoint.getViewportPosition(this.viewport);
        const targetPos = this.targetPoint.getViewportPosition(this.viewport);

        this.position.set(0, 0);

        this.moveTo(sourcePos.x, sourcePos.y)
            .lineTo(targetPos.x, targetPos.y)
            .stroke({ color: color, width: 2 });
    }

    private setWireId(): void {
        this.wireId = Wire.generateWireId();
        Wire.wireById.set(this.wireId, this);
    }

    private static generateWireId(): number {
        let cur = Math.floor(Math.random() * 0x100000000);

        while (Wire.wireById.has(cur)) {
            cur = Math.floor(Math.random() * 0x100000000);
        }

        return cur;
    }
}