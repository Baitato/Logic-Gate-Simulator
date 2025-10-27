import { FederatedPointerEvent, Sprite } from "pixi.js";
import { loadTexture } from "../../utils/assetLoader";
import { Gate } from "./Gate";
import { viewport } from "../../core/viewport";
import { gateDimensions } from "../../utils/constants";

export class RotationHandler extends Sprite {
    parentGate: Gate;
    startPointerAngle: number = 0;
    startRotation: number = 0;
    private readonly pointerMoveListener = (event: FederatedPointerEvent) => this.onPointerMove(event);
    private readonly pointerUpListener = () => this.onPointerUp();

    constructor(parentGate: Gate) {
        super();
        this.parentGate = parentGate;
        this.setupRotationHandler();
    }

    async setupRotationHandler(): Promise<void> {
        this.texture = await loadTexture("rotate");

        this.y = -(gateDimensions.y) / 2 - 10;
        this.width = 10;
        this.height = 10;
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

        this.startRotation = this.parentGate.rotation;
        const localPos = this.parentGate.toLocal(event.global);
        this.startPointerAngle = Math.atan2(localPos.y, localPos.x);

        this.setupRotationEvents();
    }

    onPointerMove(event: FederatedPointerEvent) {
        const localPos = this.parentGate.toLocal(event.global);
        const currentAngle = Math.atan2(localPos.y, localPos.x);
        const deltaAngle = currentAngle - this.startPointerAngle;

        // Apply smoothed rotation relative to the starting rotation
        const targetRotation = this.startRotation + deltaAngle;
        this.parentGate.rotation = this.smoothRotation(
            this.parentGate.rotation,
            targetRotation
        );
    }

    onPointerUp(): void {
        // Snap the rotation to the nearest 90-degree increment
        const snappedRotation = Math.round(this.parentGate.rotation / (Math.PI / 2)) * (Math.PI / 2);
        this.parentGate.rotation = snappedRotation;

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