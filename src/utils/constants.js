export const gates = ["and", "nand", "or", "nor", "xor", "xnor", "not"];
export const gateSpriteDimensions = { x: 50, y: 50 };

export const gridSize = 50;
export const getCellCenter = (x, y) => {
  return {
    x: Math.floor(x / gridSize) * gridSize + gridSize / 2,
    y: Math.floor(y / gridSize) * gridSize + gridSize / 2,
  };
};
