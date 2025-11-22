import { PlaceableType } from "../enums/PlaceableType";
import { AndGate } from "../models/logic-gate/AndGate";
import { BufferGate } from "../models/logic-gate/BufferGate";
import { NandGate } from "../models/logic-gate/NandGate";
import { NorGate } from "../models/logic-gate/NorGate";
import { NotGate } from "../models/logic-gate/NotGate";
import { OrGate } from "../models/logic-gate/OrGate";
import { XnorGate } from "../models/logic-gate/XnorGate";
import { XorGate } from "../models/logic-gate/XorGate";
import { Placeable } from "../models/Placeable";
import { Switch } from "../models/Switch";
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

export const gateMap: Record<string, new (x: number, y: number) => Placeable> = {
    [PlaceableType.AND]: AndGate,
    [PlaceableType.OR]: OrGate,
    [PlaceableType.NOT]: NotGate,
    [PlaceableType.NAND]: NandGate,
    [PlaceableType.NOR]: NorGate,
    [PlaceableType.XOR]: XorGate,
    [PlaceableType.XNOR]: XnorGate,
    [PlaceableType.BUFFER]: BufferGate,
    [PlaceableType.SWITCH]: Switch,
};

export const CYAN = 0x40E0D0;