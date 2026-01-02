import { FederatedPointerEvent } from "pixi.js";
import type { Wire } from "../models/Wire";

export class WireState {
    static #instance: WireState;
    selected: Wire | null = null;

    public static getInstance(): WireState {
        if(!this.#instance) {
            this.#instance = new WireState();
        }
        return this.#instance;
    }

    public onSelect(event: FederatedPointerEvent, wire: Wire) {
        event.stopPropagation();
        this.unselect();

        this.select(wire);
    }

    public select(wire: Wire) {
        this.selected = wire;
    }

    public unselect() {
        if (this.selected == null)
            return;

        this.selected = null;
    }

    public delete() {
        if (this.selected == null)
            return;

        this.selected.destroy();
        this.selected = null;
    }
}