import { Viewport } from "pixi-viewport";
import { Application } from "pixi.js";

export class Screen extends Viewport {

    constructor(app: Application) {
        super({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            events: app.renderer.events,
        });


        app.stage.addChild(this);
        this.resetView();
        this.drag().pinch().wheel().decelerate();

        window.addEventListener("keydown", this._onKeyDown);
    }

    public resetView(): void {
        this.setZoom(0.5, true);
        this.moveCenter(0, 0);
    }

    private _onKeyDown = (event: KeyboardEvent): void => {
        switch (event.key) {
            case " ": this.resetView(); break;
        }
    }
}