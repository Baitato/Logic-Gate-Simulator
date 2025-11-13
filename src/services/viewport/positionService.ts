import { Placeable } from "../../models/Placeable";

const positions = new Map();

export function getKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function getObject(x: number, y: number): Placeable | undefined {
  const key = getKey(x, y);
  return positions.get(key);
}

function addObject(x: number, y: number, obj: Placeable): void {
  const key = getKey(x, y);
  positions.set(key, obj);
}

export function save(x: number, y: number, placeableObject: Placeable): void {
  x = Math.round(x);
  y = Math.round(y);
  addObject(x, y, placeableObject);
}

export function destroy(x: number, y: number): void {
  x = Math.round(x);
  y = Math.round(y);
  const key = getKey(x, y);
  console.log(key);
  positions.delete(key);
}

export function checkIfGateExists(x: number, y: number): boolean {
  const key = getKey(x, y);
  return positions.has(key);
}
