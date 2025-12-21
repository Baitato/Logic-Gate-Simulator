import { Application } from "pixi.js";

export class ApplicationWrapper extends Application {
    static #instance: ApplicationWrapper;
    static #initialized = false;

    private constructor() {
        super();
    }

    static async init(): Promise<void> {
        if (this.#initialized) return;
        this.#instance = await ApplicationWrapper.create();
        this.#initialized = true;
    }

    static getInstance(): ApplicationWrapper {
        if (!this.#instance) {
            throw new Error('ApplicationWrapper not initialized. Call init() first.');
        }
        return this.#instance;
    }

    private static async create(): Promise<ApplicationWrapper> {
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