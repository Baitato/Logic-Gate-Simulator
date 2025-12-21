import { Graphics, Sprite } from "pixi.js";
import { Coordinate } from "../types/ICoordinate";
import { ConnectionPoint } from "./ConnectionPoint";
import { Placeable } from "./Placeable";
import { Dimension } from "../types/IDimension";
import { createSprite } from "../utils/assetLoader";
import { PlaceableType } from "../enums/PlaceableType";
import { AssetName } from "../enums/AssetName";

const dimensions: Dimension = { x: 50, y: 50 };

export class Switch extends Placeable {
    type: PlaceableType = PlaceableType.SWITCH;
    static onAssetName: string = AssetName.SWITCH_ON;
    static assetName: string = AssetName.SWITCH_OFF;
    onSprite?: Sprite | undefined;
    outputPoints: ConnectionPoint[] = [];
    inputPoints: ConnectionPoint[] = [];
    isOn: boolean = false;

    constructor(x: number, y: number) {
        super(x, y);
    }

    public setIsOn(isOn: boolean): Switch {
        this.isOn = isOn;
        this.render();
        return this;
    }

    protected override getInputPoints(): Coordinate[] {
        return [];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }

    public override setUp(): Switch {
        super.setUp(Switch.assetName);

        this.onSprite = createSprite(Switch.onAssetName, dimensions);
        this.addChild(this.onSprite);

        this.render();
        this.addClickableArea();

        return this;
    }

    public override exportAsString(offsetX: number = 0, offsetY: number = 0): string {
        return `${PlaceableType.SWITCH},${this.x + offsetX},${this.y + offsetY},${this.rotation},${this.isOn},${this.placeableId}`;
    }

    private addClickableArea(): void {
        const circle = new Graphics()
            .circle(-5, 0, 11)
            .fill({ color: 0xff0000, alpha: 0 });
        circle.eventMode = "static";
        circle.cursor = "pointer";
        circle.zIndex = 5;
        circle.on("pointerdown", () => this.toggleSwitch());

        this.addChild(circle);
    }

    private toggleSwitch(): void {
        this.isOn = !this.isOn;

        this.render();

        this.simulationService.flipSwitch(this.placeableId);
    }

    private render() {
        if (this.isOn) {
            this.onSprite!.visible = true;
            this.offSprite!.visible = false;
        } else {
            this.onSprite!.visible = false;
            this.offSprite!.visible = true;
        }
    }
}