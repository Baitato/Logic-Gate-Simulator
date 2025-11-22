import { Sprite } from "pixi.js";
import { loadSprite } from "../../utils/assetLoader";
import { placeableDimensions } from "../../utils/constants";
import { Coordinate } from "../../types/ICoordinate";
import { ConnectionPoint } from "../ConnectionPoint";
import { RotationHandler } from "./RotationHandler";
import { StateManager } from "../../state/StateManager";
import { destroy } from "../../services/viewport/positionService";
import { Placeable } from "../Placeable";
import { PlaceableType } from '../../enums/PlaceableType';

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
        this.x = x;
        this.y = y;
        this.eventMode = "static";

        this.type = type;
        this.placeableId = StateManager.gateIdCounter++;
        StateManager.gateById.set(this.placeableId, this);
        this.on("pointerdown", (event) => this.onSelect(event, this.rotationHandler));
    }

    public override destroy() {
        StateManager.gateById.delete(this.placeableId);
        
        if (StateManager.selectedPlaceable === this) {
            StateManager.selectedPlaceable = null;
        }
        
        destroy(this.x, this.y);
        super.destroy({ children: true });
    }

    public select() {
        StateManager.selectedPlaceable = this;
        this.addChild(this.rotationHandler);
    }

    protected override async setUp(assetName: string): Promise<void> {
        const sprite = await loadSprite(assetName, placeableDimensions);
        this.offSprite = sprite;
        this.addChild(sprite);
        this.addConnectionPoints();
    }
}