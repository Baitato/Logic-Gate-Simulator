import { Gate } from "./Gate";

export class NotGate extends Gate {
    static assetName: string = "not";

    constructor(x: number, y: number) {
        super(x, y);

        this.setUpGate(NotGate.assetName);
    }
}