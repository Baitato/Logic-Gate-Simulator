import { FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { ConnectionPoint } from './ConnectionPoint';
import { viewport } from "../core/viewport";
import { StateManager } from "../state/StateManager";

export class Wire extends Graphics {
    endPoint: ConnectionPoint | null = null;
    startPoint: ConnectionPoint;
    private value: number | null = null;

    private readonly handlePointerDown = () => this.onClick();
    private readonly handlePointerMove = (event: FederatedPointerEvent) => this.followPointer(event);

    constructor(sourcePoint: ConnectionPoint) {
        super();
        this.zIndex = -Infinity;
        this.startPoint = sourcePoint;
        const sourcePos: Point = sourcePoint.getViewportPosition();
        this.position.set(sourcePos.x, sourcePos.y);
        StateManager.activeWire = this;

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

    public setValue(value: number) {
        this.value = value;
        this.emit('valueUpdated', value);
    }

    public getValue(): number | null {
        return this.value;
    }

    public render(): void {
        if (this.endPoint == null) return;

        const sourcePos: Point = this.startPoint.getViewportPosition();
        this.position.set(sourcePos.x, sourcePos.y);

        const color = this.value != null ? 0x00ff00 : 0xffffff;

        const endPos: Point = this.endPoint.getViewportPosition();
        this.clear();
        this.moveTo(0, 0)
            .lineTo(endPos.x - this.position.x, endPos.y - this.position.y)
            .stroke({ color: color, width: 2 });
    }

    private onClick(): void {
        this.destroy();
    }

    public persist(endPoint: ConnectionPoint): void {
        this.defaultStates();
        this.clear();
        this.endPoint = endPoint;
        this.startPoint.addWire(this);
        endPoint.addWire(this);
        this.render();
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
        StateManager.activeWire = null;
        StateManager.activeConnectionPoint = null;
    }
}