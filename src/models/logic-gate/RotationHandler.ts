import { FederatedPointerEvent, Sprite } from "pixi.js";
import { loadTexture } from "../../utils/assetLoader";
import { placeableDimensions } from "../../utils/constants";
import { viewport } from "../../core/viewport";
import { Placeable } from "../Placeable";

export class RotationHandler extends Sprite {
    parentPlaceable: Placeable;
    startPointerAngle: number = 0;
    startRotation: number = 0;
    private readonly pointerMoveListener = (event: FederatedPointerEvent) => this.onPointerMove(event);
    private readonly pointerUpListener = () => this.onPointerUp();

    constructor(parentPlaceable: Placeable) {
        super();
        this.parentPlaceable = parentPlaceable;
        this.setupRotationHandler();
    }

    async setupRotationHandler(): Promise<void> {
        this.texture = await loadTexture("rotate");

        this.y = -(placeableDimensions.y) / 2 - 10;
        this.width = 11;
        this.height = 11;
        this.eventMode = "static";
        this.cursor = "pointer";
        this.zIndex = -10;
        this.on("pointerdown", this.onPointerDown);
    }

    setupRotationEvents(): void {
        viewport.on("pointermove", this.pointerMoveListener);
        viewport.on("pointerup", this.pointerUpListener);
    }

    onPointerDown(event: FederatedPointerEvent): void {
        event.stopPropagation();

        this.startRotation = this.parentPlaceable.rotation;
        const localPos = this.parentPlaceable.toLocal(event.global);
        this.startPointerAngle = Math.atan2(localPos.y, localPos.x);

        this.setupRotationEvents();
    }

    onPointerMove(event: FederatedPointerEvent) {
        const localPos = this.parentPlaceable.toLocal(event.global);
        const currentAngle = Math.atan2(localPos.y, localPos.x);
        const deltaAngle = currentAngle - this.startPointerAngle;

        // Apply smoothed rotation relative to the starting rotation
        const targetRotation = this.startRotation + deltaAngle;
        this.parentPlaceable.rotation = this.smoothRotation(
            this.parentPlaceable.rotation,
            targetRotation
        );

        this.parentPlaceable.renderWires();
    }

    onPointerUp(): void {
        // Snap the rotation to the nearest 90-degree increment
        const snappedRotation = Math.round(this.parentPlaceable.rotation / (Math.PI / 2)) * (Math.PI / 2);
        this.parentPlaceable.rotation = snappedRotation;
        this.parentPlaceable.renderWires();

        this.cleanupRotationEvents();
    }

    cleanupRotationEvents(): void {
        viewport.off("pointermove", this.pointerMoveListener);
        viewport.off("pointerup", this.pointerUpListener);
    }

    smoothRotation(currentRotation: number, targetRotation: number, smoothingFactor = 0.2): number {
        return currentRotation + (targetRotation - currentRotation) * smoothingFactor;
    }
}