import { Application } from "pixi.js";

export const app: Application = await (async () => {
    const newApp = new Application();

    await newApp.init({
        background: 0x101012,
        resizeTo: window,
        sharedTicker: true,
        autoStart: true,
    });

    newApp.renderer.resolution = window.devicePixelRatio;
    newApp.stage.eventMode = "static";

    newApp.canvas.style.width = '100%';
    newApp.canvas.style.height = '100%';
    newApp.canvas.style.position = 'absolute';
    newApp.canvas.style.top = '0';
    newApp.canvas.style.left = '0';

    return newApp;
})();