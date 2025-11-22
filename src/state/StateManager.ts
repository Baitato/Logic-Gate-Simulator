import { viewport } from "../core/viewport";
import { ConnectionPoint } from "../models/ConnectionPoint";
import { Placeable } from "../models/Placeable";
import { Wire } from "../models/Wire";
import { WireUnplaced } from "../models/WireUnplaced";

export class StateManager {
    static activeWire: WireUnplaced | null = null;
    static activeConnectionPoint: ConnectionPoint | null = null;
    static selectedPlaceable: Placeable | null = null;
    static gateIdCounter: number = 0;
    static wireIdCounter: number = 0;
    static gateById: Map<number, Placeable> = new Map<number, Placeable>();
    static wireById: Map<number, Wire> = new Map<number, Wire>();

    constructor() {
        window.addEventListener("keydown", (event: KeyboardEvent) => this.onKeyPress(event))
        viewport.on("pointerdown", () => this.onViewportPress(), this);
    }

    private onViewportPress() {
        if (StateManager.selectedPlaceable) {
            this.unselectPlaceable();
        }
    }

    public unselectPlaceable() {
        if (StateManager.selectedPlaceable) {
            StateManager.selectedPlaceable.removeChild(StateManager.selectedPlaceable.rotationHandler);
            StateManager.selectedPlaceable = null;
        }
    }

    onKeyPress(event: KeyboardEvent): void {
        if (event.key === "Delete" || event.key === "Backspace") {
            this.deleteCurrentSelection();
        }
    }

    deleteCurrentSelection(): void {
        if (StateManager.activeWire) {
            StateManager.activeWire.destroy();
            StateManager.activeWire = null;
        }

        if (StateManager.selectedPlaceable) {
            StateManager.selectedPlaceable.destroy();
            StateManager.selectedPlaceable = null;
        }
    }
}

export const stateManager = new StateManager();