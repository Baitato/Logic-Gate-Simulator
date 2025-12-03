import { Coordinate } from "../types/ICoordinate";
import { Dimension } from "../types/IDimension";

export const worldWidth: number = 10000;
export const worldHeight: number = 10000;
export const cellSize: number = 50;
export const placeableDimensions: Dimension = { x: 50, y: 50 };

export const getCellCenter = (x: number, y: number): Coordinate => {
    return {
        x: Math.floor(x / cellSize) * cellSize + cellSize / 2,
        y: Math.floor(y / cellSize) * cellSize + cellSize / 2,
    };
};
export const CYAN = 0x40E0D0;