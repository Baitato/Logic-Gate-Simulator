import { Gate } from "./Gate";

export class OrGate extends Gate {
    static assetName: string = "or";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(OrGate.assetName);
    }
}