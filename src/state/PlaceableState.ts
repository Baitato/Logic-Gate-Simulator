import { FederatedPointerEvent } from "pixi.js";
import { Clock } from "../models/Clock";
import { SimulationService } from "../core/simulator/SimulationService";
import { ClockTickRateMenu } from "../tools/ClockTickRateMenu";
import { PlaceableType } from "../enums/PlaceableType";
import type { RotationHandler } from "../models/logic-gate/RotationHandler";
import type { Placeable } from "../models/Placeable";

export class PlaceableState {
    selected: Placeable | null = null;
    private simulationService: SimulationService;
    private rotationHandler: RotationHandler;
    private tickRateMenu: ClockTickRateMenu;

    public constructor(simulationService: SimulationService, rotationHandler: RotationHandler, tickRateMenu: ClockTickRateMenu) {
        this.simulationService = simulationService;
        this.rotationHandler = rotationHandler;
        this.tickRateMenu = tickRateMenu;
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
        if (placeable instanceof Clock) {
            this.tickRateMenu.visible = false;
            placeable.setTickRate(this.simulationService.gates, this.tickRateMenu.getValue());
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
