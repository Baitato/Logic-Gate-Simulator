import { app } from "./app";
import { Graphics } from "pixi.js";
import { viewport } from "./viewport";
import { cellSize } from "../utils/constants";

const grid = new Graphics();

function scaleToZero(scale: number): number {
    const minScale = 0.25;
    const maxScale = 1.0;

    scale = Math.max(minScale, Math.min(maxScale, scale));

    return (scale - minScale) / (maxScale - minScale);
}

function drawGrid(): void {
    grid.clear();

    const startX = Math.floor(viewport.left / cellSize) * cellSize;
    const startY = Math.floor(viewport.top / cellSize) * cellSize;

    for (let x = startX; x < viewport.right; x += cellSize) {
        grid.moveTo(x, viewport.top);
        grid.lineTo(x, viewport.bottom);
    }

    for (let y = startY; y < viewport.bottom; y += cellSize) {
        grid.moveTo(viewport.left, y);
        grid.lineTo(viewport.right, y);
    }

    grid.stroke({
        pixelLine: true,
        color: 0xa3a3a3,
        alpha: scaleToZero(viewport.scale.x),
    });
}

app.ticker.add(() => {
    drawGrid();
});

export { grid };
