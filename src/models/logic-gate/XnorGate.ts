import { Gate } from "./Gate";

export class XnorGate extends Gate {
    static assetName: string = "xnor";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(XnorGate.assetName);
    }
}