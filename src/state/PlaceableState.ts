import { FederatedPointerEvent } from "pixi.js";
import type { Clock } from "../models/Clock";
import { SimulationService } from "../core/simulator/SimulationService";
import { ClockTickRateMenu } from "../tools/ClockTickRateMenu";
import { PlaceableType } from "../enums/PlaceableType";
import { RotationHandler } from "../models/logic-gate/RotationHandler";
import type { Placeable } from "../models/Placeable";

export class PlaceableState {
    static #instance: PlaceableState;
    selected: Placeable | null = null;
    private simulationService: SimulationService;
    private rotationHandler: RotationHandler;
    private tickRateMenu: ClockTickRateMenu;

    private constructor(simulationService: SimulationService, rotationHandler: RotationHandler, tickRateMenu: ClockTickRateMenu) {
        this.simulationService = simulationService;
        this.rotationHandler = rotationHandler;
        this.tickRateMenu = tickRateMenu;
    }

    public static async getInstance(): Promise<PlaceableState> {
        if (!this.#instance) {
            const simulationService = await SimulationService.getInstance();
            const rotationHandler = await RotationHandler.getInstance();
            const tickRateMenu = await ClockTickRateMenu.getInstance();
            this.#instance = new PlaceableState(simulationService, rotationHandler, tickRateMenu);
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

        this.rotationHandler.cleanUp();

        const placeable = this.selected;
        if (placeable.type === PlaceableType.CLOCK) {
            this.tickRateMenu.visible = false;
            (placeable as Clock).setTickRate(this.simulationService.gates, this.tickRateMenu.getValue());
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
