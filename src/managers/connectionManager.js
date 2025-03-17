import { ConnectionPoint } from "../entities/connectionPoint";

export class ConnectionManager {
  constructor(parentGate) {
    this.parentGate = parentGate;
    this.connectionPoints = [];
  }

  createConnectionPoints() {
    let inputPositions = [];
    let outputPositions = [];

    switch (this.parentGate.type) {
      case "and":
      case "nand":
        inputPositions = [
          { x: -25, y: -10 },
          { x: -25, y: 10 },
        ];
        outputPositions = [{ x: 25, y: 0 }];
        break;
      case "or":
      case "nor":
        inputPositions = [
          { x: -25, y: -10 },
          { x: -25, y: 10 },
        ];
        outputPositions = [{ x: 25, y: 0 }];
        break;
      case "not":
        inputPositions = [{ x: -25, y: 0 }];
        outputPositions = [{ x: 25, y: 0 }];
        break;
      case "xor":
      case "xnor":
        inputPositions = [
          { x: -25, y: -10 },
          { x: -25, y: 10 },
        ];
        outputPositions = [{ x: 25, y: 0 }];
        break;
      default:
        inputPositions = [{ x: -25, y: 0 }];
        outputPositions = [{ x: 25, y: 0 }];
    }

    inputPositions.forEach((pos) => {
      const point = new ConnectionPoint("input");
      point.x = pos.x;
      point.y = pos.y;
      this.connectionPoints.push(point);
      this.parentGate.addChild(point);
    });

    outputPositions.forEach((pos) => {
      const point = new ConnectionPoint("output");
      point.x = pos.x;
      point.y = pos.y;
      this.connectionPoints.push(point);
      this.parentGate.addChild(point);
    });
  }
}
