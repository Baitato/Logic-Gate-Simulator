import { Graphics, Point } from "pixi.js";
import { ConnectionPointType } from '../../enums/ConnectionPointType';
import { Coordinate } from "../../types/ICoordinate";
import { viewport } from "../../core/viewport";
import { Wire } from "./Wire";

export class ConnectionPoint extends Graphics {
    type: ConnectionPointType;

    constructor(type: ConnectionPointType, coordinate: Coordinate) {
        super();
        this.x = coordinate.x;
        this.y = coordinate.y;
        this.type = type;
        this.render();
    }

    render() {
        this.eventMode = "static";
        this.cursor = "pointer";

        this.on("pointerover", () => this.drawCircleOfRadius(4.5));
        this.on("pointerout", () => this.drawCircleOfRadius(3));
        this.on("pointerdown", () => this.onPointerDown());

        this.drawCircleOfRadius(3);
    }

    drawCircleOfRadius(radius: number): void {
        this.clear();
        this.fill({ color: 0xffffff });
        this.circle(0, 0, radius);
        this.fill();
    }

    onPointerDown(): void {
        const wire = new Wire(this);
        viewport.addChild(wire);
    }

    getViewportPosition() {
        return viewport.toLocal(this.getGlobalPosition(new Point(this.x, this.y)));
    }
}