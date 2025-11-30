import { Container, DestroyOptions, Sprite } from "pixi.js";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { ConnectionPoint } from './ConnectionPoint';
import { Coordinate } from "../types/ICoordinate";
import { RotationHandler } from './logic-gate/RotationHandler';
import { StateManager } from "../state/StateManager";
import { PlaceableType } from "../enums/PlaceableType";
import { destroy } from "../services/viewport/positionService";
import { placeableState } from "../core/instances";
import { loadSprite } from "../utils/assetLoader";
import { placeableDimensions } from "../utils/constants";

export abstract class Placeable extends Container {
    abstract type: PlaceableType;
    abstract outputPoints: ConnectionPoint[];
    abstract inputPoints: ConnectionPoint[];
    abstract rotationHandler: RotationHandler;

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];
    public abstract exportAsString(): string;

    offSprite?: Sprite;
    placeableId!: number;
    connectionPointMap: Map<number, ConnectionPoint> = new Map<number, ConnectionPoint>();

    constructor(x: number, y: number, rotation: number = 0, id?: number) {
        super();
        this.x = x;
        this.y = y;
        this.rotation = rotation
        this.setPlaceableId(id);
        this.eventMode = "static";
    }

    public async setUp(assetName: string): Promise<Placeable> {
        this.offSprite = await loadSprite(assetName, placeableDimensions);
        this.addChild(this.offSprite);
        this.addConnectionPoints();

        return this;
    }

    private setPlaceableId(id?: number): void {
        if (StateManager.placeableById.has(this.placeableId)) {
            console.warn(`Placeable ID ${this.placeableId} is already in use.`);
            this.placeableId = -1;
            return;
        }

        if (id === undefined) {
            this.placeableId = StateManager.placeableIdCounter++;
            StateManager.placeableById.set(this.placeableId, this);
        } else {
            this.placeableId = id;
            StateManager.placeableById.set(id, this);
            StateManager.placeableIdCounter = Math.max(StateManager.placeableIdCounter, id + 1);
        }
    }

    public destroy(options?: DestroyOptions): void {
        if (placeableState.selected === this) {
            placeableState.selected = null;
        }

        this.inputPoints.forEach((point) => point.destroy());
        this.outputPoints.forEach((point) => point.destroy());

        destroy(this.x, this.y);
        StateManager.placeableById.delete(this.placeableId);
        super.destroy(options);
    }

    public getConnectionPoint(index: number): ConnectionPoint {
        return this.connectionPointMap.get(index)!;
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

    protected addConnectionPointsToGate(type: ConnectionPointType, points: Coordinate[], count: number[]): void {
        points.forEach((point) => {
            const ind = count[0]++;
            const connectionPoint = new ConnectionPoint(type, point, this, ind);
            this.connectionPointMap.set(ind, connectionPoint);

            if (type == ConnectionPointType.INPUT)
                this.inputPoints.push(connectionPoint);
            else
                this.outputPoints.push(connectionPoint);

            this.addChild(connectionPoint);
        })
    }
}