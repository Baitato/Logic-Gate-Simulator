import { ViewportWrapper } from "../core/ViewportWrapper";
import type { ConnectionPoint } from "../models/ConnectionPoint";
import type { Placeable } from "../models/Placeable";
import type { Wire } from "../models/Wire";
import { PlaceableState } from "./PlaceableState";
import { UnplacedWireState } from "./UnplacedWireState";
import { WireState } from "./WireState";

export class StateManager {
    static #instance: StateManager;
    static #initialized = false;
    static activeConnectionPoint: ConnectionPoint | null = null;
    static wireIdCounter: number = 0;
    static placeableById: Map<number, Placeable> = new Map<number, Placeable>();
    static wireById: Map<number, Wire> = new Map<number, Wire>();
    static currentTick: number = 0;

    private static MAX_TICKS: number = 4000;

    public viewport: ViewportWrapper;
    private placeableState: PlaceableState;
    private wireState: WireState;
    private unplacedWireState: UnplacedWireState;

    private constructor(viewport: ViewportWrapper, placeableState: PlaceableState, wireState: WireState, unplacedWireState: UnplacedWireState) {
        this.viewport = viewport;
        this.placeableState = placeableState;
        this.wireState = wireState;
        this.unplacedWireState = unplacedWireState;

        window.addEventListener("keydown", (event: KeyboardEvent) => this.onKeyPress(event))
        this.viewport.on("pointerdown", () => this.onViewportPress(), this);
    }

    public static init(): void {
        if (this.#initialized) return;
        const viewport = ViewportWrapper.getInstance();
        const placeableState = PlaceableState.getInstance();
        const wireState = WireState.getInstance();
        const unplacedWireState = UnplacedWireState.getInstance();
        this.#instance = new StateManager(viewport, placeableState, wireState, unplacedWireState);
        this.#initialized = true;
    }

    public static getInstance(): StateManager {
        if (!this.#instance) {
            throw new Error('StateManager not initialized. Call init() first.');
        }
        return this.#instance;
    }

    static generatePlaceableId(): number {
        let cur = Math.floor(Math.random() * 0x100000000);

        while (StateManager.placeableById.has(cur)) {
            cur = Math.floor(Math.random() * 0x100000000);
        }

        return cur;
    }

    static generateWireId(): number {
        let cur = Math.floor(Math.random() * 0x100000000);

        while (StateManager.wireById.has(cur)) {
            cur = Math.floor(Math.random() * 0x100000000);
        }

        return cur;
    }

    static nextTick(): number {
        StateManager.currentTick += 1;
        StateManager.currentTick %= this.MAX_TICKS;

        return StateManager.currentTick;
    }

    private onViewportPress() {
        if (this.placeableState.selected || this.wireState.selected) {
            this.unselect();
        }
    }

    public unselect() {
        this.placeableState.unselect();
        this.wireState.unselect();
        this.unplacedWireState.unselect();
    }

    onKeyPress(event: KeyboardEvent): void {
        if (event.key === "Delete" || event.key === "Backspace") {
            this.deleteCurrentSelection();
        }
    }

    deleteCurrentSelection(): void {
        this.placeableState.delete();
        this.wireState.delete();
        this.unplacedWireState.delete();
    }
}