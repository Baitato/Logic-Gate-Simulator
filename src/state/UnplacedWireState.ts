import type { WireUnplaced } from "../models/WireUnplaced";

export class UnplacedWireState {
    static #instance: UnplacedWireState;
    selected: WireUnplaced | null = null;

    private constructor() { }

    public static getInstance(): UnplacedWireState {
        if (!this.#instance) {
            this.#instance = new UnplacedWireState();
        }
        return this.#instance;
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