
/**
 * Finds all possible rectangular dimensions (w, h) for a given total area N
 * such that both dimensions are <= maxDim.
 */
export const getPossibleRectangles = (n: number, maxDim: number = 10): [number, number][] => {
  const rects: [number, number][] = [];
  for (let w = 1; w <= maxDim; w++) {
    if (n % w === 0) {
      const h = n / w;
      if (h <= maxDim) {
        rects.push([w, h]);
      }
    }
  }
  return rects;
};

/**
 * Generates a set of winning cell indices forming a rectangle.
 */
export const generateWinningIndices = (n: number, gridSize: number = 10): Set<number> | null => {
  const possibilities = getPossibleRectangles(n, gridSize);
  if (possibilities.length === 0) return null;

  // Pick a random valid rectangle shape
  const [w, h] = possibilities[Math.floor(Math.random() * possibilities.length)];

  // Pick a random top-left corner
  const startX = Math.floor(Math.random() * (gridSize - w + 1));
  const startY = Math.floor(Math.random() * (gridSize - h + 1));

  const winningIndices = new Set<number>();
  for (let y = startY; y < startY + h; y++) {
    for (let x = startX; x < startX + w; x++) {
      winningIndices.add(y * gridSize + x);
    }
  }

  return winningIndices;
};
