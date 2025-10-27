import { Gate } from "../../models/logic-gate/Gate";

const gatePositions = new Map();

export function getKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function getObject(x: number, y: number): Gate | undefined {
  const key = getKey(x, y);
  return gatePositions.get(key);
}

function addObject(x: number, y: number, obj: Gate): void {
  const key = getKey(x, y);
  gatePositions.set(key, obj);
}

export function save(x: number, y: number, gate: Gate): void {
  x = Math.round(x);
  y = Math.round(y);
  addObject(x, y, gate);
}

export function checkIfGateExists(x: number, y: number): boolean {
  const key = getKey(x, y);
  return gatePositions.has(key);
}
