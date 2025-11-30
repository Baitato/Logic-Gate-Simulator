import { Graphics } from "pixi.js";
import { ConnectionPoint } from './ConnectionPoint';
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { StateManager } from "../state/StateManager";
import { Placeable } from "./Placeable";
import { simulationService } from "../core/simulator/SimulationService";
import { Value } from "../core/simulator/FunctionalGate";
import { wireState } from "../core/instances";
import { CYAN } from "../utils/constants";

export class Wire extends Graphics {
    targetPoint: ConnectionPoint;
    sourcePoint: ConnectionPoint;
    source: Placeable;
    target: Placeable;
    wireId!: number;

    private value: Value;

    constructor(sourcePoint: ConnectionPoint, targetPoint: ConnectionPoint, id?: number) {
        super();
        this.zIndex = -Infinity;
        this.sourcePoint = sourcePoint;
        this.targetPoint = targetPoint;

        this.cursor = "pointer";
        this.eventMode = "static";

        this.setWireId(id);

        if (sourcePoint.type === ConnectionPointType.INPUT) {
            [this.sourcePoint, this.targetPoint] = [this.targetPoint, this.sourcePoint];
        }

        this.drawLine(0xffffff);

        this.source = this.sourcePoint.parentPlaceable;
        this.target = this.targetPoint.parentPlaceable;

        StateManager.wireById.set(this.wireId, this);

        simulationService.addEdge(this);
        this.render();

        this.on("pointerdown", (event) => wireState.onSelect(event, this));
    }

    public destroy(): void {
        this.targetPoint.wires.delete(this);
        this.sourcePoint.wires.delete(this);

        simulationService.deleteEdge(this);

        StateManager.wireById.delete(this.wireId);
        super.destroy();
    }

    public exportAsString(): string {
        return `wire,${this.sourcePoint.parentPlaceable.placeableId},${this.sourcePoint.index},${this.targetPoint.parentPlaceable.placeableId},${this.targetPoint.index},${this.wireId}`;
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

    public drawLine(color: number): void {
        const sourcePos = this.sourcePoint.getViewportPosition();
        const targetPos = this.targetPoint.getViewportPosition();

        this.position.set(0, 0);

        if (wireState.selected === this) {
            color = CYAN;
        }

        this.moveTo(sourcePos.x, sourcePos.y)
            .lineTo(targetPos.x, targetPos.y)
            .stroke({ color: color, width: 2 });
    }

    private setWireId(id?: number): void {
        if (StateManager.wireById.has(this.wireId)) {
            console.warn(`Wire ID ${this.wireId} is already in use.`);
            this.wireId = -1;
            return;
        }

        if (id === undefined) {
            this.wireId = StateManager.wireIdCounter++;
            StateManager.wireById.set(this.wireId, this);
        } else {
            this.wireId = id;
            StateManager.wireById.set(id, this);
            StateManager.wireIdCounter = Math.max(StateManager.wireIdCounter, id + 1);
        }
    }

}