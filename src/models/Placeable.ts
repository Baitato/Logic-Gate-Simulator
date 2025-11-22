import { Container, DestroyOptions, Graphics, Sprite } from "pixi.js";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { ConnectionPoint } from './ConnectionPoint';
import { Coordinate } from "../types/ICoordinate";
import { RotationHandler } from './logic-gate/RotationHandler';
import { StateManager } from "../state/StateManager";
import { PlaceableType } from "../enums/PlaceableType";
import { destroy } from "../services/viewport/positionService";
import { placeableState } from "../state/PlaceableState";
import { CYAN, placeableDimensions } from "../utils/constants";

export abstract class Placeable extends Container {
    abstract offSprite?: Sprite;
    abstract type: PlaceableType;
    abstract placeableId: number;
    abstract outputPoints: ConnectionPoint[];
    abstract inputPoints: ConnectionPoint[];
    abstract rotationHandler: RotationHandler;
    protected selectionBox = new Graphics().rect(0, 0, placeableDimensions.x, placeableDimensions.y).stroke({ color: CYAN, width: 2 });

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];
    protected abstract setUp(assetName: string): Promise<void>;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.eventMode = "static";
    }

    public destroy(options?: DestroyOptions): void {
        if (placeableState.selected === this) {
            placeableState.selected = null;
        }

        this.inputPoints.forEach((point) => point.destroy());
        this.outputPoints.forEach((point) => point.destroy());

        destroy(this.x, this.y);
        StateManager.gateById.delete(this.placeableId);
        super.destroy(options);
    }

    public renderWires() {
        this.inputPoints.forEach((inputPoint) => { inputPoint.renderWire(); });
        this.outputPoints.forEach((outputPoint) => { outputPoint.renderWire(); });
    }

    protected addConnectionPoints(): void {
        const count = [0];
        this.addConnectionPointsToGate(ConnectionPointType.INPUT, this.getInputPoints(), count);
        this.addConnectionPointsToGate(ConnectionPointType.OUTPUT, this.getOutputPoints(), count);
    }

    public addSelectionBox(): void {
        this.selectionBox.position.set(-(this.offSprite?.width ?? 0) / 2, -(this.offSprite?.height ?? 0) / 2);
        this.addChild(this.selectionBox);
    }

    public removeSelectionBox(): void {
        this.removeChild(this.selectionBox);
    }

    protected addConnectionPointsToGate(type: ConnectionPointType, points: Coordinate[], count: number[]): void {
        points.forEach((point) => {
            const connectionPoint = new ConnectionPoint(type, point, this, count[0]++);

            if (type == ConnectionPointType.INPUT)
                this.inputPoints.push(connectionPoint);
            else
                this.outputPoints.push(connectionPoint);

            this.addChild(connectionPoint);
        })
    }
}