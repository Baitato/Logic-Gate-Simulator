import { FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { ConnectionPoint } from './ConnectionPoint';
import { StateManager } from "../state/StateManager";
import { UnplacedWireState } from "../state/UnplacedWireState";
import { ViewportWrapper } from "../core/ViewportWrapper";

export class WireUnplaced extends Graphics {
    private viewport!: ViewportWrapper;
    endPoint: ConnectionPoint | null = null;
    startPoint: ConnectionPoint;

    private readonly handlePointerDown = () => this.onClick();
    private readonly handlePointerMove = (event: FederatedPointerEvent) => this.followPointer(event);

    constructor(sourcePoint: ConnectionPoint) {
        super();
        this.zIndex = -Infinity;
        this.startPoint = sourcePoint;
        this.eventMode = "none";
        UnplacedWireState.getInstance().selected = this;
        this.create();
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
        this.viewport.off("pointermove", this.handlePointerMove, this);
        UnplacedWireState.getInstance().selected = null;
        this.viewport.off("pointerdown", this.handlePointerDown, this);
        StateManager.activeConnectionPoint = null;
    }
}