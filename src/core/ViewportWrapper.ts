import { Viewport } from "pixi-viewport";
import { ApplicationWrapper } from "./ApplicationWrapper";

const worldWidth: number = 10000;
const worldHeight: number = 10000;

export class ViewportWrapper extends Viewport {
    public app: ApplicationWrapper;
    static #instance: ViewportWrapper;
    static #initialized = false;
    private edgeThreshold: number = 30; // Distance from edge to start panning (pixels)
    private panSpeed: number = 7; // Base panning speed (pixels per frame)
    private panDirection: { x: number; y: number } = { x: 0, y: 0 };
    private animationId: number | null = null;

    private constructor(app: ApplicationWrapper) {
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
        window.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        window.addEventListener("blur", () => this.stopPanning());
        document.addEventListener("mouseleave", () => this.stopPanning());
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.stopPanning();
            }
        });

        this.handleResize();
        this.resetViewport();
        this.pinch().wheel().decelerate();
    }

    public static async init(): Promise<void> {
        if (this.#initialized) return;
        const app = ApplicationWrapper.getInstance();
        this.#instance = new ViewportWrapper(app);
        this.#initialized = true;
    }

    public static getInstance(): ViewportWrapper {
        if (!this.#instance) {
            throw new Error('ViewportWrapper not initialized. Call init() first.');
        }
        return this.#instance;
    }

    private resetViewport(): void {
        this.moveCenter(0, 0);
        this.setZoom(1.25, true);
    }

    private handleResize(): void {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
    }

    private onSpaceKeyDown(event: KeyboardEvent): void {
        if (event.code === "Space") {
            this.resetViewport();
        }
    }

    private handleMouseMove(event: MouseEvent): void {
        // Stop panning if mouse is outside the window
        if (event.clientX < 0 || event.clientX > this.screenWidth || event.clientY < 0 || event.clientY > this.screenHeight) {
            this.stopPanning();
            return;
        }

        let deltaX = 0;
        let deltaY = 0;

        if (event.clientX < this.edgeThreshold) {
            const factor = (this.edgeThreshold - event.clientX) / this.edgeThreshold;
            deltaX = -this.panSpeed * factor;
        } else if (event.clientX > this.screenWidth - this.edgeThreshold) {
            const factor = (event.clientX - (this.screenWidth - this.edgeThreshold)) / this.edgeThreshold;
            deltaX = this.panSpeed * factor;
        }

        if (event.clientY < this.edgeThreshold) {
            const factor = (this.edgeThreshold - event.clientY) / this.edgeThreshold;
            deltaY = -this.panSpeed * factor;
        } else if (event.clientY > this.screenHeight - this.edgeThreshold) {
            const factor = (event.clientY - (this.screenHeight - this.edgeThreshold)) / this.edgeThreshold;
            deltaY = this.panSpeed * factor;
        }

        this.panDirection.x = deltaX;
        this.panDirection.y = deltaY;

        if ((deltaX !== 0 || deltaY !== 0) && !this.animationId) {
            this.startPanning();
        } else if (deltaX === 0 && deltaY === 0 && this.animationId) {
            this.stopPanning();
        }
    }

    private startPanning(): void {
        const pan = () => {
            if (this.panDirection.x !== 0 || this.panDirection.y !== 0) {
                const worldDeltaX = this.panDirection.x / this.scale.x;
                const worldDeltaY = this.panDirection.y / this.scale.y;
                this.moveCenter(this.center.x + worldDeltaX, this.center.y + worldDeltaY);
                this.animationId = requestAnimationFrame(pan);
            } else {
                this.animationId = null;
            }
        };
        this.animationId = requestAnimationFrame(pan);
    }

    private stopPanning(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.panDirection.x = 0;
        this.panDirection.y = 0;
    }
}