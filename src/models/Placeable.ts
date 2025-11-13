/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container, DestroyOptions, FederatedPointerEvent, Sprite } from "pixi.js";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { ConnectionPoint } from './ConnectionPoint';
import { Coordinate } from "../types/ICoordinate";
import { RotationHandler } from './logic-gate/RotationHandler';
import { stateManager, StateManager } from "../state/StateManager";

export abstract class Placeable extends Container {
    abstract offSprite?: Sprite;
    static type: string;
    abstract outputPoints: ConnectionPoint[];
    abstract inputPoints: ConnectionPoint[];
    abstract rotationHandler: RotationHandler;

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];
    protected abstract setUp(assetName: string): Promise<void>;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    public static create(x: number, y: number, type: string): Placeable {
        throw new Error("Method not implemented.");
    }

    public destroy(options?: DestroyOptions): void {
        super.destroy(options);
    }

    public renderWires() {
        this.inputPoints.forEach((inputPoint) => { inputPoint.renderWire(); });
        this.outputPoints.forEach((outputPoint) => { outputPoint.renderWire(); });
    }

    public select(rotationHandler: RotationHandler) {
        StateManager.selectedPlaceable = this;
        this.addChild(rotationHandler);
    }

    protected onSelect(event: FederatedPointerEvent, rotationHandler: RotationHandler): void {
        event.stopPropagation();  // Prevent bubbling to viewport
        stateManager.unselectPlaceable();

        this.select(rotationHandler);
    }

    protected addConnectionPoints(): void {
        this.addConnectionPointsToGate(ConnectionPointType.INPUT, this.getInputPoints());
        this.addConnectionPointsToGate(ConnectionPointType.OUTPUT, this.getOutputPoints());
    }

    protected addConnectionPointsToGate(type: ConnectionPointType, points: Coordinate[]): void {
        points.forEach((point) => {
            const connectionPoint = new ConnectionPoint(type, point);

            if (type == ConnectionPointType.INPUT) {
                this.inputPoints.push(connectionPoint);
            } else {
                this.outputPoints.push(connectionPoint);
            }

            this.addChild(connectionPoint);
        })
    }
}