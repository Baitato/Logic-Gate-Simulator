import { FederatedPointerEvent } from "pixi.js";
import type { RotationHandler } from "../models/logic-gate/RotationHandler";
import type { Placeable } from "../models/Placeable";
import { Clock } from "../models/Clock";
import { tickRateMenu } from "../core/instances";

export class PlaceableState {
    selected: Placeable | null = null;

    public onSelect(event: FederatedPointerEvent, placeable: Placeable, rotationHandler: RotationHandler) {
        event.stopPropagation();
        this.unselect();

        this.select(placeable, rotationHandler);
    }

    public select(placeable: Placeable, rotationHandler: RotationHandler) {
        this.selected = placeable;
        this.selected.addChild(rotationHandler);

        if (placeable instanceof Clock) {
            tickRateMenu.visible = true;
            tickRateMenu.setValue(placeable.getTickRate());
        }
    }

    public unselect() {
        if (this.selected == null)
            return;

        const placeable = this.selected;
        if (placeable instanceof Clock) {
            tickRateMenu.visible = false;
            placeable.setTickRate(tickRateMenu.getValue());
        }

        this.selected.removeChild(this.selected.rotationHandler);
        this.selected = null;
    }

    public delete() {
        if (this.selected == null)
            return;

        this.selected.destroy();
        this.selected = null;
    }
}
