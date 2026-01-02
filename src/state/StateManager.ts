import type { Placeable } from "../models/Placeable";
import type { Wire } from "../models/Wire";
// import { PlaceableState } from "./PlaceableState";
// import { WireState } from "./WireState";

export class StorageManager {
    static #instance: StorageManager;
    static #initialized = false;
    static placeableById: Map<number, Placeable> = new Map<number, Placeable>();
    static wireById: Map<number, Wire> = new Map<number, Wire>();
    static currentTick: number = 0;

    private constructor() {
    }

    public static init(): void {
        if (this.#initialized) return;
        this.#instance = new StorageManager();
        this.#initialized = true;
    }

    public static getInstance(): StorageManager {
        if (!this.#instance) {
            this.init();
        }
        return this.#instance;
    }

    static generatePlaceableId(): number {
        let cur = Math.floor(Math.random() * 0x100000000);

        while (StorageManager.placeableById.has(cur)) {
            cur = Math.floor(Math.random() * 0x100000000);
        }

        return cur;
    }

    static generateWireId(): number {
        let cur = Math.floor(Math.random() * 0x100000000);

        while (StorageManager.wireById.has(cur)) {
            cur = Math.floor(Math.random() * 0x100000000);
        }

        return cur;
    }

}