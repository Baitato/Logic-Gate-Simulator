import { FederatedPointerEvent, Graphics, Rectangle } from "pixi.js";
import { ViewportWrapper } from "../core/ViewportWrapper";
import { Dimension } from "../types/IDimension";
import { getRoundedPoint } from "../utils/util";

export class SelectionService {
    static #instance: SelectionService;
    static #initialized = false;

    private viewport: ViewportWrapper;
    private startPoint: Dimension | null = null;
    private endPoint: Dimension | null = null;
    private selectionRect: Graphics | null = null;
    private actualSelection: Rectangle | null = null;
    private isSelecting: boolean = false;

    private onPointerMove: ((event: FederatedPointerEvent) => void) | null = null;
    private onGlobalPointerUp: ((event: PointerEvent) => void) | null = null;

    private constructor(viewport: ViewportWrapper) {
        this.viewport = viewport;

        this.viewport.on("pointerdown", (event) => this.startSelection(event));
    }

    public static init(): void {
        if (this.#initialized) return;
        const viewport = ViewportWrapper.getInstance();
        this.#instance = new SelectionService(viewport);
        this.#initialized = true;
    }

    public static getInstance(): SelectionService {
        if (!this.#instance) {
            throw new Error('SelectionService not initialized. Call init() first.');
        }
        return this.#instance;
    }

    startSelection(event: FederatedPointerEvent): void {
        // Ignore if already selecting
        if (this.isSelecting) return;

        this.isSelecting = true;
        this.actualSelection = null;

        // Clear previous selection rectangle if it exists
        if (this.selectionRect) {
            this.selectionRect.clear();
            this.selectionRect.destroy();
            this.selectionRect = null;
        }

        this.startPoint = this.viewport.toLocal(event.global);

        // Create selection rectangle once
        this.selectionRect = new Graphics();
        this.viewport.addChild(this.selectionRect);

        this.onPointerMove = (event) => this.updateSelection(event);
        this.viewport.on("pointermove", this.onPointerMove);

        // Use global pointerup to ensure endSelection is always called
        this.onGlobalPointerUp = (event) => this.endSelection(event);
        window.addEventListener("pointerup", this.onGlobalPointerUp);
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

    endSelection(event: PointerEvent): void {
        // Remove event listeners safely
        if (this.onPointerMove) {
            this.viewport.off("pointermove", this.onPointerMove);
            this.onPointerMove = null;
        }
        if (this.onGlobalPointerUp) {
            window.removeEventListener("pointerup", this.onGlobalPointerUp);
            this.onGlobalPointerUp = null;
        }

        this.isSelecting = false;

        // Safety check - ensure startPoint exists
        if (!this.startPoint) {
            return;
        }

        // Convert global screen coordinates to viewport local coordinates
        const globalPoint = { x: event.clientX, y: event.clientY };
        this.endPoint = this.viewport.toLocal(globalPoint);

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

        // Clear the drag selection rect and redraw with the rounded actualSelection
        this.selectionRect?.clear();
        if (this.actualSelection.width > 0 && this.actualSelection.height > 0) {
            this.selectionRect?.rect(
                this.actualSelection.x,
                this.actualSelection.y,
                this.actualSelection.width,
                this.actualSelection.height
            )
                .stroke({ color: 0xFFFFFF, width: 2 })
                .fill({ color: 0xFFFFFF, alpha: 0.2 });
        }
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