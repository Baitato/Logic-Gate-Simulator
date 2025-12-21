import { Graphics } from "pixi.js";
import { cellSize } from "../utils/constants";
import { ViewportWrapper } from "./ViewportWrapper";
import { ApplicationWrapper } from "./ApplicationWrapper";

export class Grid extends Graphics {
    private viewport!: ViewportWrapper;
    private app!: ApplicationWrapper;
    static #instance: Grid;
    static #initialized = false;

    private constructor() {
        super();
        this.isRenderGroup = true;
        this.zIndex = -Infinity;
    }

    static async init(): Promise<void> {
        if (this.#initialized) return;
        this.#instance = new Grid();
        this.#instance.setup();
        this.#initialized = true;
    }

    static getInstance(): Grid {
        if (!this.#instance) {
            throw new Error('Grid not initialized. Call init() first.');
        }
        return this.#instance;
    }

    private setup(): void {
        this.viewport = ViewportWrapper.getInstance();
        this.app = ApplicationWrapper.getInstance();
        this.app.ticker.add(() => {
            this.drawGrid();
        });
    }

    private scaleToZero(scale: number): number {
        const minScale = 0.25;
        const maxScale = 1.0;

        scale = Math.max(minScale, Math.min(maxScale, scale));

        return (scale - minScale) / (maxScale - minScale);
    }

    private drawGrid(): void {
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