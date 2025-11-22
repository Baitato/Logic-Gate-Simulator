import { FederatedPointerEvent } from "pixi.js";
import { RotationHandler } from "../models/logic-gate/RotationHandler";
import { Placeable } from "../models/Placeable";

class PlaceableState {
    selected: Placeable | null = null;

    public onSelect(event: FederatedPointerEvent, placeable: Placeable, rotationHandler: RotationHandler) {
        event.stopPropagation();
        this.unselect();

        this.select(placeable, rotationHandler);
    }

    public select(placeable: Placeable, rotationHandler: RotationHandler) {
        this.selected = placeable;
        this.selected.addChild(rotationHandler);
        this.selected.addSelectionBox();
    }

    public unselect() {
        if (this.selected == null)
            return;

        this.selected.removeSelectionBox();
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

export const placeableState = new PlaceableState();
