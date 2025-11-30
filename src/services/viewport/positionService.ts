import { Placeable } from "../../models/Placeable";

const positions = new Map<string, Placeable>();

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
  addObject(x, y, placeableObject);
}

export function destroy(x: number, y: number): void {
  const key = getKey(x, y);
  positions.delete(key);
}

export function checkIfGateExists(x: number, y: number): boolean {
  const key = getKey(x, y);
  return positions.has(key);
}

export function clearAll(): void {
  positions.forEach((placeable) => {
    placeable.destroy();
  });
  positions.clear();
}