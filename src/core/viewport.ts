import { Viewport } from "pixi-viewport";
import { app } from "./app";
import { worldWidth, worldHeight } from "../utils/constants";

const viewport: Viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: worldWidth,
    worldHeight: worldHeight,
    events: app.renderer.events,
});

function resetViewport(): void {
    viewport.moveCenter(0, 0);
    viewport.setZoom(1, true);
}

function handleResize(): void {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    viewport.screenWidth = window.innerWidth;
    viewport.screenHeight = window.innerHeight;
}

function onSpaceKeyDown(event: KeyboardEvent): void {
    if (event.code === "Space") {
        resetViewport();
    }
}

function initialize(): void {
    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", onSpaceKeyDown);

    handleResize();
    resetViewport();
    viewport.drag().pinch().wheel().decelerate();
}

initialize();

export { viewport };
