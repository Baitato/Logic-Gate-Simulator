import { Container, DestroyOptions, Sprite } from "pixi.js";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { ConnectionPoint } from './ConnectionPoint';
import { Coordinate } from "../types/ICoordinate";
import { StateManager } from "../state/StateManager";
import { PlaceableType } from "../enums/PlaceableType";
import { createSprite } from "../utils/assetLoader";
import { placeableDimensions } from "../utils/constants";
import { PlaceableState } from "../state/PlaceableState";
import { SimulationService } from "../core/simulator/SimulationService";
import PositionService from "../services/viewport/PositionService";

export abstract class Placeable extends Container {
    protected placeableState!: PlaceableState;
    protected simulationService!: SimulationService;

    abstract type: PlaceableType;
    abstract outputPoints: ConnectionPoint[];
    abstract inputPoints: ConnectionPoint[];

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];
    public abstract exportAsString(offsetX?: number, offsetY?: number): string;

    offSprite?: Sprite;
    placeableId!: number;
    connectionPointMap: Map<number, ConnectionPoint> = new Map<number, ConnectionPoint>();

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.eventMode = "static";

    }

    public setRotation(rotation: number): this {
        this.rotation = rotation;
        return this;
    }

    public setUp(assetName: string): Placeable {
        this.placeableState = PlaceableState.getInstance();
        this.simulationService = SimulationService.getInstance();

        this.offSprite = createSprite(assetName, placeableDimensions);
        this.addChild(this.offSprite);
        this.addConnectionPoints();

        return this;
    }

    public savePlaceable(): void {
        this.on("pointerup", (event) => this.placeableState.onSelect(event, this));
        this.setPlaceableId();
        PositionService.save(this.x, this.y, this);
    }

    private setPlaceableId(): void {
        this.placeableId = StateManager.generatePlaceableId();
        StateManager.placeableById.set(this.placeableId, this);
    }

    public destroy(options?: DestroyOptions): void {
        if (this.placeableState.selected === this) {
            this.placeableState.selected = null;
        }

        this.inputPoints.forEach((point) => point.destroy());
        this.outputPoints.forEach((point) => point.destroy());

        // Only clean up if the placeable was saved (has an ID)
        if (this.placeableId !== undefined) {
            PositionService.destroy(this.x, this.y);
            StateManager.placeableById.delete(this.placeableId);
        }

        super.destroy(options);
    }

    public getAllConnectionPoints(): ConnectionPoint[] {
        return [...this.inputPoints, ...this.outputPoints];
    }

    public getConnectionPoint(index: number): ConnectionPoint {
        return this.connectionPointMap.get(index)!;
    }

    public renderWires(): void {
        this.inputPoints.forEach((inputPoint) => inputPoint.renderWire());
        this.outputPoints.forEach((outputPoint) => outputPoint.renderWire());
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