import { Graphics, Point, FederatedPointerEvent } from 'pixi.js';
import { viewport } from "../core/viewport";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { Coordinate } from "../types/ICoordinate";
import { Wire } from "./Wire";
import { StateManager } from "../state/StateManager";

export class ConnectionPoint extends Graphics {
    type: ConnectionPointType;
    wires: Wire[] = [];
    value: number | null = null;

    private readonly handlePointerDown = (event: FederatedPointerEvent) => this.onPointerDown(event);

    constructor(type: ConnectionPointType, coordinate: Coordinate) {
        super();
        this.x = coordinate.x;
        this.y = coordinate.y;
        this.type = type;
        this.render();
    }

    public renderWire() {
        if (this.wires.length > 0) {
            this.wires.forEach((wires) => wires.render());
        }
    }

    public addWire(wire: Wire) {
        this.wires.push(wire);
    }

    public getViewportPosition() {
        return viewport.toLocal(this.getGlobalPosition(new Point(this.x, this.y)));
    }

    public destroy() {
        super.destroy();
        this.wires.forEach((wire) => wire.destroy());
    }

    public propagateValue(value: number) {
        if (this.type === ConnectionPointType.INPUT) return;

        this.wires.forEach((wire) => { wire.setValue(value); wire.render(); });
    }

    private onValueUpdate(value: number) {
        this.value = value;
    }

    private render() {
        this.eventMode = "static";
        this.cursor = "pointer";

        this.on("pointerover", () => this.drawCircleOfRadius(4.5));
        this.on("pointerout", () => this.drawCircleOfRadius(3));
        this.on("pointerdown", this.handlePointerDown);

        this.drawCircleOfRadius(3);
    }

    private drawCircleOfRadius(radius: number): void {
        this.clear();
        this.fill({ color: 0xffffff });
        this.circle(0, 0, radius);
        this.fill();
    }

    private onPointerDown(event: FederatedPointerEvent): void {
        event.stopPropagation();

        if (this.wires.length > 0 && this.type == ConnectionPointType.INPUT)
            return;

        if (StateManager.activeConnectionPoint === null || StateManager.activeWire === null) {
            const wire = new Wire(this);
            wire.on('valueUpdated', (value: number) => this.onValueUpdate(value));
            viewport.addChild(wire);
            StateManager.activeConnectionPoint = this;
        } else if (StateManager.activeConnectionPoint !== this && StateManager.activeConnectionPoint.type !== this.type) {
            StateManager.activeWire.persist(this);
        } else {
            // If clicking the same point or invalid type, destroy the wire without connecting
            if (StateManager.activeWire) {
                viewport.removeChild(StateManager.activeWire);
                StateManager.activeWire.destroy();
                StateManager.activeWire = null;
            }
            StateManager.activeConnectionPoint = null;
        }
    }
}