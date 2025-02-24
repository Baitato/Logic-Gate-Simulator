export class GateActions {
  constructor(gate) {
    this.gate = gate;
  }

  assertArgLength(length, ...args) {
    console.error("Invalid inputs for type " + this.gate + " : " + args);
    return false;
  }

  performAction(...input) {
    switch (this.gate) {
      case "and":
        this.performAnd(input);
        break;
      case "or":
        this.performOr(input);
        break;
      case "not":
        this.performNot(input);
        break;
      case "xor":
        this.performXor(input);
        break;
      case "nand":
        this.performNand(input);
        break;
      case "nor":
        this.performNor(input);
        break;
      case "xnor":
        this.performXnor(input);
        break;
    }
  }

  performAnd(...input) {
    if (!this.assertArgLength(2, input)) return;

    return input[0] && input[1];
  }

  performOr(...input) {
    if (!this.assertArgLength(2, input)) return;

    return input[0] || input[1];
  }

  performNot(...input) {
    if (!this.assertArgLength(1, input)) return;

    return input[0];
  }

  performXor(...input) {
    if (!this.assertArgLength(2, input)) return;

    return input[0] != input[1];
  }

  performNand(...input) {
    if (!this.assertArgLength(2, input)) return;

    return !this.performAnd(input);
  }

  performNor(...input) {
    if (!this.assertArgLength(2, input)) return;

    return !this.performOr(input);
  }

  performXnor(...input) {
    if (!this.assertArgLength(2, input)) return;

    return !this.performXor(input);
  }
}
