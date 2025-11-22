import { FederatedPointerEvent, Graphics, Sprite } from "pixi.js";
import { Coordinate } from "../types/ICoordinate";
import { ConnectionPoint } from "./ConnectionPoint";
import { Placeable } from "./Placeable";
import { Dimension } from "../types/IDimension";
import { loadSprite } from "../utils/assetLoader";
import { StateManager, stateManager } from "../state/StateManager";
import { RotationHandler } from './logic-gate/RotationHandler';
import { PlaceableType } from "../enums/PlaceableType";
import { simulationService } from "../core/simulator/SimulationService";

const dimensions: Dimension = { x: 50, y: 50 };

export class Switch extends Placeable {
    type: PlaceableType = PlaceableType.SWITCH;
    placeableId: number;
    static assetName: string = "switch-empty"
    static onAssetName: string = "on-switch"
    rotationHandler: RotationHandler = new RotationHandler(this);
    offSprite?: Sprite | undefined;
    onSprite?: Sprite | undefined;
    outputPoints: ConnectionPoint[] = [];
    inputPoints: ConnectionPoint[] = [];
    isOn: boolean = false;

    constructor(x: number, y: number) {
        super(x, y);

        this.eventMode = "static";
        this.setUp(Switch.assetName);

        this.placeableId = StateManager.gateIdCounter++;
        StateManager.gateById.set(this.placeableId, this);

        this.on("pointerdown", (event) => this.onSelect(event, this.rotationHandler));
    }

    public override destroy(): void {
        StateManager.gateById.delete(this.placeableId);
        super.destroy({ children: true });
    }

    protected override getInputPoints(): Coordinate[] {
        return [];
    }

    protected override getOutputPoints(): Coordinate[] {
        return [{ x: 25, y: 0 }];
    }

    protected evaluate(): void {
        const outputValue = this.isOn ? 1 : 0;
        this.outputPoints.forEach((outputPoint) => {
            outputPoint.propagateValue(outputValue);
        });
    }

    protected override async setUp(assetName: string): Promise<void> {
        this.offSprite = await loadSprite(assetName, dimensions);
        this.onSprite = await loadSprite(Switch.onAssetName, dimensions);
        this.addChild(this.offSprite);
        this.addChild(this.onSprite);
        this.onSprite.visible = false;

        this.addClickableArea();
        this.addConnectionPoints();
    }

    private addClickableArea(): void {
        const circle = new Graphics()
            .circle(-5, 0, 11)
            .fill({ color: 0xff0000, alpha: 0 });
        circle.eventMode = "static";
        circle.cursor = "pointer";
        circle.zIndex = 5;
        circle.on("pointerdown", () => this.toggleSwitch());

        this.addChild(circle);
    }

    protected onClick(event: FederatedPointerEvent): void {
        event.stopPropagation();  // Prevent bubbling to viewport
        stateManager.unselectPlaceable();

        this.select();
    }

    public select() {
        StateManager.selectedPlaceable = this;
        this.addChild(this.rotationHandler);
    }

    protected onToggle(event: FederatedPointerEvent): void {
        event.stopPropagation();  // Prevent bubbling to viewport
        stateManager.unselectPlaceable();

        this.select();
    }

    private toggleSwitch(): void {
        this.isOn = !this.isOn;

        if (this.isOn) {
            this.onSprite!.visible = true;
            this.offSprite!.visible = false;
        } else {
            this.onSprite!.visible = false;
            this.offSprite!.visible = true;
        }

        simulationService.flipSwitch(this.placeableId);
    }
}