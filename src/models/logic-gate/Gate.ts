import { Container, Sprite } from "pixi.js";
import { loadSprite } from "../../utils/assetLoader";
import { gateDimensions, gateMap } from "../../utils/constants";
import { GateType } from "../../enums/GateType";
import { Coordinate } from "../../types/ICoordinate";
import { ConnectionPointType } from '../../enums/ConnectionPointType';
import { ConnectionPoint } from "./ConnectionPoint";
import { RotationHandler } from "./RotationHandler";

export abstract class Gate extends Container {
    static selectedGate: Gate | null = null;
    sprite?: Sprite;
    rotationHandler: RotationHandler = new RotationHandler(this);

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.eventMode = "static";
    }

    protected addConnectionPoints(): void {
        this.addConnectionPointsToGate(ConnectionPointType.INPUT, this.getInputPoints());
        this.addConnectionPointsToGate(ConnectionPointType.OUTPUT, this.getOutputPoints());
    }

    private addConnectionPointsToGate(type: ConnectionPointType, points: Coordinate[]): void {
        points.forEach((point) => {
            this.addChild(new ConnectionPoint(type, point));
        })
    }

    protected async setUpGate(assetName: string): Promise<void> {
        const sprite = await loadSprite(assetName, gateDimensions);
        this.sprite = sprite;
        this.addChild(sprite);
        this.addConnectionPoints();
        this.on("pointerdown", () => this.onClick());
    }

    protected onClick(): void {
        if (Gate.selectedGate) {
            Gate.selectedGate.removeChild(Gate.selectedGate.rotationHandler);
        }

        if (Gate.selectedGate && Gate.selectedGate === this) {
            Gate.selectedGate = null;
            return;
        }

        Gate.selectedGate = this;
        this.addChild(this.rotationHandler);
    }

    public static create(x: number, y: number, type: GateType): Gate {
        return new gateMap[type](x, y);
    }
}