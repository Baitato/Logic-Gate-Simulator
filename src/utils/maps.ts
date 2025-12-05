import { PlaceableType } from "../enums/PlaceableType"
import { AndGate } from "../models/logic-gate/AndGate"
import { BufferGate } from "../models/logic-gate/BufferGate"
import { Gate } from "../models/logic-gate/Gate"
import { NandGate } from "../models/logic-gate/NandGate"
import { NorGate } from "../models/logic-gate/NorGate"
import { NotGate } from "../models/logic-gate/NotGate"
import { OrGate } from "../models/logic-gate/OrGate"
import { XnorGate } from "../models/logic-gate/XnorGate"
import { XorGate } from "../models/logic-gate/XorGate"

export const gateMap: Record<string, new (x: number, y: number, rotation?: number, id?: number) => Gate> = {
    [PlaceableType.AND]: AndGate,
    [PlaceableType.OR]: OrGate,
    [PlaceableType.NOT]: NotGate,
    [PlaceableType.NAND]: NandGate,
    [PlaceableType.NOR]: NorGate,
    [PlaceableType.XOR]: XorGate,
    [PlaceableType.XNOR]: XnorGate,
    [PlaceableType.BUFFER]: BufferGate,
}