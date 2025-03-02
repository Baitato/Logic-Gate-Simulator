import { GateActions } from "../GateActions";

export class Gate {
  constructor(gateType, x, y, enabled, input, output) {
    this.gateType = gateType;
    this.x = x;
    this.y = y;
    this.enabled = enabled;
    this.input = input;
    this.output = output;
    this.gateAction = new GateActions(gateType);
  }
}
