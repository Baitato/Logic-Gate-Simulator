import { FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { ConnectionPoint } from './ConnectionPoint';
import { ViewportWrapper } from "../core/ViewportWrapper";
import { UnplacedWireListener, UnplacedWirePublisher } from "../observer/UnplacedWireObserver";
import { ConnectionService } from "../services/ConnectionService";

export class WireUnplaced extends Graphics implements UnplacedWirePublisher {
    private viewport!: ViewportWrapper;
    private unplacedWireListeners: UnplacedWireListener[] = [];
    startPoint: ConnectionPoint;

    private readonly handlePointerDown = (event: FederatedPointerEvent) => this.onClick(event);
    private readonly handlePointerMove = (event: FederatedPointerEvent) => this.followPointer(event);

    constructor(sourcePoint: ConnectionPoint) {
        super();
        this.zIndex = -Infinity;
        this.startPoint = sourcePoint;
        this.eventMode = "none";
        this.create();
        this.addUnplacedWireListener(ConnectionService.getInstance());
    }

    public addUnplacedWireListener(listener: UnplacedWireListener): void {
        this.unplacedWireListeners.push(listener);
    }

    private create(): void {
        this.viewport = ViewportWrapper.getInstance();
        const sourcePos: Point = this.startPoint.getViewportPosition(this.viewport);
        this.position.set(sourcePos.x, sourcePos.y);
        this.viewport.on("pointermove", this.handlePointerMove, this);
    }

    private followPointer(event: FederatedPointerEvent): void {
        this.clear();
        this.viewport.off("pointerdown", this.handlePointerDown, this);
        this.viewport.once("pointerdown", this.handlePointerDown, this);

        const globalPos: Point = this.viewport.toWorld(event.global);
        const localPos: Point = new Point(
            globalPos.x - this.position.x,
            globalPos.y - this.position.y
        );

        this.moveTo(0, 0)
            .lineTo(localPos.x, localPos.y)
            .stroke({ color: 0xffffff, width: 2 });
    }

    private onClick(event: FederatedPointerEvent): void {
        this.unplacedWireListeners.forEach((listener) => {
            listener.onUnplacedWireClick(event);
        });
    }

    public destroy(): void {
        this.resetAndDestroy();
    }

    private resetAndDestroy(): void {
        this.defaultStates();
        super.destroy();
    }

    private defaultStates() {
        this.viewport.off("pointermove", this.handlePointerMove, this);
        this.viewport.off("pointerdown", this.handlePointerDown, this);
    }
}