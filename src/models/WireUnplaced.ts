import { FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { ConnectionPoint } from './ConnectionPoint';
import { viewport } from "../core/instances";
import { StateManager } from "../state/StateManager";
import { unplacedWireState } from "../state/UnplacedWireState";

export class WireUnplaced extends Graphics {
    endPoint: ConnectionPoint | null = null;
    startPoint: ConnectionPoint;

    private readonly handlePointerDown = () => this.onClick();
    private readonly handlePointerMove = (event: FederatedPointerEvent) => this.followPointer(event);

    constructor(sourcePoint: ConnectionPoint) {
        super();
        this.zIndex = -Infinity;
        this.startPoint = sourcePoint;
        this.eventMode = "none";
        const sourcePos: Point = sourcePoint.getViewportPosition();
        this.position.set(sourcePos.x, sourcePos.y);
        unplacedWireState.selected = this;

        viewport.on("pointermove", this.handlePointerMove, this);
    }

    private followPointer(event: FederatedPointerEvent): void {
        this.clear();
        viewport.off("pointerdown", this.handlePointerDown, this);
        viewport.once("pointerdown", this.handlePointerDown, this);

        const globalPos: Point = viewport.toWorld(event.global);
        const localPos: Point = new Point(
            globalPos.x - this.position.x,
            globalPos.y - this.position.y
        );

        this.moveTo(0, 0)
            .lineTo(localPos.x, localPos.y)
            .stroke({ color: 0xffffff, width: 2 });
    }

    private onClick(): void {
        this.destroy();
    }

    public destroy(): void {
        this.resetAndDestroy();
    }

    private resetAndDestroy(): void {
        this.defaultStates();
        super.destroy();
    }

    private defaultStates() {
        viewport.off("pointermove", this.handlePointerMove, this);
        viewport.off("pointerdown", this.handlePointerDown, this);
        unplacedWireState.selected = null;
        StateManager.activeConnectionPoint = null;
    }
}