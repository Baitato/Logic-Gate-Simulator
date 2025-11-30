import { viewport } from "../core/instances";
import { AssetName } from "../enums/AssetName";
import { PlaceableType } from "../enums/PlaceableType";
import { PlaceableObjectFactory } from "../factory/PlaceableObjectFactory";
import { Gate } from "../models/logic-gate/Gate";
import { Placeable } from "../models/Placeable";
import { Switch } from "../models/Switch";
import { clearAll, save } from "../services/viewport/positionService";
import { StateManager } from "../state/StateManager";
import { Wire } from '../models/Wire';
import { ConnectionPoint } from "../models/ConnectionPoint";
import { MiscTool } from "./MiscTool";
import { Bulb } from "../models/Bulb";
import { Clock } from "../models/Clock";


export class ImportTool extends MiscTool {
    constructor(assetName: AssetName) {
        super(assetName);
    }

    public async onClick(): Promise<void> {
        document.getElementById("fileInput")?.click();

        const fileInput = document.getElementById("fileInput") as HTMLInputElement;

        fileInput.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsText(file);

                reader.onload = async (e) => {
                    const content = e.target?.result as string;

                    const lines = content.split('\n');

                    await this.firstPass(lines);
                    this.secondPass(lines);
                };
                clearAll();
            }
        });
    }

    private async firstPass(lines: string[]): Promise<void> {
        for (const line of lines) {
            const trimmpedLine = line.trim();
            if (trimmpedLine.length === 0) continue;

            const fields = trimmpedLine.split(',');

            const type = fields[0]
            if (type === PlaceableType.SWITCH) {
                const x = parseFloat(fields[1]);
                const y = parseFloat(fields[2]);
                const rotation = parseFloat(fields[3]);
                const isOn = fields[4] === "true";

                const sw: Switch = await PlaceableObjectFactory.createSwitch(x, y, rotation, isOn);
                this.createPlaceable(sw);
            } else if (type === PlaceableType.BULB) {
                const x = parseFloat(fields[1]);
                const y = parseFloat(fields[2]);
                const rotation = parseFloat(fields[3]);
                const id = parseInt(fields[4]);

                const bulb: Bulb = await PlaceableObjectFactory.createBulb(x, y, rotation, id);
                this.createPlaceable(bulb);
            } else if (type === PlaceableType.CLOCK) {
                const x = parseFloat(fields[1]);
                const y = parseFloat(fields[2]);
                const rotation = parseFloat(fields[3]);
                const tickRate = parseInt(fields[4]);
                const id = parseInt(fields[5]);

                const clock: Clock = await PlaceableObjectFactory.createClock(x, y, tickRate, rotation, id);
                this.createPlaceable(clock);
            }
            else if (type != "wire") {
                const x = parseFloat(fields[1]);
                const y = parseFloat(fields[2]);
                const rotation = parseFloat(fields[3]);
                const id = parseInt(fields[4]);

                const gate: Gate = await PlaceableObjectFactory.createGate(x, y, type as PlaceableType, rotation, id);
                this.createPlaceable(gate);
            }
        }
    }

    private secondPass(lines: string[]): void {
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
                const id = parseInt(fields[5]);

                const fromPoint: ConnectionPoint = StateManager.placeableById.get(fromId)!.getConnectionPoint(fromIndex);
                const toPoint: ConnectionPoint = StateManager.placeableById.get(toId)!.getConnectionPoint(toIndex);

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