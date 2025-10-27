import { Gate } from "./Gate";

export class XorGate extends Gate {
    static assetName: string = "xor";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(XorGate.assetName);
    }
}