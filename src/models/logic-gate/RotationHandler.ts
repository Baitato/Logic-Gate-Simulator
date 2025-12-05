import { FederatedPointerEvent, Sprite } from "pixi.js";
import { loadTexture } from "../../utils/assetLoader";
import { placeableDimensions } from "../../utils/constants";
import { Placeable } from "../Placeable";

export class RotationHandler extends Sprite {
    startPointerAngle: number = 0;
    startRotation: number = 0;
    private pointerMoveListener?: (event: FederatedPointerEvent) => void;
    private pointerUpListener?: () => void;
    private pointerDownListener?: (event: FederatedPointerEvent) => void;

    constructor() {
        super();
        this.anchor.set(0.5, 0.5);
        this.setupRotationHandler();
    }

    async setupRotationHandler(): Promise<RotationHandler> {
        this.texture = await loadTexture("rotate");

        this.y = -(placeableDimensions.y) / 2 - 10;
        this.width = 11;
        this.height = 11;
        this.eventMode = "static";
        this.cursor = "pointer";
        this.zIndex = -10;
        this.visible = false;

        return this;
    }

    addRotationHandler(placeable: Placeable): void {
        this.visible = true;
        this.pointerDownListener = (event) => this.onPointerDown(event, placeable);
        this.on("pointerdown", this.pointerDownListener);
    }

    setupRotationEvents(placeable: Placeable): void {
        this.pointerMoveListener = (event) => this.onPointerMove(event, placeable);
        this.on("globalpointermove", this.pointerMoveListener);

        this.pointerUpListener = () => this.onPointerUp(placeable);
        this.on("pointerupoutside", this.pointerUpListener);
        this.on("pointerup", this.pointerUpListener);
    }

    onPointerDown(event: FederatedPointerEvent, placeable: Placeable): void {
        event.stopPropagation();

        this.startRotation = placeable.rotation;
        const localPos = placeable.toLocal(event.global);
        this.startPointerAngle = Math.atan2(localPos.y, localPos.x);

        this.setupRotationEvents(placeable);
    }

    onPointerMove(event: FederatedPointerEvent, placeable: Placeable): void {
        const localPos = placeable.toLocal(event.global);
        const currentAngle = Math.atan2(localPos.y, localPos.x);
        const deltaAngle = currentAngle - this.startPointerAngle;

        // Apply smoothed rotation relative to the starting rotation
        const targetRotation = this.startRotation + deltaAngle;
        placeable.rotation = this.smoothRotation(
            placeable.rotation,
            targetRotation
        );

        placeable.renderWires();
    }

    onPointerUp(placeable: Placeable): void {
        // Snap the rotation to the nearest 90-degree increment
        const snappedRotation = Math.round(placeable.rotation / (Math.PI / 2)) * (Math.PI / 2);
        placeable.rotation = snappedRotation;
        placeable.renderWires();

        this.cleanupRotationEvents();
    }

    cleanupRotationEvents(): void {
        this.off("globalpointermove", this.pointerMoveListener);
        this.off("pointerupoutside", this.pointerUpListener);
        this.off("pointerup", this.pointerUpListener);
    }

    cleanUp(): void {
        this.visible = false;
        this.off("pointerdown", this.pointerDownListener);
        this.cleanupRotationEvents();
    }

    smoothRotation(currentRotation: number, targetRotation: number, smoothingFactor = 0.2): number {
        return currentRotation + (targetRotation - currentRotation) * smoothingFactor;
    }
}