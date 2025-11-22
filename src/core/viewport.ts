import { Viewport } from "pixi-viewport";
import { Application } from "pixi.js";
import { app } from "./app";

const worldWidth: number = 10000;
const worldHeight: number = 10000;

export class MyViewport extends Viewport {
    public app: Application;

    constructor(app: Application) {
        super({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: worldWidth,
            worldHeight: worldHeight,
            events: app.renderer.events,
        });

        this.app = app;

        window.addEventListener("resize", () => this.handleResize());
        document.addEventListener("keydown", (event) => this.onSpaceKeyDown(event));

        this.handleResize();
        this.resetViewport();
        this.drag().pinch().wheel().decelerate();
    }

    resetViewport(): void {
        this.moveCenter(0, 0);
        this.setZoom(1.25, true);
    }

    handleResize(): void {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
    }

    onSpaceKeyDown(event: KeyboardEvent): void {
        if (event.code === "Space") {
            this.resetViewport();
        }
    }

}

export const viewport = new MyViewport(app);