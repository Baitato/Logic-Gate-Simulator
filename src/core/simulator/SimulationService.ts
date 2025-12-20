import { PlaceableType } from '../../enums/PlaceableType';
import { StateManager } from '../../state/StateManager';
import { getCondensedGraph } from './condensedGraph';
import { FunctionalGate } from './FunctionalGate';
import { Clock } from '../../models/Clock';
import { Placeable } from '../../models/Placeable';
import { Switch } from '../../models/Switch';
import { Wire } from '../../models/Wire';
import { Value } from '../../types/IValue';

export class SimulationService {
    static #instance: SimulationService;
    public wires: Map<number, Wire> = new Map();
    public gates: Map<number, FunctionalGate> = new Map();
    public adjacencyList: Map<number, Set<number>> = new Map();
    public netList: Map<number, Value> = new Map();
    static cnt = 0;

    private constructor() { }

    static getInstance(): SimulationService {
        if (!this.#instance) {
            this.#instance = new SimulationService();
        }
        return this.#instance;
    }

    public nextIteration(): void {
        const condensedSccGraph = getCondensedGraph(this.adjacencyList);

        for (const scc of condensedSccGraph) {
            const nodes = scc.nodes;

            if (nodes.length === 1) {
                const nodeId = nodes[0];
                const gate = this.gates.get(nodeId)!;
                const newValue = gate.evaluate(this.netList);

                this.setOutputValues(gate, newValue);
            } else {
                let bad = false;

                for (let i = 0; i < 20; i++) {
                    let changed = false;

                    for (const nodeId of nodes) {
                        const gate = this.gates.get(nodeId)!;
                        const newValue = gate.evaluate(this.netList);

                        if (newValue !== gate.value) {
                            changed = true;
                        }
                        this.setOutputValues(gate, newValue);
                    }

                    if (!changed)
                        break;

                    if (i == 19 && changed)
                        bad = true;
                }

                if (bad) {
                    for (const nodeId of nodes) {
                        const gate = this.gates.get(nodeId)!;
                        this.setOutputValues(gate, undefined);
                    }
                }
            }
        }

        StateManager.nextTick();
    }

    public flipSwitch(switchId: number): void {
        if (this.gates.has(switchId)) {
            const gate = this.gates.get(switchId)!;
            const newValue = gate.value === 1 ? 0 : 1;

            this.setOutputValues(gate, newValue);
        }
    }

    private setOutputValues(gate: FunctionalGate, newValue: Value): void {
        gate.outputs.forEach(outputWireId => {
            this.netList.set(outputWireId, newValue);
            const outputWire = this.wires.get(outputWireId)!;
            outputWire.setValue(newValue);
        });
        gate.value = newValue;
    }

    public addEdge(wire: Wire): void {
        this.wires.set(wire.wireId, wire);

        const source = wire.source;
        const target = wire.target;

        this.addOutput(source, wire.wireId);
        this.addInput(target, wire.wireId);

        if (!this.adjacencyList.has(source.placeableId)) {
            this.adjacencyList.set(source.placeableId, new Set());
        }
        this.adjacencyList.get(source.placeableId)!.add(target.placeableId);

        this.netList.set(wire.wireId, this.undefinedIfNotSwitch(source));

        // this.log();
    }

    private addInput(gate: Placeable, wireId: number): void {
        const gateId = gate.placeableId;

        if (this.gates.has(gateId)) {
            this.gates.get(gateId)!.inputs.push(wireId);
        } else {
            this.gates.set(gateId, new FunctionalGate(gate.type, gate.placeableId, [wireId], []));
        }
    }

    private addOutput(gate: Placeable, wireId: number): void {
        const gateId = gate.placeableId;

        if (this.gates.has(gateId)) {
            this.gates.get(gateId)!.outputs.push(wireId);
        } else {
            this.gates.set(gateId, new FunctionalGate(gate.type, gate.placeableId, [], [wireId], this.undefinedIfNotSwitch(gate), this.getTickRate(gate)));
        }
    }

    public deleteEdge(wire: Wire): void {
        this.wires.delete(wire.wireId);

        const source = wire.source;
        const target = wire.target;

        this.removeOutput(source.placeableId, wire.wireId);
        this.removeInput(target.placeableId, wire.wireId);

        if (this.adjacencyList.has(source.placeableId)) {
            this.adjacencyList.get(source.placeableId)!.delete(target.placeableId);
            if (this.adjacencyList.get(source.placeableId)!.size === 0) {
                this.adjacencyList.delete(source.placeableId);
            }
        }

        this.netList.delete(wire.wireId);

        // this.log();
    }

    private removeInput(gateId: number, wireId: number): void {
        const gate = this.gates.get(gateId);

        if (gate) {
            gate.inputs = gate.inputs.filter(id => id !== wireId);

            if (gate.outputs.length === 0 && gate.inputs.length === 0) {
                this.gates.delete(gateId);
            }
        } else {
            console.warn(`Gate with ID ${gateId} not found.`);
        }
    }

    private removeOutput(gateId: number, wireId: number): void {
        const gate = this.gates.get(gateId);

        if (gate) {
            gate.outputs = gate.outputs.filter(id => id !== wireId);

            if (gate.outputs.length === 0 && gate.inputs.length === 0) {
                this.gates.delete(gateId);
            }
        } else {
            console.warn(`Gate with ID ${gateId} not found.`);
        }
    }

    private undefinedIfNotSwitch(gate: Placeable): Value {
        if (gate.type === PlaceableType.SWITCH) {
            return (gate as Switch).isOn ? 1 : 0;
        }

        return undefined;
    }

    private getTickRate(gate: Placeable): number | undefined {
        if (gate.type === PlaceableType.CLOCK) {
            return (gate as Clock).getTickRate();
        }
    }
}

