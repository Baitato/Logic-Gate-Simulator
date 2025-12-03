import { SelectionService } from './SelectionService';
import { getObject, getObjectsInBounds } from './viewport/positionService';
import { Dimension } from '../types/IDimension';
import { ImportService } from './ImportService';
import { FederatedPointerEvent, Point } from 'pixi.js';
import { getRoundedPoint } from '../utils/util';
import { viewport } from '../core/instances';

export class CopyPasteService {
    private importService: ImportService;
    private selectionService: SelectionService;
    private pasteable: string[] = [];

    constructor(importService: ImportService, selectionService: SelectionService) {
        this.importService = importService;
        this.selectionService = selectionService;
    }

    public copy(): void {
        this.pasteable = [];
        const selection = this.selectionService.getActualSelection();
        const startPoint = this.selectionService.getStartPointRounded();

        if (!selection || !startPoint) {
            console.warn("No selection to copy.");
            return;
        }

        this.pasteable = [];

        const objectsInSelection = getObjectsInBounds(
            selection.x,
            selection.y,
            selection.width,
            selection.height
        );

        objectsInSelection.forEach((obj) => {
            this.pasteable.push(obj.exportAsString(-startPoint.x, -startPoint.y));
        });

        objectsInSelection.forEach((obj) => {
            obj.getAllConnectionPoints().forEach((point) => {
                point.wires.forEach((wire) => {
                    this.pasteable.push(wire.exportAsString());
                })
            })
        });
    }

    public async paste(pos: Point): Promise<void> {
        const localPos = viewport.toLocal(pos);
        const startPosition: Dimension = { x: getRoundedPoint(localPos.x), y: getRoundedPoint(localPos.y) };
        if (!this.isPasteable(startPosition)) {
            console.warn("Cannot paste here, space is occupied.");
            return;
        }

        for (let i = 0; i < this.pasteable.length; i++) {
            const fields = this.pasteable[i].split(',');
            const type = fields[0];

            if (type == "wire")
                continue;

            const x = parseInt(fields[1]) + startPosition.x;
            const y = parseInt(fields[2]) + startPosition.y;

            fields[1] = x.toString();
            fields[2] = y.toString();
            this.pasteable[i] = fields.join(',');
        }

        console.log(this.pasteable);
        await this.importService.import(this.pasteable);
    }

    private isPasteable(startPosition: Dimension): boolean {
        for (const line of this.pasteable) {
            const fields = line.split(',');
            const type = fields[0];

            if (type == "wire")
                continue;

            const x = parseInt(fields[1]) + startPosition.x;
            const y = parseInt(fields[2]) + startPosition.y;

            if (getObject(x, y)) {
                return false;
            }
        }

        return true;
    }
}