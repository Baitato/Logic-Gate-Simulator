import { ViewportWrapper } from "../core/ViewportWrapper";
import { PlaceableType } from "../enums/PlaceableType";
import { PlaceableObjectFactory } from "../factory/PlaceableObjectFactory";
import { ConnectionPoint } from "../models/ConnectionPoint";
import { Placeable } from "../models/Placeable";
import { Wire } from "../models/Wire";

export class ImportService {
    static #instance: ImportService;

    private wires: Wire[] = [];
    private placeables: Placeable[] = [];
    private viewport: ViewportWrapper;

    private constructor(viewport: ViewportWrapper) {
        this.viewport = viewport;
    }

    public static async getInstance(): Promise<ImportService> {
        if (!this.#instance) {
            this.#instance = new ImportService(await ViewportWrapper.getInstance());
        }
        return this.#instance;
    }

    public async import(lines: string[], save: boolean = true): Promise<void> {
        this.wires = [];
        this.placeables = [];

        const placeableMap = await this.firstPass(lines, save);
        this.secondPass(lines, placeableMap);
    }

    private async firstPass(lines: string[], save: boolean): Promise<Map<number, Placeable>> {
        const placeableMap: Map<number, Placeable> = new Map<number, Placeable>();

        for (const line of lines) {
            const trimmpedLine = line.trim();
            if (trimmpedLine.length === 0) continue;

            const fields = trimmpedLine.split(',');

            let placeable: Placeable | undefined = undefined;
            let id: number | undefined = undefined;

            const type = fields[0]
            if (type === PlaceableType.SWITCH) {
                const x = parseFloat(fields[1]);
                const y = parseFloat(fields[2]);
                const rotation = parseFloat(fields[3]);
                const isOn = fields[4] === "true";
                id = parseInt(fields[5]);

                placeable = await PlaceableObjectFactory.createSwitch(x, y, rotation, isOn);
            } else if (type === PlaceableType.BULB) {
                const x = parseFloat(fields[1]);
                const y = parseFloat(fields[2]);
                const rotation = parseFloat(fields[3]);
                id = parseInt(fields[4]);

                placeable = await PlaceableObjectFactory.createBulb(x, y, rotation);
            } else if (type === PlaceableType.CLOCK) {
                const x = parseFloat(fields[1]);
                const y = parseFloat(fields[2]);
                const rotation = parseFloat(fields[3]);
                const tickRate = parseInt(fields[4]);
                id = parseInt(fields[5]);

                placeable = await PlaceableObjectFactory.createClock(x, y, tickRate, rotation);
            }
            else if (type != "wire") {
                const x = parseFloat(fields[1]);
                const y = parseFloat(fields[2]);
                const rotation = parseFloat(fields[3]);
                id = parseInt(fields[4]);

                placeable = await PlaceableObjectFactory.createGate(x, y, type as PlaceableType, rotation);
            }

            if (!placeable || !id) continue;

            this.placeables.push(placeable);

            placeableMap.set(id, placeable);

            this.viewport.addChild(placeable);

            if (save)
                this.save(placeable);
        }

        return placeableMap;
    }

    private secondPass(lines: string[], placeableMap: Map<number, Placeable>): void {
        for (const line of lines) {
            const trimmpedLine = line.trim();
            if (trimmpedLine.length === 0) continue;

            const fields = trimmpedLine.split(',');

            const type = fields[0]
            if (type === "wire") {
                const fromId = parseInt(fields[1]);
                const fromIndex = parseInt(fields[2]);
                const toId = parseInt(fields[3]);
                const toIndex = parseInt(fields[4]);

                const fromPoint: ConnectionPoint = placeableMap.get(fromId!)!.getConnectionPoint(fromIndex);
                const toPoint: ConnectionPoint = placeableMap.get(toId!)!.getConnectionPoint(toIndex);

                const wire = new Wire(fromPoint, toPoint, this.viewport);
                this.wires.push(wire);
                this.createWire(wire);
            }
        }
    }

    public getWires(): Wire[] {
        return this.wires;
    }

    public getPlaceables(): Placeable[] {
        return this.placeables;
    }

    private save(placeable: Placeable) {
        placeable.savePlaceable();
    }

    private createWire(wire: Wire) {
        this.viewport.addChild(wire);
        wire.sourcePoint.addWire(wire);
        wire.targetPoint.addWire(wire);
        wire.render();
        wire.saveWire();
    }
}