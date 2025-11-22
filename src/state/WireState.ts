import { FederatedPointerEvent } from "pixi.js";
import { Wire } from "../models/Wire";

class WireState {
    selected: Wire | null = null;

    public onSelect(event: FederatedPointerEvent, wire: Wire) {
        event.stopPropagation();
        this.unselect();

        this.select(wire);
    }

    public select(wire: Wire) {
        this.selected = wire;
    }

    public unselect() {
        if(this.selected == null)
            return;

        this.selected = null;
    }

    public delete() {
        if(this.selected == null)
            return;

        this.selected.destroy();
        this.selected = null;
    }
}

export const wireState = new WireState();