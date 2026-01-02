import { PlaceableListener } from "../observer/PlaceableObserver";
import { RotationWidget } from '../models/logic-gate/RotationWidget';
import { Placeable } from "../models/Placeable";
import { ViewportListener } from "../observer/ViewportObserver";
import { ViewportWrapper } from "../core/ViewportWrapper";

export class RotationService implements PlaceableListener, ViewportListener {
    static #instance: RotationService;
    static #initialized = false;

    private rotationWidget: RotationWidget;

    private constructor(rotationWidget: RotationWidget) {
        this.rotationWidget = rotationWidget;
    }

    static init(): void {
        if (this.#initialized) return;
        this.#instance = new RotationService(RotationWidget.getInstance());
        ViewportWrapper.getInstance().addViewportListener(this.#instance);
        this.#initialized = true;
    }

    static getInstance(): RotationService {
        if (!this.#instance) {
            this.init();
        }
        return this.#instance;
    }

    public onPlaceableClick(placeable: Placeable): void {
        this.rotationWidget.removeRotationHandler();
        this.rotationWidget.addRotationHandler(placeable);
    }

    public onViewportClick(): void {
        this.rotationWidget.removeRotationHandler();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onKeyPress(_event: KeyboardEvent): void {
        // No action needed for rotation on key press
    }
}