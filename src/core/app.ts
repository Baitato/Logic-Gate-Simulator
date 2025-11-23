import { Application } from "pixi.js";

export class ApplicationWrapper extends Application {
    private constructor() {
        super();
    }

    static async create(): Promise<ApplicationWrapper> {
        const app = new ApplicationWrapper();

        await app.init({
            background: 0x101012,
            resizeTo: window,
            sharedTicker: true,
            autoStart: true,
            preference: 'webgpu'
        });

        app.renderer.resolution = window.devicePixelRatio;
        app.stage.eventMode = "static";

        app.canvas.style.width = '100%';
        app.canvas.style.height = '100%';
        app.canvas.style.position = 'absolute';
        app.canvas.style.top = '0';
        app.canvas.style.left = '0';

        return app;
    }
}