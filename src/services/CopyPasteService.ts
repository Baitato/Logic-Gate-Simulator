import { SelectionService } from './SelectionService';
import { Dimension } from '../types/IDimension';
import { ImportService } from './ImportService';
import { Graphics, Point } from 'pixi.js';
import { getRoundedPoint } from '../utils/util';
import { ViewportWrapper } from '../core/ViewportWrapper';
import PositionService from './viewport/PositionService';
import { Wire } from '../models/Wire';
import { Placeable } from '../models/Placeable';

export class CopyPasteService {
    static #instance: CopyPasteService;

    private importService: ImportService;
    private selectionService: SelectionService;
    private startPosition: Dimension | null = null;
    private selectionRect: Graphics | null = null;
    private pasteable: string[] = [];

    private constructor(importService: ImportService, selectionService: SelectionService) {
        this.importService = importService;
        this.selectionService = selectionService;
    }

    public static async getInstance() {
        if (!this.#instance) {
            const importService = await ImportService.getInstance();
            const selectionService = await SelectionService.getInstance();
            this.#instance = new CopyPasteService(importService, selectionService);
        }

        return this.#instance;
    }

    public copy(): void {
        this.startPosition = null;
        this.pasteable = [];
        const selection = this.selectionService.getActualSelection();
        const startPoint = this.selectionService.getStartPointRounded();

        if (!selection || !startPoint) {
            console.warn("No selection to copy.");
            return;
        }

        this.pasteable = [];

        const objectsInSelection = PositionService.getObjectsInBounds(
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

    public async initializeDisplayPastePreview(pos: Point): Promise<void> {
        const localPos = (await ViewportWrapper.getInstance()).toLocal(pos);
        const pastableCopy = this.getPastable(localPos);

        await this.importService.import(pastableCopy, false);
    }

    public async displayPastePreview(pos: Point, wires: Wire[], placeables: Placeable[]): Promise<void> {
        const viewport = await ViewportWrapper.getInstance();
        const localPos = viewport.toLocal(pos);
        const curPos = { x: getRoundedPoint(localPos.x), y: getRoundedPoint(localPos.y) };

        if (!this.startPosition)
            return;

        const deltaX = curPos.x - this.startPosition.x;
        const deltaY = curPos.y - this.startPosition.y;

        // Calculate bounds for the selection rectangle
        let minX = curPos.x, minY = curPos.y, maxX = curPos.x, maxY = curPos.y;

        placeables.forEach((placeable) => {
            placeable.x += deltaX;
            placeable.y += deltaY;
            minX = Math.min(minX, placeable.x);
            minY = Math.min(minY, placeable.y);
            maxX = Math.max(maxX, placeable.x);
            maxY = Math.max(maxY, placeable.y);
        });

        minX = getRoundedPoint(minX);
        minY = getRoundedPoint(minY);
        maxX = getRoundedPoint(maxX);
        maxY = getRoundedPoint(maxY);

        // Update startPosition to current position for next delta calculation
        this.startPosition.x = curPos.x;
        this.startPosition.y = curPos.y;

        wires.forEach((wire) => {
            wire.render();
        });

        // Draw selection rectangle around paste preview
        if (placeables.length > 0) {
            // Clear previous selection rectangle if it exists
            if (this.selectionRect) {
                this.selectionRect.clear();
            } else {
                this.selectionRect = new Graphics();
                viewport.addChild(this.selectionRect);
            }

            if (maxX - minX > 0 && maxY - minY > 0) {
                this.selectionRect.rect(minX, minY, maxX - minX, maxY - minY)
                    .stroke({ color: 0xFFFFFF, width: 2 })
                    .fill({ color: 0xFFFFFF, alpha: 0.2 });
            }
        }
    }

    public clearSelectionRect(): void {
        if (this.selectionRect) {
            this.selectionRect.clear();
            this.selectionRect.destroy();
            this.selectionRect = null;
        }
    }

    public async paste(pos: Point): Promise<void> {
        this.clearSelectionRect();
        const localPos = (await ViewportWrapper.getInstance()).toLocal(pos);
        const pastableCopy = this.getPastable(localPos);

        await this.importService.import(pastableCopy);
    }

    private getPastable(localPos: Point): string[] {
        this.startPosition = { x: getRoundedPoint(localPos.x), y: getRoundedPoint(localPos.y) };
        if (!this.isPasteable(this.startPosition)) {
            console.warn("Cannot paste here, space is occupied.");
            return [];
        }

        const pastableCopy = [...this.pasteable];

        for (let i = 0; i < pastableCopy.length; i++) {
            const fields = pastableCopy[i].split(',');
            const type = fields[0];

            if (type == "wire")
                continue;

            const x = parseInt(fields[1]) + this.startPosition.x;
            const y = parseInt(fields[2]) + this.startPosition.y;

            fields[1] = x.toString();
            fields[2] = y.toString();
            pastableCopy[i] = fields.join(',');
        }

        return pastableCopy;
    }

    private isPasteable(startPosition: Dimension): boolean {
        for (const line of this.pasteable) {
            const fields = line.split(',');
            const type = fields[0];

            if (type == "wire")
                continue;

            const x = parseInt(fields[1]) + startPosition.x;
            const y = parseInt(fields[2]) + startPosition.y;

            if (PositionService.getObject(x, y)) {
                return false;
            }
        }

        return true;
    }
}