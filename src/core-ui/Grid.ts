import { Application, Graphics } from "pixi.js";
import { cellSize } from "../util/constants";
import { Screen } from "./Screen";

export class Grid extends Graphics {

    constructor(world: Screen, app: Application) {
        super();
        this.zIndex = -Infinity;

        app.ticker.add(() => this._drawGrid(world));

        world.addChild(this);
    }

    private _scaleToMinAlpha(scale: number): number {
        const minScale = 0.25;
        const maxScale = 1.0;
        const minAlpha = 0.1;

        scale = Math.max(minScale, Math.min(maxScale, scale));

        return minAlpha + ((scale - minScale) / (maxScale - minScale)) * (1.0 - minAlpha);
    }

    private _drawGrid(world: Screen): void {
        this.clear();

        const startX = Math.floor(world.left / cellSize) * cellSize;
        const startY = Math.floor(world.top / cellSize) * cellSize;

        for (let x = startX; x < world.right; x += cellSize) {
            this.moveTo(x, world.top);
            this.lineTo(x, world.bottom);
        }

        for (let y = startY; y < world.bottom; y += cellSize) {
            this.moveTo(world.left, y);
            this.lineTo(world.right, y);
        }

        this.stroke({
            pixelLine: true,
            color: 0xa3a3a3,
            alpha: this._scaleToMinAlpha(world.scale.x),
        });
    }
}