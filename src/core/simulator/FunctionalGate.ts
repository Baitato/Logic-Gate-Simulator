import { PlaceableType } from "../../enums/PlaceableType"
import { simulationService } from "./SimulationService";

export type Value = number | undefined;

export class FunctionalGate {
    type: PlaceableType;
    gateId: number;
    inputs: number[];
    outputs: number[];
    value: Value;

    constructor(type: PlaceableType, gateId: number, inputs: number[], outputs: number[], value: Value = undefined) {
        this.type = type;
        this.gateId = gateId;
        this.inputs = inputs;
        this.outputs = outputs;
        this.value = value;
    }

    evaluate(): Value {
        switch (this.type) {
            case PlaceableType.AND:
                return (this.hasZero() ? 0 : this.getOrDefault(1));
            case PlaceableType.NAND:
                return (this.hasZero() ? 1 : this.getOrDefault(0));
            case PlaceableType.OR:
                return (this.hasOne() ? 1 : this.getOrDefault(0));
            case PlaceableType.NOR:
                return (this.hasOne() ? 0 : this.getOrDefault(1));
            case PlaceableType.NOT:
                return (this.hasOne() ? 0 : this.getOrDefault(1));
            case PlaceableType.BUFFER:
                return (this.hasOne() ? 1 : this.getOrDefault(0));
            case PlaceableType.SWITCH:
                return this.value;
            default:
                return undefined;
        }
    }

    hasZero(): boolean {
        for (const input of this.inputs) {
            if (simulationService.netList.get(input) === 0) {
                return true;
            }
        }
        return false;
    }

    hasOne(): boolean {
        for (const input of this.inputs) {
            if (simulationService.netList.get(input) === 1) {
                return true;
            }
        }
        return false;
    }

    getOrDefault(def: Value): Value {
        let undef = true;

        for (const input of this.inputs) {
            if (simulationService.netList.get(input) != undefined) {
                undef = false;
                break;
            }
        }

        return undef ? undefined : def;
    }
}