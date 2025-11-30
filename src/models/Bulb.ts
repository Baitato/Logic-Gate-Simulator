import { Sprite } from "pixi.js";
import { PlaceableType } from "../enums/PlaceableType";
import { Placeable } from "./Placeable";
import { RotationHandler } from "./logic-gate/RotationHandler";
import { ConnectionPoint } from "./ConnectionPoint";
import { placeableState } from "../core/instances";
import { Coordinate } from "../types/ICoordinate";
import { loadSprite } from "../utils/assetLoader";
import { Value } from "../core/simulator/FunctionalGate";
import { Dimension } from "../types/IDimension";
import { AssetName } from "../enums/AssetName";

const dimensions: Dimension = { x: 50, y: 50 };

export class Bulb extends Placeable {
    type: PlaceableType = PlaceableType.BULB;
    static assetName: string = AssetName.BULB_OFF;
    static onAssetName: string = AssetName.BULB_ON;
    rotationHandler: RotationHandler = new RotationHandler(this);
    onSprite?: Sprite | undefined;
    inputPoints: ConnectionPoint[] = [];
    outputPoints: ConnectionPoint[] = [];

    constructor(x: number, y: number, rotation: number = 0, id?: number) {
        super(x, y, rotation, id);

        this.on("pointerdown", (event) => placeableState.onSelect(event, this, this.rotationHandler));
    }

    protected override getInputPoints(): Coordinate[] {
        return [{ x: 0, y: 25 }];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [];
    }

    public override async setUp(): Promise<Bulb> {
        super.setUp(Bulb.assetName);

        this.onSprite = await loadSprite(Bulb.onAssetName, dimensions);
        this.addChild(this.onSprite);
        this.onSprite.visible = false;

        this.addConnectionPoints();
        return this;
    }

    public override exportAsString(): string {
        return `${PlaceableType.BULB},${this.x},${this.y},${this.rotation},${this.placeableId}`;
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