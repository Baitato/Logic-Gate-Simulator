import { Gate } from "./Gate";

export class NandGate extends Gate {
    static assetName: string = "nand";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(NandGate.assetName);
    }
}