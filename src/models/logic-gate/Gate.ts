import { Sprite } from "pixi.js";
import { loadSprite } from "../../utils/assetLoader";
import { placeableDimensions } from "../../utils/constants";
import { Coordinate } from "../../types/ICoordinate";
import { ConnectionPoint } from "../ConnectionPoint";
import { RotationHandler } from "./RotationHandler";
import { StateManager } from "../../state/StateManager";
import { destroy } from "../../services/viewport/positionService";
import { Placeable } from "../Placeable";

export abstract class Gate extends Placeable {
    offSprite?: Sprite;
    rotationHandler: RotationHandler = new RotationHandler(this);
    outputPoints: ConnectionPoint[] = [];
    inputPoints: ConnectionPoint[] = [];

    protected abstract getInputPoints(): Coordinate[];
    protected abstract getOutputPoints(): Coordinate[];

    constructor(x: number, y: number) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.eventMode = "static";
        this.on("pointerdown", (event) => this.onSelect(event, this.rotationHandler));
    }

    public override destroy() {
        destroy(this.x, this.y);

        if (StateManager.selectedPlaceable === this) {
            StateManager.selectedPlaceable = null;
        }

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