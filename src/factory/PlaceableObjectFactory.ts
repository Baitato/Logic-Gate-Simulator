import { PlaceableType } from "../enums/PlaceableType";
import { Bulb } from "../models/Bulb";
import { Clock } from "../models/Clock";
import { Gate } from "../models/logic-gate/Gate";
import { Placeable } from "../models/Placeable";
import { Switch } from "../models/Switch";
import { gateMap } from "../utils/maps";

export class PlaceableObjectFactory {
    private constructor() { }

    public static create(x: number, y: number, type: PlaceableType): Placeable {
        let placeable: Placeable;
        if (type === PlaceableType.SWITCH) {
            placeable = this.createSwitch(x, y);
        } else if (type === PlaceableType.BULB) {
            placeable = this.createBulb(x, y);
        } else if (type === PlaceableType.CLOCK) {
            placeable = this.createClock(x, y);
        } else {
            placeable = this.createGate(x, y, type);
        }

        placeable.savePlaceable();
        return placeable;
    }

    public static createGate(x: number, y: number, type: PlaceableType, rotation: number = 0): Gate {
        const gate = new gateMap[type](x, y, rotation);

        // @ts-expect-error - concrete gate classes override setUp() with no args
        return gate.setUp().setRotation(rotation);
    }

    public static createSwitch(x: number, y: number, rotation: number = 0, isOn: boolean = false): Switch {
        return new Switch(x, y).setUp().setRotation(rotation).setIsOn(isOn);
    }

    public static createBulb(x: number, y: number, rotation: number = 0): Bulb {
        return new Bulb(x, y).setUp().setRotation(rotation);
    }

    public static createClock(x: number, y: number, tickRate: number = 1000, rotation: number = 0): Clock {
        return new Clock(x, y).setUp().setTickRate(tickRate).setRotation(rotation);
    }
}