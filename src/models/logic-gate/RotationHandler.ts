import { FederatedPointerEvent, Sprite } from "pixi.js";
import { getPreloadedTexture } from "../../utils/assetLoader";
import { placeableDimensions } from "../../utils/constants";
import { Placeable } from "../Placeable";
import { AssetName } from "../../enums/AssetName";

export class RotationHandler extends Sprite {
    static #instance: RotationHandler;
    static #initialized = false;
    private startPointerAngle: number = 0;
    private startRotation: number = 0;
    private pointerMoveListener?: (event: FederatedPointerEvent) => void;
    private pointerUpListener?: () => void;
    private pointerDownListener?: (event: FederatedPointerEvent) => void;

    private constructor() {
        super();
    }

    setupRotationHandler(): RotationHandler {
        this.texture = getPreloadedTexture(AssetName.ROTATION_WIDGET);

        this.anchor.set(0.5, 0.5);
        this.y = -(placeableDimensions.y) / 2 - 10;
        this.width = 11;
        this.height = 11;
        this.eventMode = "static";
        this.cursor = "pointer";
        this.zIndex = -10;
        this.visible = false;

        return this;
    }

    public static init(): void {
        if (this.#initialized) return;
        this.#instance = new RotationHandler();
        this.#instance.setupRotationHandler();
        this.#initialized = true;
    }

    public static getInstance(): RotationHandler {
        if (!this.#instance) {
            throw new Error('RotationHandler not initialized. Call init() first.');
        }
        return this.#instance;
    }

    public addRotationHandler(placeable: Placeable): void {
        this.visible = true;
        this.pointerDownListener = (event) => this.onPointerDown(event, placeable);
        this.on("pointerdown", this.pointerDownListener);
    }

    private setupRotationEvents(placeable: Placeable): void {
        this.pointerMoveListener = (event) => this.onPointerMove(event, placeable);
        this.on("globalpointermove", this.pointerMoveListener);

        this.pointerUpListener = () => this.onPointerUp(placeable);
        this.on("pointerupoutside", this.pointerUpListener);
        this.on("pointerup", this.pointerUpListener);
    }

    private cleanupRotationEvents(): void {
        this.off("globalpointermove", this.pointerMoveListener);
        this.off("pointerupoutside", this.pointerUpListener);
        this.off("pointerup", this.pointerUpListener);
    }

    public removeRotationHandler(): void {
        this.visible = false;

        this.off("pointerdown", this.pointerDownListener);
        this.cleanupRotationEvents();
    }

    private onPointerDown(event: FederatedPointerEvent, placeable: Placeable): void {
        event.stopPropagation();

        this.startRotation = placeable.rotation;
        const localPos = placeable.toLocal(event.global);
        this.startPointerAngle = Math.atan2(localPos.y, localPos.x);

        this.setupRotationEvents(placeable);
    }

    private onPointerMove(event: FederatedPointerEvent, placeable: Placeable): void {
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

    private onPointerUp(placeable: Placeable): void {
        // Snap the rotation to the nearest 90-degree increment
        const snappedRotation = Math.round(placeable.rotation / (Math.PI / 2)) * (Math.PI / 2);
        placeable.rotation = snappedRotation;
        placeable.renderWires();

        this.cleanupRotationEvents();
    }

    private smoothRotation(currentRotation: number, targetRotation: number, smoothingFactor = 0.2): number {
        return currentRotation + (targetRotation - currentRotation) * smoothingFactor;
    }
}