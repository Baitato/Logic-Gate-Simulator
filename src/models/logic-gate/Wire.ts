import { FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { ConnectionPoint } from './ConnectionPoint';
import { viewport } from "../../core/viewport";

export class Wire extends Graphics {
    outputs: ConnectionPoint[] = [];
    input: ConnectionPoint;
    value: number = 0;

    private readonly handlePointerDown = (event: FederatedPointerEvent) => this.onClick(event);

    constructor(sourcePoint: ConnectionPoint) {
        super();
        this.zIndex = -Infinity;
        this.input = sourcePoint;

        const sourcePos: Point = sourcePoint.getViewportPosition();
        this.position.set(sourcePos.x, sourcePos.y);

        viewport.on("pointermove", (event) => this.followPointer(event));
    }

    followPointer(event: FederatedPointerEvent): void {
        this.clear();

        const globalPos: Point = viewport.toWorld(event.global);
        const localPos: Point = new Point(
            globalPos.x - this.position.x,
            globalPos.y - this.position.y
        );

        this.moveTo(0, 0)
            .lineTo(localPos.x, localPos.y)
            .stroke({ color: 0xffffff, width: 2 });

        viewport.off("pointerdown", this.handlePointerDown, this);
        viewport.once("pointerdown", this.handlePointerDown, this);
    }

    onClick(event: FederatedPointerEvent): void {
        console.log(event);
    }
}