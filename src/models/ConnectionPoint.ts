import { Graphics, Point, FederatedPointerEvent } from 'pixi.js';
import { viewport } from "../core/viewport";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { Coordinate } from "../types/ICoordinate";
import { Wire } from "./Wire";
import { StateManager } from "../state/StateManager";
import { Placeable } from './Placeable';
import { WireUnplaced } from './WireUnplaced';

export class ConnectionPoint extends Graphics {
    type: ConnectionPointType;
    wires: Set<Wire> = new Set();
    value: number | null = null;
    parentPlaceable: Placeable;
    index: number;

    private readonly handlePointerDown = (event: FederatedPointerEvent) => this.onPointerDown(event);

    constructor(type: ConnectionPointType, coordinate: Coordinate, parentPlaceable: Placeable, index: number) {
        super();
        this.x = coordinate.x;
        this.y = coordinate.y;
        this.type = type;
        this.parentPlaceable = parentPlaceable;
        this.index = index;
        this.render();
    }

    public renderWire() {
        if (this.wires.size > 0) {
            this.wires.forEach((wires) => wires.render());
        }
    }

    public getViewportPosition() {
        return viewport.toLocal(this.getGlobalPosition(new Point(this.x, this.y)));
    }

    public destroy() {
        this.wires.forEach((wire) => wire.destroy());
        super.destroy();
    }

    public propagateValue(value: number) {
        if (this.type === ConnectionPointType.INPUT) return;

        this.wires.forEach((wire) => { wire.setValue(value); wire.render(); });
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

        if (this.wires.size > 0 && this.type == ConnectionPointType.INPUT) {
            this.resetStates();
            return;
        }

        if (StateManager.activeConnectionPoint === null || StateManager.activeWire === null) {
            const wire = new WireUnplaced(this);
            viewport.addChild(wire);
            StateManager.activeConnectionPoint = this;
        } else if (StateManager.activeConnectionPoint !== this && StateManager.activeConnectionPoint.type !== this.type) {
            const wire = new Wire(StateManager.activeConnectionPoint, this);
            this.wires.add(wire);
            StateManager.activeConnectionPoint.wires.add(wire);
            viewport.addChild(wire);
            this.resetStates();
        } else {
            this.resetStates();
        }
    }

    private resetStates() {
        StateManager.activeConnectionPoint = null;
        if (StateManager.activeWire)
            viewport.removeChild(StateManager.activeWire);
        StateManager.activeWire?.destroy();
        StateManager.activeWire = null;
    }
}