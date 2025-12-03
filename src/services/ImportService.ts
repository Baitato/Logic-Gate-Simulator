import { viewport } from "../core/instances";
import { PlaceableType } from "../enums/PlaceableType";
import { PlaceableObjectFactory } from "../factory/PlaceableObjectFactory";
import { ConnectionPoint } from "../models/ConnectionPoint";
import { Placeable } from "../models/Placeable";
import { Wire } from "../models/Wire";
import { StateManager } from "../state/StateManager";
import { save } from "./viewport/positionService";

export class ImportService {
    public async import(lines: string[]): Promise<void> {
        const idMapping = await this.firstPass(lines);
        this.secondPass(lines, idMapping);
    }

    private async firstPass(lines: string[]): Promise<Map<number, number>> {
        const idMapping: Map<number, number> = new Map<number, number>();

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

            if (placeable)
                this.createPlaceable(placeable);
            if (id)
                idMapping.set(id, placeable!.placeableId);
        }

        return idMapping;
    }

    private secondPass(lines: string[], idMapping: Map<number, number>): void {
        for (const line of lines) {
            const trimmpedLine = line.trim();
            if (trimmpedLine.length === 0) continue;

            const fields = trimmpedLine.split(',');

            const type = fields[0]
            if (type === "wire") {
                const fromId = idMapping.get(parseInt(fields[1]));
                const fromIndex = parseInt(fields[2]);
                const toId = idMapping.get(parseInt(fields[3]));
                const toIndex = parseInt(fields[4]);
                const id = parseInt(fields[5]);

                const fromPoint: ConnectionPoint = StateManager.placeableById.get(fromId!)!.getConnectionPoint(fromIndex);
                const toPoint: ConnectionPoint = StateManager.placeableById.get(toId!)!.getConnectionPoint(toIndex);

                this.createWire(new Wire(fromPoint, toPoint, id));
            }
        }
    }

    private createPlaceable(placeable: Placeable) {
        viewport.addChild(placeable);
        save(placeable.x, placeable.y, placeable);
    }

    private createWire(wire: Wire) {
        viewport.addChild(wire);
        wire.sourcePoint.addWire(wire);
        wire.targetPoint.addWire(wire);
        wire.render();
    }
}