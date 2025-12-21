import { FederatedPointerEvent } from "pixi.js";
import type { Clock } from "../models/Clock";
import { SimulationService } from "../core/simulator/SimulationService";
import { ClockTickRateMenu } from "../tools/ClockTickRateMenu";
import { PlaceableType } from "../enums/PlaceableType";
import { RotationHandler } from "../models/logic-gate/RotationHandler";
import type { Placeable } from "../models/Placeable";

export class PlaceableState {
    static #instance: PlaceableState;
    static #initialized = false;
    selected: Placeable | null = null;
    private simulationService: SimulationService;
    private rotationHandler: RotationHandler;
    private tickRateMenu: ClockTickRateMenu;

    private constructor(simulationService: SimulationService, rotationHandler: RotationHandler, tickRateMenu: ClockTickRateMenu) {
        this.simulationService = simulationService;
        this.rotationHandler = rotationHandler;
        this.tickRateMenu = tickRateMenu;
    }

    public static async init(): Promise<void> {
        if (this.#initialized) return;
        const simulationService = SimulationService.getInstance();
        const rotationHandler = RotationHandler.getInstance();
        const tickRateMenu = ClockTickRateMenu.getInstance();
        this.#instance = new PlaceableState(simulationService, rotationHandler, tickRateMenu);
        this.#initialized = true;
    }

    public static getInstance(): PlaceableState {
        if (!this.#instance) {
            throw new Error('PlaceableState not initialized. Call init() first.');
        }
        return this.#instance;
    }

    public onSelect(event: FederatedPointerEvent, placeable: Placeable) {
        event.stopPropagation();
        this.unselect();

        this.select(placeable);
    }

    public select(placeable: Placeable) {
        this.selected = placeable;
        this.rotationHandler.addRotationHandler(placeable);
        this.selected.addChild(this.rotationHandler);

        if (placeable.type === PlaceableType.CLOCK) {
            this.tickRateMenu.visible = true;
            this.tickRateMenu.setValue((placeable as Clock).getTickRate());
        }
    }

    public unselect() {
        if (this.selected == null)
            return;

        this.rotationHandler.removeRotationHandler();

        const placeable = this.selected;
        if (placeable.type === PlaceableType.CLOCK) {
            this.tickRateMenu.visible = false;
            (placeable as Clock).setTickRate(this.tickRateMenu.getValue(), this.simulationService.gates);
        }

        this.selected.removeChild(this.rotationHandler);
        this.selected = null;
    }

    public delete() {
        if (this.selected == null)
            return;

        this.selected.destroy();
        this.selected = null;
    }
}
