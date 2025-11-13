import { Application, Graphics } from "pixi.js";
import { cellSize } from "../utils/constants";
import { MyViewport, viewport } from "./viewport";

export class Grid extends Graphics {
    viewport: MyViewport;
    app: Application;

    constructor(viewport: MyViewport) {
        super();
        this.isRenderGroup = true;
        this.zIndex = -Infinity;
        this.viewport = viewport;
        this.app = viewport.app;

        this.app.ticker.add(() => {
            this.drawGrid();
        });
    }

    scaleToZero(scale: number): number {
        const minScale = 0.25;
        const maxScale = 1.0;

        scale = Math.max(minScale, Math.min(maxScale, scale));

        return (scale - minScale) / (maxScale - minScale);
    }

    drawGrid(): void {
        this.clear();

        const startX = Math.floor(this.viewport.left / cellSize) * cellSize;
        const startY = Math.floor(this.viewport.top / cellSize) * cellSize;

        for (let x = startX; x < this.viewport.right; x += cellSize) {
            this.moveTo(x, this.viewport.top);
            this.lineTo(x, this.viewport.bottom);
        }

        for (let y = startY; y < this.viewport.bottom; y += cellSize) {
            this.moveTo(this.viewport.left, y);
            this.lineTo(this.viewport.right, y);
        }

        this.stroke({
            pixelLine: true,
            color: 0xa3a3a3,
            alpha: this.scaleToZero(this.viewport.scale.x),
        });
    }
}

export const grid = new Grid(viewport);
