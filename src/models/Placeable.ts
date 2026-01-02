import { Container, DestroyOptions, Sprite } from "pixi.js";
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { ConnectionPoint } from './ConnectionPoint';
import { Coordinate } from "../types/ICoordinate";
import { PlaceableType } from "../enums/PlaceableType";
import { createSprite } from "../utils/assetLoader";
import { placeableDimensions } from "../utils/constants";
import { SimulationService } from "../core/simulator/SimulationService";
import PositionService from "../services/PositionService";
import { PlaceableListener, PlaceablePublisher } from "../observer/PlaceableObserver";
import { RotationService } from "../services/RotationService";
import { DeletionService } from "../services/DeletionService";
import { ClockTickRateMenu } from "../tools/ClockTickRateMenu";


export abstract class Placeable extends Container implements PlaceablePublisher {
    protected simulationService!: SimulationService;

    protected static placeableListeners: PlaceableListener[] = [];
    public static placeableById: Map<number, Placeable> = new Map<number, Placeable>();
    abstract type: PlaceableType;
    protected outputPoints: ConnectionPoint[] = [];
    protected inputPoints: ConnectionPoint[] = [];

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];
    public abstract exportAsString(offsetX?: number, offsetY?: number): string;

    offSprite?: Sprite;
    placeableId!: number;
    connectionPointMap: Map<number, ConnectionPoint> = new Map<number, ConnectionPoint>();

    constructor(x: number, y: number, assetName: string) {
        super();
        this.x = x;
        this.y = y;
        this.eventMode = "static";
        this.offSprite = createSprite(assetName, placeableDimensions);
        this.simulationService = SimulationService.getInstance();
        this.addChild(this.offSprite);
        this.addConnectionPoints();
        this.addListeners();
    }

    private addListeners(): void {
        this.addPlaceableListener(RotationService.getInstance());
        this.addPlaceableListener(DeletionService.getInstance());
        this.addPlaceableListener(ClockTickRateMenu.getInstance());
    }

    public addPlaceableListener(listener: PlaceableListener): void {
        if (!Placeable.placeableListeners.includes(listener))
            Placeable.placeableListeners.push(listener);
    }

    public setRotation(rotation: number): this {
        this.rotation = rotation;
        return this;
    }

    public savePlaceable(): void {
        this.on("click", () => {
            Placeable.placeableListeners.forEach((listener) => listener.onPlaceableClick(this));
        });

        this.placeableId = Placeable.generatePlaceableId();
        Placeable.placeableById.set(this.placeableId, this);
        PositionService.save(this.x, this.y, this);
    }

    public destroy(options?: DestroyOptions): void {
        this.inputPoints.forEach((point) => point.destroy());
        this.outputPoints.forEach((point) => point.destroy());

        if (this.placeableId !== undefined) {
            PositionService.destroy(this.x, this.y);
            Placeable.placeableById.delete(this.placeableId);
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

    private static generatePlaceableId(): number {
        let cur = Math.floor(Math.random() * 0x100000000);

        while (Placeable.placeableById.has(cur)) {
            cur = Math.floor(Math.random() * 0x100000000);
        }

        return cur;
    }
}