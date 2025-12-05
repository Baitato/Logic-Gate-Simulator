import { FederatedPointerEvent, Graphics, Rectangle } from "pixi.js";
import { MyViewport } from "../core/viewport";
import { Dimension } from "../types/IDimension";
import { getRoundedPoint } from "../utils/util";

export class SelectionService {
    private viewport: MyViewport;
    private startPoint: Dimension | null = null;
    private endPoint: Dimension | null = null;
    private selectionRect: Graphics | null = null;
    private actualSelection: Rectangle | null = null;

    private onPointerDown: (event: FederatedPointerEvent) => void;
    private onPointerMove: ((event: FederatedPointerEvent) => void) | null = null;
    private onPointerUp: ((event: FederatedPointerEvent) => void) | null = null;

    constructor(viewport: MyViewport) {
        this.viewport = viewport;

        // Ensure viewport can receive pointer events
        this.viewport.eventMode = "static";

        this.onPointerDown = (event) => this.startSelection(event);
        this.viewport.on("pointerdown", this.onPointerDown);
    }

    startSelection(event: FederatedPointerEvent): void {
        this.actualSelection = null;
        this.startPoint = this.viewport.toLocal(event.global);

        // Create selection rectangle once
        this.selectionRect = new Graphics();
        this.viewport.addChild(this.selectionRect);

        this.onPointerMove = (event) => this.updateSelection(event);
        this.onPointerUp = (event) => this.endSelection(event);
        this.viewport.on("pointermove", this.onPointerMove);
        this.viewport.on("pointerup", this.onPointerUp);
    }

    updateSelection(event: FederatedPointerEvent): void {
        if (!this.startPoint || !this.selectionRect) return;

        const currentPoint = this.viewport.toLocal(event.global);

        // Clear and redraw
        this.selectionRect.clear();
        this.selectionRect.rect(
            Math.min(this.startPoint.x, currentPoint.x),
            Math.min(this.startPoint.y, currentPoint.y),
            Math.abs(currentPoint.x - this.startPoint.x),
            Math.abs(currentPoint.y - this.startPoint.y))
            .stroke({ color: 0x0099ff, width: 2 })
            .fill({ color: 0x0099ff, alpha: 0.2 });
    }

    endSelection(event: FederatedPointerEvent): void {
        this.viewport.off("pointermove", this.onPointerMove!);
        this.viewport.off("pointerup", this.onPointerUp!);

        this.endPoint = this.viewport.toLocal(event.global);

        // Round to nearest 50 units
        const roundedStartX = getRoundedPoint(this.startPoint!.x)
        const roundedStartY = getRoundedPoint(this.startPoint!.y)
        const roundedEndX = getRoundedPoint(this.endPoint!.x)
        
        const roundedEndY = getRoundedPoint(this.endPoint!.y)
        // Create rounded rectangle
        this.actualSelection = new Rectangle(
            Math.min(roundedStartX, roundedEndX),
            Math.min(roundedStartY, roundedEndY),
            Math.abs(roundedEndX - roundedStartX),
            Math.abs(roundedEndY - roundedStartY)
        );

        this.selectionRect?.clear();
        this.selectionRect?.destroy();
        this.selectionRect = null;
    }

    getActualSelection(): Rectangle | null {
        return this.actualSelection;
    }

    getStartPointRounded(): Dimension | null {
        const roundedStartX = getRoundedPoint(this.startPoint!.x);
        const roundedStartY = getRoundedPoint(this.startPoint!.y);

        return { x: roundedStartX, y: roundedStartY }
    }
}