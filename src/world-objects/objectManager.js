const gatePositions = new Map();

function getKey(x, y) {
  return `${x},${y}`;
}

function addObject(x, y, obj) {
  const key = getKey(x, y);
  gatePositions.set(key, obj);
}

function getObject(x, y) {
  const key = getKey(x, y);
  return gatePositions.get(key);
}

export function save(x, y, gate) {
  addObject(x, y, gate);
  console.log(getObject(x, y));
}
