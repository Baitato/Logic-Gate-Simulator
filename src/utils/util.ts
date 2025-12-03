import { cellSize } from "./constants";


export function getRoundedPoint(val: number): number {
    return Math.round(val / cellSize) * cellSize;
}