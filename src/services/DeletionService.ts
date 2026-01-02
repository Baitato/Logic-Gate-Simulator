import { Placeable } from "../models/Placeable";
import { PlaceableListener } from "../observer/PlaceableObserver";
import { ViewportListener } from "../observer/ViewportObserver";
import { ViewportWrapper } from "../core/ViewportWrapper";
import { WireListener } from "../observer/WireObserver";
import { Wire } from "../models/Wire";

export class DeletionService implements ViewportListener, PlaceableListener, WireListener {
    static #instance: DeletionService;
    static #initialized = false;

    private selectedPlaceable: Placeable | null = null;
    private selectedWire: Wire | null = null;

    private constructor() { }


    public static init(): void {
        if (this.#initialized) return;
        this.#instance = new DeletionService();
        ViewportWrapper.getInstance().addViewportListener(this.#instance);
        this.#initialized = true;
    }

    public static getInstance(): DeletionService {
        if (!this.#instance) {
            this.init();
        }
        return this.#instance;
    }

    public onPlaceableClick(placeable: Placeable): void {
        this.selectedWire = null;
        this.selectedPlaceable = placeable;
    }

    public onViewportClick(): void {
        if (this.selectedWire) {
            this.selectedWire.selected = false;
        }
        this.reset();
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === "Delete" || event.key === "Backspace") {
            this.selectedPlaceable?.destroy();
            this.selectedWire?.destroy();
            this.reset();
        }
    }

    public onWireClick(wire: Wire): void {
        this.selectedPlaceable = null;
        this.selectedWire = wire;
        this.selectedWire.selected = true;
    }

    private reset(): void {
        this.selectedPlaceable = null;
        this.selectedWire = null;
    }
}