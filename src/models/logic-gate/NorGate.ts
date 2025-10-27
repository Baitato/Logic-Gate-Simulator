import { Gate } from "./Gate";

export class NorGate extends Gate {
    static assetName: string = "nor";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(NorGate.assetName);
    }
}