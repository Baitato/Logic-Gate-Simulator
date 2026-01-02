import { Wire } from "../models/Wire";


export interface WirePublisher {
    addWireListener(listener: WireListener): void;
}

export interface WireListener {
    onWireClick(wire: Wire): void;
}