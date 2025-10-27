/* eslint-disable @typescript-eslint/no-explicit-any */
import { Point } from 'pixi.js';
import { viewport } from '../../core/viewport';
import { GateType } from '../../enums/GateType';
import { getCellCenter } from '../../utils/constants';
import { getObject, save } from './positionService';
import { Gate } from '../../models/logic-gate/Gate';

let moveEvent: ((event: any) => void) | undefined = undefined, placeEvent: ((event: any) => void) | undefined = undefined, curLogicGate: Gate | undefined = undefined;

export function place(event: any, gate: GateType): void {
    cleanUp();

    const worldPos: Point = viewport.toWorld(event.global);

    initiatePlacement(worldPos.x, worldPos.y, gate);
}

function initiatePlacement(x: number, y: number, gate: GateType): void {
    const logicGate: Gate = Gate.create(x, y, gate);
    logicGate.alpha = 0.6;

    curLogicGate = logicGate;
    viewport.addChild(logicGate);

    if (moveEvent == undefined) {
        moveEvent = (event) => onMove(event, logicGate);
        viewport.on("pointermove", moveEvent);
    }
}

function onMove(event: any, logicGate: Gate): void {
    moveRelativeToMouseOnViewport(event, logicGate);
    if (placeEvent == undefined) {
        placeEvent = (event) => {
            onPlace(event, logicGate);
        };

        viewport.on("pointerup", placeEvent);
    }
}

function onPlace(event: any, logicGate: Gate): void {
    if (getObject(logicGate.x, logicGate.y) != undefined) {
        return;
    }

    moveRelativeToMouseOnViewport(event, logicGate);

    save(logicGate.x, logicGate.y, logicGate);

    logicGate.alpha = 1;

    viewport.off("pointermove", moveEvent);
    viewport.off("pointerup", placeEvent);

    moveEvent = undefined;
    placeEvent = undefined;
    curLogicGate = undefined;
}


function moveRelativeToMouseOnViewport(event: any, logicGate: Gate): void {
    const worldPos = viewport.toWorld(event.global);

    const cellCenter = getCellCenter(worldPos.x, worldPos.y);

    logicGate.x = cellCenter.x;
    logicGate.y = cellCenter.y;

    if (getObject(logicGate.x, logicGate.y) == undefined) {
        logicGate.alpha = 0.6;
    } else {
        logicGate.alpha = 0;
    }
}

function cleanUp(): void {
    if (curLogicGate) {
        viewport.removeChild(curLogicGate);
        curLogicGate = undefined;
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