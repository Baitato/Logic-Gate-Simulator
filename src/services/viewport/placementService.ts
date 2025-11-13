/* eslint-disable @typescript-eslint/no-explicit-any */
import { Point } from 'pixi.js';
import { getCellCenter } from '../../utils/constants';
import { getObject, save } from './positionService';
import { viewport } from '../../core/viewport';
import { Placeable } from '../../models/Placeable';
import { PlaceableObjectFactory } from '../../factory/PlaceableObjectFactory';
import { PlaceableType } from '../../enums/PlaceableType';

let moveEvent: ((event: any) => void) | undefined = undefined, placeEvent: ((event: any) => void) | undefined = undefined, curObject: Placeable | undefined = undefined;

export function place(event: any, gate: PlaceableType): void {
    cleanUp();

    const worldPos: Point = viewport.toWorld(event.global);

    initiatePlacement(worldPos.x, worldPos.y, gate);
}

function initiatePlacement(x: number, y: number, type: string): void {
    const placeable: Placeable = PlaceableObjectFactory.create(x, y, type);
    placeable.alpha = 0.6;

    curObject = placeable;
    viewport.addChild(placeable);

    if (moveEvent == undefined) {
        moveEvent = (event) => onMove(event, placeable);
        viewport.on("pointermove", moveEvent);
    }
}

function onMove(event: any, placeable: Placeable): void {
    moveRelativeToMouseOnViewport(event, placeable);
    if (placeEvent == undefined) {
        placeEvent = (event) => {
            onPlace(event, placeable);
        };

        viewport.on("pointerup", placeEvent);
    }
}

function onPlace(event: any, placeable: Placeable): void {
    if (getObject(placeable.x, placeable.y) != undefined) {
        return;
    }

    moveRelativeToMouseOnViewport(event, placeable);

    save(placeable.x, placeable.y, placeable);

    placeable.alpha = 1;

    viewport.off("pointermove", moveEvent);
    viewport.off("pointerup", placeEvent);

    moveEvent = undefined;
    placeEvent = undefined;
    curObject = undefined;
}


function moveRelativeToMouseOnViewport(event: any, placeable: Placeable): void {
    const worldPos = viewport.toWorld(event.global);

    const cellCenter = getCellCenter(worldPos.x, worldPos.y);

    placeable.x = cellCenter.x;
    placeable.y = cellCenter.y;

    if (getObject(placeable.x, placeable.y) == undefined) {
        placeable.alpha = 0.6;
    } else {
        placeable.alpha = 0;
    }
}

function cleanUp(): void {
    if (curObject) {
        viewport.removeChild(curObject);
        curObject = undefined;
    }

    if (moveEvent) {
        viewport.off("pointermove", moveEvent);
        moveEvent = undefined;
    }

    if (placeEvent) {
        viewport.off("pointerup", placeEvent);
        placeEvent = undefined;
    }
}