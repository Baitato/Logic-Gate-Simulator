import { Gate } from "./Gate";

export class AndGate extends Gate {
    static assetName: string = "and";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(AndGate.assetName);
    }
}