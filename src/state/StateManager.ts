import { viewport, placeableState, wireState, unplacedWireState } from "../core/instances";
import { ConnectionPoint } from "../models/ConnectionPoint";
import { Placeable } from "../models/Placeable";
import { Wire } from "../models/Wire";

export class StateManager {
    static activeConnectionPoint: ConnectionPoint | null = null;
    static placeableIdCounter: number = 0;
    static wireIdCounter: number = 0;
    static placeableById: Map<number, Placeable> = new Map<number, Placeable>();
    static wireById: Map<number, Wire> = new Map<number, Wire>();
    static currentTick: number = 0;
    
    private static MAX_TICKS: number = 4000;
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

    static nextTick(): number {
        StateManager.currentTick += 1;
        StateManager.currentTick %= this.MAX_TICKS;

        return StateManager.currentTick;
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