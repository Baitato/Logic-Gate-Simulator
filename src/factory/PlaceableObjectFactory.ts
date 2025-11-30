import { PlaceableType } from "../enums/PlaceableType";
import { Bulb } from "../models/Bulb";
import { Clock } from "../models/Clock";
import { Gate } from "../models/logic-gate/Gate";
import { Placeable } from "../models/Placeable";
import { Switch } from "../models/Switch";
import { gateMap } from "../utils/constants";

export class PlaceableObjectFactory {
    private constructor() { }

    public static async create(x: number, y: number, type: PlaceableType): Promise<Placeable> {
        if (type === PlaceableType.SWITCH) {
            return await this.createSwitch(x, y);
        } else if (type === PlaceableType.BULB) {
            return await this.createBulb(x, y);
        } else if (type === PlaceableType.CLOCK) {
            return await this.createClock(x, y);
        } else {
            return await this.createGate(x, y, type);
        }
    }

    public static async createGate(x: number, y: number, type: PlaceableType, rotation: number = 0, id?: number): Promise<Gate> {
        const gate = new gateMap[type](x, y, rotation, id);

        // @ts-expect-error - concrete gate classes override setUp() with no args
        return await gate.setUp();
    }

    public static async createSwitch(x: number, y: number, rotation: number = 0, isOn: boolean = false): Promise<Switch> {
        return await new Switch(x, y, rotation, isOn).setUp();
    }

    public static async createBulb(x: number, y: number, rotation: number = 0, id?: number): Promise<Bulb> {
        return await new Bulb(x, y, rotation, id).setUp();
    }

    public static async createClock(x: number, y: number, tickRate: number = 1000, rotation: number = 0, id?: number): Promise<Clock> {
        return await new Clock(x, y, tickRate, rotation, id).setUp();
    }
}