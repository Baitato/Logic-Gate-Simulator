import { viewport } from "../core/viewport";
import { LogicGate } from "../entities/logicGate";
const gatePositions = new Map();

export function getKey(x, y) {
  return `${x},${y}`;
}

export function getObject(x, y) {
  const key = getKey(x, y);
  return gatePositions.get(key);
}

function addObject(x, y, obj) {
  const newGate = new LogicGate(obj);
  newGate.initialize(x, y);
  viewport.addChild(newGate);
  const key = getKey(x, y);
  gatePositions.set(key, obj);
}

export function save(x, y, gate) {
  x = Math.round(x);
  y = Math.round(y);
  addObject(x, y, gate);
}

export function checkIfGateExists(x, y) {
  const key = getKey(x, y);
  return gatePositions.has(key);
}
