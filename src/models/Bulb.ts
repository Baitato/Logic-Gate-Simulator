import { Sprite } from "pixi.js";
import { PlaceableType } from "../enums/PlaceableType";
import { Placeable } from "./Placeable";
import { ConnectionPoint } from "./ConnectionPoint";
import { Coordinate } from "../types/ICoordinate";
import { createSprite } from "../utils/assetLoader";
import { Dimension } from "../types/IDimension";
import { AssetName } from "../enums/AssetName";
import { Value } from "../types/IValue";

const dimensions: Dimension = { x: 50, y: 50 };

export class Bulb extends Placeable {
    type: PlaceableType = PlaceableType.BULB;
    static assetName: string = AssetName.BULB_OFF;
    static onAssetName: string = AssetName.BULB_ON;
    onSprite?: Sprite | undefined;
    inputPoints: ConnectionPoint[] = [];
    outputPoints: ConnectionPoint[] = [];

    constructor(x: number, y: number) {
        super(x, y);
    }

    protected override getInputPoints(): Coordinate[] {
        return [{ x: 0, y: 25 }];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [];
    }

    public override setUp(): Bulb {
        super.setUp(Bulb.assetName);

        this.onSprite = createSprite(Bulb.onAssetName, dimensions);
        this.addChild(this.onSprite);
        this.onSprite.visible = false;

        this.addConnectionPoints();
        return this;
    }

    public override exportAsString(offsetX: number = 0, offsetY: number = 0): string {
        return `${PlaceableType.BULB},${this.x + offsetX},${this.y + offsetY},${this.rotation},${this.placeableId}`;
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