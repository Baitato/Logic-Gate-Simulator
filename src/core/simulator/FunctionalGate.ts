import { PlaceableType } from "../../enums/PlaceableType"
import { Bulb } from "../../models/Bulb";
import { StateManager } from "../../state/StateManager";

export type Value = number | undefined;

export class FunctionalGate {
    type: PlaceableType;
    gateId: number;
    inputs: number[];
    outputs: number[];
    value: Value;
    tickRate?: number;

    constructor(type: PlaceableType, gateId: number, inputs: number[], outputs: number[], value: Value = undefined, tickRate?: number) {
        this.type = type;
        this.gateId = gateId;
        this.inputs = inputs;
        this.outputs = outputs;
        this.value = value;
        this.tickRate = tickRate;
    }

    evaluate(netList: Map<number, Value>): Value {
        switch (this.type) {
            case PlaceableType.AND:
                return (this.hasZero(netList) ? 0 : this.getOrDefault(netList, 1));
            case PlaceableType.NAND:
                return (this.hasZero(netList) ? 1 : this.getOrDefault(netList, 0));
            case PlaceableType.OR:
                return (this.hasOne(netList) ? 1 : this.getOrDefault(netList, 0));
            case PlaceableType.NOR:
                return (this.hasOne(netList) ? 0 : this.getOrDefault(netList, 1));
            case PlaceableType.NOT:
                return (this.hasOne(netList) ? 0 : this.getOrDefault(netList, 1));
            case PlaceableType.BUFFER:
                return (this.hasOne(netList) ? 1 : this.getOrDefault(netList, 0));
            case PlaceableType.SWITCH:
                return this.value;
            case PlaceableType.BULB:
                return this.evaluateBulb(netList);
            case PlaceableType.XOR:
                return this.evaluateXor(netList);
            case PlaceableType.XNOR:
                return this.evaluateXnor(netList);
            case PlaceableType.CLOCK:
                return this.evaluateClock();
            default:
                return undefined;
        }
    }

    evaluateClock(): Value {
        const curTick = StateManager.currentTick % (2 * this.tickRate!);
        return (curTick < this.tickRate!) ? 0 : 1;
    }

    evaluateBulb(netList: Map<number, Value>): Value {
        const bulb = StateManager.placeableById.get(this.gateId);

        if (bulb && bulb instanceof Bulb)
            bulb.switch(this.hasOne(netList) ? 1 : 0);

        return undefined;
    }

    evaluateXor(netList: Map<number, Value>): Value {
        let onesCount = 0;
        let hasUndefined = false;

        for (const input of this.inputs) {
            const val = netList.get(input);
            if (val === undefined) {
                hasUndefined = true;
            } else if (val === 1) {
                onesCount++;
            }
        }

        if (hasUndefined) return undefined;

        return onesCount % 2 === 1 ? 1 : 0;
    }

    evaluateXnor(netList: Map<number, Value>): Value {
        const xorResult = this.evaluateXor(netList);

        if (xorResult === undefined) return undefined;

        return xorResult === 1 ? 0 : 1;
    }

    hasZero(netList: Map<number, Value>): boolean {
        for (const input of this.inputs) {
            if (netList.get(input) === 0) {
                return true;
            }
        }
        return false;
    }

    hasOne(netList: Map<number, Value>): boolean {
        for (const input of this.inputs) {
            if (netList.get(input) === 1) {
                return true;
            }
        }
        return false;
    }

    getOrDefault(netList: Map<number, Value>, def: Value): Value {
        let undef = true;

        for (const input of this.inputs) {
            if (netList.get(input) != undefined) {
                undef = false;
                break;
            }
        }

        return undef ? undefined : def;
    }
}