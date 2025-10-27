import { GateType } from "../enums/GateType";
import { AndGate } from "../models/logic-gate/AndGate";
import { Gate } from "../models/logic-gate/Gate";
import { NandGate } from "../models/logic-gate/NandGate";
import { NorGate } from "../models/logic-gate/NorGate";
import { NotGate } from "../models/logic-gate/NotGate";
import { OrGate } from "../models/logic-gate/OrGate";
import { XnorGate } from "../models/logic-gate/XnorGate";
import { XorGate } from "../models/logic-gate/XorGate";
import { Coordinate } from "../types/ICoordinate";

export const worldWidth: number = 10000;
export const worldHeight: number = 10000;
export const cellSize: number = 50;

export const gateMap: Record<GateType, new (x: number, y: number) => Gate> = {
    [GateType.AND]: AndGate,
    [GateType.OR]: OrGate,
    [GateType.NOT]: NotGate,
    [GateType.NAND]: NandGate,
    [GateType.NOR]: NorGate,
    [GateType.XOR]: XorGate,
    [GateType.XNOR]: XnorGate
};

export const getCellCenter = (x: number, y: number): Coordinate => {
    return {
        x: Math.floor(x / cellSize) * cellSize + cellSize / 2,
        y: Math.floor(y / cellSize) * cellSize + cellSize / 2,
    };
};