import { Graphics, Point, FederatedPointerEvent } from 'pixi.js';
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { Coordinate } from "../types/ICoordinate";
import { Wire } from "./Wire";
import { StateManager } from "../state/StateManager";
import { WireUnplaced } from './WireUnplaced';
import type { Placeable } from './Placeable';
import { UnplacedWireState } from '../state/UnplacedWireState';
import { ViewportWrapper } from '../core/ViewportWrapper';

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
        this.zIndex = Infinity;
        this.render();
    }

    public renderWire() {
        if (this.wires.size > 0) {
            for (const wire of this.wires) {
                wire.render();
            }
        }
    }

    public getViewportPosition(viewport: ViewportWrapper): Point {
        const pointData = viewport.toLocal(this.getGlobalPosition(new Point(this.x, this.y)));
        return new Point(pointData.x, pointData.y);
    }

    public destroy() {
        this.wires.forEach((wire) => wire.destroy());
        super.destroy();
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

        const viewport: ViewportWrapper = ViewportWrapper.getInstance();

        if (this.wires.size > 0 && this.type == ConnectionPointType.INPUT) {
            this.resetStates();
            return;
        }

        if (StateManager.activeConnectionPoint === null || UnplacedWireState.getInstance().selected === null) {
            const wire = new WireUnplaced(this);
            viewport.addChild(wire);
            StateManager.activeConnectionPoint = this;
        } else if (StateManager.activeConnectionPoint !== this && StateManager.activeConnectionPoint.type !== this.type) {
            const wire = new Wire(StateManager.activeConnectionPoint, this, viewport).saveWire();
            this.wires.add(wire);
            StateManager.activeConnectionPoint.wires.add(wire);
            viewport.addChild(wire);
            this.resetStates();
        } else {
            this.resetStates();
        }
    }

    public addWire(wire: Wire) {
        this.wires.add(wire);
    }

    private resetStates() {
        StateManager.activeConnectionPoint = null;
        const selected = UnplacedWireState.getInstance().selected;

        if (selected) {
            selected.destroy();
            ViewportWrapper.getInstance().removeChild(selected);
            UnplacedWireState.getInstance().selected = null;
        }
    }
}