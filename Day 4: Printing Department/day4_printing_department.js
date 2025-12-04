/**
 * AoC 2025: Day 4: Printing Department

 * @file    day4_printing_department.js
 * @author  Raúl Gonzalez Acosta
 * @date    04/12/2025
 * @brief   Solves a printing department puzzle involving roll removal.
 *          Simulates the removal of paper rolls based on surrounding rolls:
 *          - Part 1: Stops after first round of removals.
 *          - Part 2: Continues until no more rolls can be removed.
 * @see     https://adventofcode.com/2025/day/4
 */

import fs from "fs";

/**
 * @brief Runs the printing department puzzle solution
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse grid and find paper roll locations
  const grid = fileContents.map((line) => line.split(""));
  const maxY = grid.length - 1;
  const maxX = grid[0].length - 1;
  
  const paperLocs = new Set();
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (grid[y][x] === "@") {
        paperLocs.add(`${y},${x}`);
      }
    }
  }

  const data = { paperLocs, maxX, maxY };
  const part1 = solution(data, 1);
  const part2 = solution(data);
  return { part1, part2 };
};

// Directions for 8 surrounding cells
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

/**
 * @brief Find the number of rolls to be removed
 * @param {{paperLocs: Set, maxY: number, maxX: number}} data The puzzle data
 * @param {number} maxRounds Maximum number of rounds to simulate
 * @returns The total number of rolls removed
 */
const solution = (data, maxRounds = Infinity) => {
  let totalRemoved = 0;
  const paperLocs = new Set(data.paperLocs);
  const { maxY, maxX } = data;

  for (let round = 0; round < maxRounds; round++) {
    const toBeRemoved = [];

    for (let loc of paperLocs) {
      const [y, x] = loc.split(',').map(Number);
      
      // Count surrounding rolls
      let surroundingCount = 0;
      for (const [dy, dx] of DIRECTIONS) {
        const newY = y + dy;
        const newX = x + dx;
        
        if (newY >= 0 && newY <= maxY && newX >= 0 && newX <= maxX) {
          if (paperLocs.has(`${newY},${newX}`)) {
            surroundingCount++;
          }
        }
      }

      // Remove if less than 4 surrounding rolls
      if (surroundingCount < 4) {
        toBeRemoved.push(loc);
      }
    }

    if (toBeRemoved.length === 0) break;

    totalRemoved += toBeRemoved.length;
    for (const loc of toBeRemoved) {
      paperLocs.delete(loc);
    }
  }

  return totalRemoved;
};

const fileContents = fs.readFileSync("input.txt", "utf-8").trim().split("\n");

console.log("Part 1:", run(fileContents).part1);
console.log("Part 2:", run(fileContents).part2);