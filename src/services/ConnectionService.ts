import { FederatedPointerEvent } from "pixi.js";
import { ViewportWrapper } from "../core/ViewportWrapper";
import { UnplacedWireListener } from "../observer/UnplacedWireObserver";
import { WireUnplaced } from "../models/WireUnplaced";
import { ConnectionPoint } from "../models/ConnectionPoint";
import { ConnectionPointListener } from "../observer/ConnectionPointObserver";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { Wire } from "../models/Wire";

export class ConnectionService implements UnplacedWireListener, ConnectionPointListener {
    private viewport: ViewportWrapper;
    private firstConnectionPoint: ConnectionPoint | null = null;
    private unplacedWire: WireUnplaced | null = null;
    static #instance: ConnectionService;
    static #initialized = false;

    private constructor(viewport: ViewportWrapper) {
        this.viewport = viewport;
    }

    public static init(): void {
        if (this.#initialized) return;
        const viewport = ViewportWrapper.getInstance();
        this.#instance = new ConnectionService(viewport);
        this.#initialized = true;
    }

    public static getInstance(): ConnectionService {
        if (!this.#instance) {
            this.init();
        }
        return this.#instance;
    }

    public onUnplacedWireClick(event: FederatedPointerEvent): void {
        if (event.target instanceof ConnectionPoint) {
            return;
        }

        this.reset();
    }

    public onConnectionPointClick(connectionPoint: ConnectionPoint): void {
        if (this.isInvalidSelection(connectionPoint))
            return;

        if (this.firstConnectionPoint === null) {
            this.firstConnectionPoint = connectionPoint;
            this.unplacedWire = new WireUnplaced(connectionPoint);
            this.viewport.addChild(this.unplacedWire);
        } else {
            const wire = new Wire(this.firstConnectionPoint, connectionPoint, this.viewport).saveWire();
            this.firstConnectionPoint.addWire(wire);
            connectionPoint.addWire(wire);
            this.viewport.addChild(wire);
            this.reset();
        }
    }

    private isInvalidSelection(connectionPoint: ConnectionPoint): boolean {
        if (this.firstConnectionPoint === null)
            return false;

        if (this.firstConnectionPoint === connectionPoint)
            return true;

        if (this.isSameTypeConnectionPoints(this.firstConnectionPoint, connectionPoint))
            return true;

        if (this.isOccupiedInputPoint(connectionPoint))
            return true;

        return false;
    }

    private isSameTypeConnectionPoints(cp1: ConnectionPoint, cp2: ConnectionPoint): boolean {
        return cp1.type === cp2.type;
    }

    private isOccupiedInputPoint(connectionPoint: ConnectionPoint): boolean {
        if (connectionPoint.type === ConnectionPointType.INPUT && connectionPoint.wires.size > 0) {
            return true;
        }
        return false;
    }

    private reset(): void {
        if (this.unplacedWire)
            this.unplacedWire.destroy();

        this.firstConnectionPoint = null;
        this.unplacedWire = null;
    }
}