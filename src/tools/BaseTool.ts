import { Sprite } from "pixi.js";
import { loadTexture } from "../utils/assetLoader";


export class BaseTool extends Sprite {
    constructor(texture: string) {
        super();
        this.eventMode = "static";   
        this.setTexture(texture);
    }

    setTexture(texture: string) { 
        loadTexture(texture).then((texture) => {
            this.texture = texture;
        });
    }
}