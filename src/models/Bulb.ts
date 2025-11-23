import { Sprite } from "pixi.js";
import { PlaceableType } from "../enums/PlaceableType";
import { Placeable } from "./Placeable";
import { RotationHandler } from "./logic-gate/RotationHandler";
import { ConnectionPoint } from "./ConnectionPoint";
import { StateManager } from "../state/StateManager";
import { placeableState } from "../state/PlaceableState";
import { Coordinate } from "../types/ICoordinate";
import { loadSprite } from "../utils/assetLoader";
import { Value } from "../core/simulator/FunctionalGate";
import { Dimension } from "../types/IDimension";

const dimensions: Dimension = { x: 50, y: 50 };

export class Bulb extends Placeable {
    type: PlaceableType = PlaceableType.BULB;
    placeableId: number;
    static assetName: string = "light-off";
    static onAssetName: string = "light-on";
    rotationHandler: RotationHandler = new RotationHandler(this);
    offSprite?: Sprite | undefined;
    onSprite?: Sprite | undefined;
    inputPoints: ConnectionPoint[] = [];
    outputPoints: ConnectionPoint[] = [];

    constructor(x: number, y: number) {
        super(x, y);

        this.setUp(Bulb.assetName);

        this.placeableId = StateManager.gateIdCounter++;
        StateManager.gateById.set(this.placeableId, this);

        this.on("pointerdown", (event) => placeableState.onSelect(event, this, this.rotationHandler));
    }

    protected override getInputPoints(): Coordinate[] {
        return [{ x: 0, y: 25 }];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [];
    }

    protected override async setUp(assetName: string): Promise<void> {
        this.offSprite = await loadSprite(assetName, dimensions);
        this.onSprite = await loadSprite(Bulb.onAssetName, dimensions);
        this.addChild(this.offSprite);
        this.addChild(this.onSprite);
        this.onSprite.visible = false;

        this.addConnectionPoints();
    }

    public switch(value: Value): void {
        if (value === 1) {
            this.onSprite!.visible = true;
            this.offSprite!.visible = false;
        } else {
            this.onSprite!.visible = false;
            this.offSprite!.visible = true;
        }
    }
}