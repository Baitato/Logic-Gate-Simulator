import { Sprite } from "pixi.js";
import { loadTexture } from "../utils/assetLoader";
import { Dimension } from "../types/IDimension";

const iconDimensions: Dimension = { x: 50, y: 50 };

export class BaseTool extends Sprite {
    constructor(texture: string) {
        super();

        this.width = iconDimensions.x
        this.height = iconDimensions.y;

        this.cursor = "pointer";
        this.eventMode = "static";
        this.setTexture(texture);
    }

    setTexture(texture: string) {
        loadTexture(texture).then((texture) => {
            this.texture = texture;
        });
    }
}