import { Wire } from "../models/logic-gate/Wire";

export class BoardState {
    activeWire: Wire | null = null;

    constructor() { }

    setActiveWire(wire: Wire | null): void {
        this.activeWire = wire;
    }

    getActiveWire(): Wire | null {
        return this.activeWire;
    }
}