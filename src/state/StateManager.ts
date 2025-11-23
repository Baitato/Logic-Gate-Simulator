import { viewport } from "../core/instances";
import { ConnectionPoint } from "../models/ConnectionPoint";
import { Placeable } from "../models/Placeable";
import { Wire } from "../models/Wire";
import { placeableState } from "./PlaceableState";
import { unplacedWireState } from "./UnplacedWireState";
import { wireState } from "./WireState";

export class StateManager {
    static activeConnectionPoint: ConnectionPoint | null = null;
    static gateIdCounter: number = 0;
    static wireIdCounter: number = 0;
    static gateById: Map<number, Placeable> = new Map<number, Placeable>();
    static wireById: Map<number, Wire> = new Map<number, Wire>();
    private static instance: StateManager | null = null;

    private constructor() {
        window.addEventListener("keydown", (event: KeyboardEvent) => this.onKeyPress(event))
        viewport.on("pointerdown", () => this.onViewportPress(), this);
    }

    static initialize(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    static getInstance(): StateManager {
        if (!StateManager.instance) {
            throw new Error('StateManager not initialized. Call StateManager.initialize() first.');
        }
        return StateManager.instance;
    }

    private onViewportPress() {
        if (placeableState.selected || wireState.selected) {
            this.unselect();
        }
    }

    public unselect() {
        placeableState.unselect();
        wireState.unselect();
        unplacedWireState.unselect();
    }

    onKeyPress(event: KeyboardEvent): void {
        if (event.key === "Delete" || event.key === "Backspace") {
            this.deleteCurrentSelection();
        }
    }

    deleteCurrentSelection(): void {
        placeableState.delete();
        wireState.delete();
        unplacedWireState.delete();
    }
}

export const stateManager = StateManager;