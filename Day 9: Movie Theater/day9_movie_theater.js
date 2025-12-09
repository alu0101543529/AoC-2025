/**
 * AoC 2025: Day 9: Movie Theater

 * @file    day9_movie_theater.js
 * @author  Raúl Gonzalez Acosta
 * @date    09/12/2025
 * @brief   Solves a puzzle involving seating arrangements in a movie theater.
 *          - Part 1: Finds the largest rectangular area of red tiles.
 *          - Part 2: Finds the largest rectangular area of green tiles avoiding lines between red tiles.
 * @see     https://adventofcode.com/2025/day/9
 */


import fs from 'fs';

/**
 * @brief Calculate the maximum rectangular area using red tiles
 * @param {string} input The input string containing coordinates of red tiles
 * @returns {number} The maximum area
 */
function maxAreawithRedTiles(input) {
  // Read and parse input
  const redTiles = input.split('\n').map(line => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
  });

  let maxArea = 0;

  // Try all pairs of red tiles as opposite corners
  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const tile1 = redTiles[i];
      const tile2 = redTiles[j];

      // Calculate rectangle area
      const width = Math.abs(tile2.x - tile1.x);
      const height = Math.abs(tile2.y - tile1.y);
      const area = width * height;

      maxArea = Math.max(maxArea, area);
    }
  }

  return maxArea;
}

/**
 * @brief Calculate the maximum rectangular area using green tiles avoiding lines between red tiles
 * @param {string} input The input string containing coordinates of red tiles
 * @returns {number} The maximum area
 */
function maxAreaWithGreenTiles(input) {
  const redTiles = input.split('\n').map(line => {
    const [x, y] = line.split(',').map(Number);
    return [x, y];
  });

  // Build lines connecting consecutive red tiles
  const lines = [];
  for (let i = 1; i < redTiles.length; i++) {
    lines.push([redTiles[i - 1], redTiles[i]]);
  }
  lines.push([redTiles[redTiles.length - 1], redTiles[0]]);

  // Check if two line segments intersect
  const intersects = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return false;
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    
    return t > 0 && t < 1 && u > 0 && u < 1;
  };

  // Pre-compute bounding boxes for lines to skip intersection checks
  const lineBounds = lines.map(([[x1, y1], [x2, y2]]) => ({
    minX: Math.min(x1, x2), maxX: Math.max(x1, x2),
    minY: Math.min(y1, y2), maxY: Math.max(y1, y2)
  }));

  let maxArea = 0;

  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const [x1, y1] = redTiles[i];
      const [x2, y2] = redTiles[j];
      
      // Skip if tiles share x or y coordinate (degenerate rectangle)
      if (x1 === x2 || y1 === y2) { continue; }

      const rectMinX = Math.min(x1, x2);
      const rectMaxX = Math.max(x1, x2);
      const rectMinY = Math.min(y1, y2);
      const rectMaxY = Math.max(y1, y2);

      // Check intersection with bounding box first
      let intersected = false;
      for (let k = 0; k < lines.length; k++) {
        const bounds = lineBounds[k];
        // Skip if bounding boxes don't overlap
        if (bounds.maxX < rectMinX || bounds.minX > rectMaxX ||
            bounds.maxY < rectMinY || bounds.minY > rectMaxY) {
          continue;
        }

        const [[lx1, ly1], [lx2, ly2]] = lines[k];
        if (intersects(x1, y1, x2, y2, lx1, ly1, lx2, ly2) ||
            intersects(x1, y2, x2, y1, lx1, ly1, lx2, ly2)) {
          intersected = true;
          break;
        }
      }

      if (!intersected) {
        const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
        maxArea = Math.max(maxArea, area);
      }
    }
  }

  return maxArea;
}

// Read input file
const input = fs.readFileSync('input.txt', 'utf8').trim();

// Display results
console.log("Part 1:", maxAreawithRedTiles(input));
console.log("Part 2:", maxAreaWithGreenTiles(input));