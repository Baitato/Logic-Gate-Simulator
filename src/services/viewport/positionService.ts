import { Placeable } from "../../models/Placeable";

const positions = new Map<string, Placeable>();
const xCoords = new Map<number, Set<string>>(); // x -> set of keys at that x
const yCoords = new Map<number, Set<string>>(); // y -> set of keys at that y

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace PositionService {
  export function getKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  export function getObject(x: number, y: number): Placeable | undefined {
    const key = getKey(x, y);
    return positions.get(key);
  }

  export function move(newX: number, newY: number, placeable: Placeable): void {
    if (getObject(newX, newY) == null)
      return;

    destroy(placeable.x, placeable.y);
    addObject(newX, newY, placeable);
  }

  function addObject(x: number, y: number, obj: Placeable): void {
    const key = getKey(x, y);
    positions.set(key, obj);

    // Track by x coordinate
    if (!xCoords.has(x)) xCoords.set(x, new Set());
    xCoords.get(x)!.add(key);

    // Track by y coordinate
    if (!yCoords.has(y)) yCoords.set(y, new Set());
    yCoords.get(y)!.add(key);
  }

  export function save(x: number, y: number, placeableObject: Placeable): void {
    addObject(x, y, placeableObject);
  }

  export function destroy(x: number, y: number): void {
    const key = getKey(x, y);
    positions.delete(key);

    // Remove from coordinate sets
    xCoords.get(x)?.delete(key);
    if (xCoords.get(x)?.size === 0) xCoords.delete(x);

    yCoords.get(y)?.delete(key);
    if (yCoords.get(y)?.size === 0) yCoords.delete(y);
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
    xCoords.clear();
    yCoords.clear();
  }

  export function getObjectsInBounds(minX: number, minY: number, width: number, height: number): Set<Placeable> {
    const maxX = minX + width;
    const maxY = minY + height;

    // Get all keys that have x in range
    const xCandidates = new Set<string>();
    for (const [x, keys] of xCoords) {
      if (x >= minX && x <= maxX) {
        keys.forEach(key => xCandidates.add(key));
      }
    }

    // Filter by y in range and collect results
    const result: Set<Placeable> = new Set();
    for (const key of xCandidates) {
      const [, py] = key.split(',').map(Number);
      if (py >= minY && py <= maxY) {
        const obj = positions.get(key);
        if (obj) result.add(obj);
      }
    }

    return result;
  }
}

export default PositionService;