import { Sprite } from "pixi.js";
import { loadSprite } from "../../utils/assetLoader";
import { placeableDimensions } from "../../utils/constants";
import { Coordinate } from "../../types/ICoordinate";
import { ConnectionPoint } from "../ConnectionPoint";
import { RotationHandler } from "./RotationHandler";
import { StateManager } from "../../state/StateManager";
import { Placeable } from "../Placeable";
import { PlaceableType } from '../../enums/PlaceableType';
import { placeableState } from "../../state/PlaceableState";

export abstract class Gate extends Placeable {
    offSprite?: Sprite;
    rotationHandler: RotationHandler = new RotationHandler(this);
    outputPoints: ConnectionPoint[] = [];
    inputPoints: ConnectionPoint[] = [];
    type: PlaceableType;
    placeableId: number;

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];

    constructor(x: number, y: number, type: PlaceableType) {
        super(x, y);

        this.type = type;
        this.placeableId = StateManager.gateIdCounter++;
        StateManager.gateById.set(this.placeableId, this);
        this.on("pointerdown", (event) => placeableState.onSelect(event, this, this.rotationHandler));
    }

    protected override async setUp(assetName: string): Promise<void> {
        const sprite = await loadSprite(assetName, placeableDimensions);
        this.offSprite = sprite;
        this.addChild(sprite);
        this.addConnectionPoints();
    }
}