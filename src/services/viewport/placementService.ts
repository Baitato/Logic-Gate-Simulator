import { FederatedPointerEvent, Point } from 'pixi.js';
import { getCellCenter } from '../../utils/constants';
import { Placeable } from '../../models/Placeable';
import { PlaceableObjectFactory } from '../../factory/PlaceableObjectFactory';
import { PlaceableType } from '../../enums/PlaceableType';
import { ViewportWrapper } from '../../core/ViewportWrapper';
import PositionService from './PositionService';

export class PlacementService {
    static #instance: PlacementService;

    private viewport: ViewportWrapper;

    private curObject: Placeable | undefined = undefined;
    private moveEvent: ((event: FederatedPointerEvent) => void) | undefined = undefined
    private placeEvent: ((event: FederatedPointerEvent) => void) | undefined = undefined

    private constructor(viewport: ViewportWrapper) {
        this.viewport = viewport;
    }

    public static async getInstance(): Promise<PlacementService> {
        if (!this.#instance) {
            this.#instance = new PlacementService(await ViewportWrapper.getInstance());
        }
        return this.#instance;
    }

    public place(event: FederatedPointerEvent, placeableType: PlaceableType): void {
        this.cleanUp();

        const worldPos: Point = this.viewport.toWorld(event.global);

        this.initiatePlacement(worldPos.x, worldPos.y, placeableType);
    }

    private async initiatePlacement(x: number, y: number, type: PlaceableType): Promise<void> {
        const placeable: Placeable = await PlaceableObjectFactory.create(x, y, type);
        placeable.alpha = 0.6;

        this.curObject = placeable;
        this.viewport.addChild(placeable);

        if (this.moveEvent == undefined) {
            this.moveEvent = (event) => this.onMove(event, placeable);
            this.viewport.on("pointermove", this.moveEvent);
        }
    }

    private onMove(event: FederatedPointerEvent, placeable: Placeable): void {
        this.moveRelativeToMouseOnViewport(event, placeable);
        if (this.placeEvent == undefined) {
            this.placeEvent = (event) => {
                this.onPlace(event, placeable);
            };

            this.viewport.on("pointerdown", this.placeEvent);
        }
    }

    private onPlace(event: FederatedPointerEvent, placeable: Placeable): void {
        if (PositionService.getObject(placeable.x, placeable.y) != undefined) {
            console.log('in');
            return;
        }

        this.moveRelativeToMouseOnViewport(event, placeable);

        PositionService.save(placeable.x, placeable.y, placeable);
        placeable.alpha = 1;

        this.viewport.off("pointermove", this.moveEvent);
        this.viewport.off("pointerdown", this.placeEvent);

        this.moveEvent = undefined;
        this.placeEvent = undefined;
        this.curObject = undefined;
    }

    private moveRelativeToMouseOnViewport(event: FederatedPointerEvent, placeable: Placeable): void {
        const worldPos = this.viewport.toWorld(event.global);

        const cellCenter = getCellCenter(worldPos.x, worldPos.y);

        placeable.x = cellCenter.x;
        placeable.y = cellCenter.y;

        if (PositionService.getObject(placeable.x, placeable.y) == undefined) {
            placeable.alpha = 0.6;
        } else {
            placeable.alpha = 0;
        }
    }

    private cleanUp(): void {
        if (this.curObject) {
            this.viewport.removeChild(this.curObject);
            this.curObject = undefined;
        }

        if (this.moveEvent) {
            this.viewport.off("pointermove", this.moveEvent);
            this.moveEvent = undefined;
        }

        if (this.placeEvent) {
            this.viewport.off("pointerdown", this.placeEvent);
            this.placeEvent = undefined;
        }
    }

}
