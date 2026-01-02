import { Container, Point, Sprite } from 'pixi.js';
import { ConnectionPointType } from "../enums/ConnectionPointType";
import { Coordinate } from "../types/ICoordinate";
import { Wire } from "./Wire";
import type { Placeable } from './Placeable';
import { ViewportWrapper } from '../core/ViewportWrapper';
import { ConnectionPointListener, ConnectionPointPublisher } from '../observer/ConnectionPointObserver';
import { ConnectionService } from '../services/ConnectionService';
import { getConnectionPointTexture } from '../utils/assetLoader';

export class ConnectionPoint extends Container implements ConnectionPointPublisher {
    type: ConnectionPointType;
    wires: Set<Wire> = new Set();
    parentPlaceable!: Placeable;
    connectionPointListeners: ConnectionPointListener[] = [];
    index: number; 
    private sprite!: Sprite;
    private readonly handlePointerDown = () => this.onPointerDown();

    constructor(type: ConnectionPointType, coordinate: Coordinate, parentPlaceable: Placeable, index: number) {
        super();
        this.x = coordinate.x;
        this.y = coordinate.y;
        this.type = type;
        this.parentPlaceable = parentPlaceable;
        this.index = index;
        this.zIndex = Infinity;
        this.render();

        this.addConnectionPointListener(ConnectionService.getInstance());
    }

    public addConnectionPointListener(listener: ConnectionPointListener): void {
        this.connectionPointListeners.push(listener);
    }

    public renderWire() {
        if (this.wires.size > 0) {
            for (const wire of this.wires) {
                wire.render();
            }
        }
    }

    public getViewportPosition(viewport: ViewportWrapper): Point {
        const pointData = viewport.toLocal(this.getGlobalPosition(new Point(this.x, this.y)));
        return new Point(pointData.x, pointData.y);
    }

    public destroy() {
        this.wires.forEach((wire) => wire.destroy());
        super.destroy();
    }

    private render() {
        this.eventMode = "static";
        this.cursor = "pointer";

        this.sprite = new Sprite(getConnectionPointTexture(false));
        this.sprite.anchor.set(0.5);
        this.addChild(this.sprite);

        this.on("pointerover", () => this.setHoverState(true));
        this.on("pointerout", () => this.setHoverState(false));
        this.on("pointerdown", this.handlePointerDown);
    }

    private setHoverState(hover: boolean): void {
        this.sprite.texture = getConnectionPointTexture(hover);
    }

    private onPointerDown(): void {
        this.connectionPointListeners.forEach((listener) => {
            listener.onConnectionPointClick(this);
        });
    }

    public addWire(wire: Wire) {
        this.wires.add(wire);
    }
}