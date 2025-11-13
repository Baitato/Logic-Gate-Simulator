import { Placeable } from "../models/Placeable";
import { gateMap } from "../utils/constants";

export class PlaceableObjectFactory {
    private constructor() { }

    public static create(x: number, y: number, type: string): Placeable {
        return new gateMap[type](x, y);
    }
}