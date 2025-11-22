import { Graphics } from "pixi.js";
import { ConnectionPoint } from './ConnectionPoint';
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { StateManager } from "../state/StateManager";
import { Placeable } from "./Placeable";
import { simulationService } from "../core/simulator/SimulationService";
import { Value } from "../core/simulator/FunctionalGate";

export class Wire extends Graphics {
    targetPoint: ConnectionPoint;
    sourcePoint: ConnectionPoint;
    source: Placeable;
    target: Placeable;

    wireId: number;

    private value: Value;

    constructor(sourcePoint: ConnectionPoint, targetPoint: ConnectionPoint) {
        super();
        this.zIndex = -Infinity;
        this.sourcePoint = sourcePoint;
        this.targetPoint = targetPoint;
        this.wireId = StateManager.wireIdCounter++;

        if (sourcePoint.type === ConnectionPointType.INPUT) {
            [this.sourcePoint, this.targetPoint] = [this.targetPoint, this.sourcePoint];
        }

        this.drawLine(0xffffff);

        this.source = this.sourcePoint.parentPlaceable;
        this.target = this.targetPoint.parentPlaceable;

        StateManager.wireById.set(this.wireId, this);

        simulationService.addEdge(this);
        this.render();
    }

    public destroy(): void {
        this.targetPoint.wires.delete(this);
        this.sourcePoint.wires.delete(this);

        simulationService.deleteEdge(this);

        StateManager.wireById.delete(this.wireId);
        super.destroy();
    }

    public setValue(value: Value): void {
        this.value = value;
        this.render();
    }

    public getValue(): Value {
        return this.value;
    }

    public render(): void {
        const RED = 0xff0000;
        const GREEN = 0x00ff00;
        const WHITE = 0xffffff;

        let color;

        switch (this.value) {
            case 0:
                color = WHITE;
                break;
            case 1:
                color = GREEN;
                break;
            default:
                color = RED;
        }

        this.clear();
        this.drawLine(color);
    }

    private drawLine(color: number): void {
        const sourcePos = this.sourcePoint.getViewportPosition();
        const targetPos = this.targetPoint.getViewportPosition();

        this.position.set(0, 0);
        this.moveTo(sourcePos.x, sourcePos.y)
            .lineTo(targetPos.x, targetPos.y)
            .stroke({ color: color, width: 2 });
    }
}