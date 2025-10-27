import { Graphics } from "pixi.js";
import { ConnectionPointType } from '../../enums/ConnectionPointType';

export class ConnectionPoint extends Graphics {
    type: ConnectionPointType;

    constructor(type: ConnectionPointType) {
        super();
        this.type = type;
    }

    render() {
        this.eventMode = "static";
        this.cursor = "pointer";

        this.on("pointerover", () => this.drawCircleOfRadius(4.5));
        this.on("pointerout", () => this.drawCircleOfRadius(3));
    }

    drawCircleOfRadius(radius: number): void {
        this.fill({ color: 0xffffff });
        this.circle(0, 0, radius);
        this.fill();
    }
}