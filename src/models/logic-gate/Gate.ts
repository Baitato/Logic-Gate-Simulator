import { Container, Sprite } from "pixi.js";
import { loadSprite } from "../../utils/assetLoader";
import { gateMap } from "../../utils/constants";
import { GateType } from "../../enums/GateType";
import { Dimension } from "../../types/IDimension";

const spriteDimensions: Dimension = { x: 50, y: 50 };

export abstract class Gate extends Container {
    static selectedGate: Gate | null = null;
    sprite?: Sprite;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    protected async setUpGate(assetName: string): Promise<void> {
        const sprite = await loadSprite(assetName, spriteDimensions);
        this.sprite = sprite;
        this.addChild(sprite);
    }

    protected onClick(): void {
        if (Gate.selectedGate && Gate.selectedGate !== this) {
            Gate.selectedGate = this;
        }
    }

    public static create(x: number, y: number, type: GateType): Gate {
        return new gateMap[type](x, y);
    }
}